import { useEffect, useState, useRef } from 'react';

const useRosWebSocket = (url = 'ws://localhost:8080') => {
  const [image, setImage] = useState(null);
  const [bboxes, setBboxes] = useState([]);
  const [keypoints, setKeypoints] = useState([]);
  const [falldetections, setFalldetections] = useState([]);
  const [trackedObjects, setTrackedObjects] = useState([]);
  const [fps, setFps] = useState(0);

  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ [ROS WebSocket] Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.image) setImage(data.image);
      if (data.bboxes) setBboxes(data.bboxes);
      if (data.keypoints) setKeypoints(data.keypoints);
      if (data.falldetections) setFalldetections(data.falldetections);
      if (data.tracked_objects) setTrackedObjects(data.tracked_objects);

      // FPS 계산
      frameCountRef.current += 1;
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

      if (elapsedTime >= 1) {
        const currentFps = Math.round(frameCountRef.current / elapsedTime);
        setFps(currentFps);
        frameCountRef.current = 0;
        startTimeRef.current = Date.now();
      }
    };

    ws.onerror = (err) => {
      console.error('❌ [ROS WebSocket] Error:', err);
    };

    ws.onclose = () => {
      console.log('⚠️ [ROS WebSocket] Disconnected');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return {
    image,
    bboxes,
    keypoints,
    falldetections,
    trackedObjects,
    fps,
  };
};

export default useRosWebSocket;
