import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

const ImageStreamWithDetection = () => {
  const [imageData, setImageData] = useState(null);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [rosConnected, setRosConnected] = useState(false);

  useEffect(() => {
    // 웹소켓 연결 설정 (기존 코드)
    const ws = new WebSocket("ws://localhost:9090");  // 💡 웹소켓 주소는 실제 환경에 맞게 조정

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.image) {
        setImageData(data.image);

        // FPS 측정
        const elapsedTime = (Date.now() - startTime) / 1000;
        setFrameCount((prev) => prev + 1);

        if (elapsedTime >= 1) {
          const newFps = Math.round(frameCount / elapsedTime);
          setFps(newFps);
          setFrameCount(0);
          setStartTime(Date.now());
        }
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // ROS 연결 설정
    const ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'  // rosbridge_server 주소
    });

    ros.on('connection', () => {
      console.log('Connected to ROS bridge');
      setRosConnected(true);
    });

    ros.on('error', (error) => {
      console.error('ROS bridge error:', error);
    });

    ros.on('close', () => {
      console.log('Connection to ROS bridge closed');
      setRosConnected(false);
    });

    // camera/stream 토픽 구독
    const streamTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/camera/stream',
      messageType: 'std_msgs/String'
    });

    streamTopic.subscribe((message) => {
      // base64 인코딩된 이미지 데이터를 받아 상태 업데이트
      if (message.data) {
        setImageData(message.data);
        
        // FPS 측정
        const elapsedTime = (Date.now() - startTime) / 1000;
        setFrameCount((prev) => prev + 1);

        if (elapsedTime >= 1) {
          const newFps = Math.round(frameCount / elapsedTime);
          setFps(newFps);
          setFrameCount(0);
          setStartTime(Date.now());
        }
      }
    });

    return () => {
      // 정리 함수
      ws.close();
      streamTopic.unsubscribe();
      ros.close();
    };
  }, [frameCount, startTime]);

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      {imageData && (
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt="Live Stream"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '18px'
      }}>
        FPS: {fps} {rosConnected ? '🟢' : '🔴'}
      </div>
    </div>
  );
};

export default ImageStreamWithDetection;