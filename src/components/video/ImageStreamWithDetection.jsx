import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const ImageStream = () => {
  const [imageData, setImageData] = useState(null);
  const [fps, setFps] = useState(0);
  const [rosConnected, setRosConnected] = useState(false);

  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rosRef = useRef(null);
  const imageTopicRef = useRef(null);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
    rosRef.current = ros;

    ros.on('connection', () => {
      console.log('✅ Connected to ROS bridge');
      setRosConnected(true);

      const imageTopic = new ROSLIB.Topic({
        ros,
        name: '/dashboard/data',
      });

      imageTopicRef.current = imageTopic;

      imageTopic.subscribe((message) => {
        // 데이터 형식에 따라 JSON 파싱
        const dashboardData = JSON.parse(message.data);

        // Base64 이미지 데이터 업데이트
        if (dashboardData.image) {
          setImageData(dashboardData.image);

          frameCountRef.current += 1;
          const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
          if (elapsedTime >= 1) {
            setFps(Math.round(frameCountRef.current / elapsedTime));
            frameCountRef.current = 0;
            startTimeRef.current = Date.now();
          }
        }
      });
    });

    ros.on('error', (error) => {
      console.error('❌ ROS bridge error:', error);
    });

    ros.on('close', () => {
      console.log('⚠️ Connection to ROS bridge closed');
      setRosConnected(false);
      setTimeout(() => ros.connect(), 3000);
    });

    return () => {
      if (imageTopicRef.current) {
        imageTopicRef.current.unsubscribe();
        imageTopicRef.current = null;
      }
      if (rosRef.current) {
        rosRef.current.close();
        rosRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {imageData ? (
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt="Live Stream"
          className="w-full h-full"
        />
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-gray-100">
          <p>Loading image...</p>
        </div>
      )}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        FPS: {fps} {rosConnected ? '🟢' : '🔴'}
      </div>
    </div>
  );
};

export default ImageStream;
