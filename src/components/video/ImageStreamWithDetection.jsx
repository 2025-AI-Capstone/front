import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const ImageStreamWithDetection = () => {
  const [imageData, setImageData] = useState(null);
  const [fps, setFps] = useState(0);
  const [rosConnected, setRosConnected] = useState(false);
  
  // useRef로 값들을 관리하여 리렌더링을 방지
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rosRef = useRef(null);
  const topicRef = useRef(null);

  useEffect(() => {
    // 한 번만 실행되도록 설정
    if (rosRef.current === null) {
      // ROS 연결 설정
      const ros = new ROSLIB.Ros({
        url: 'ws://localhost:9090'
      });
      
      rosRef.current = ros;

      ros.on('connection', () => {
        console.log('✅ Connected to ROS bridge');
        setRosConnected(true);
        
        // 연결이 성공한 후에만 토픽 구독
        subscribeToTopic(ros);
      });

      ros.on('error', (error) => {
        console.error('❌ ROS bridge error:', error);
      });

      ros.on('close', () => {
        console.log('⚠️ Connection to ROS bridge closed');
        setRosConnected(false);
        
        // 연결이 끊어지면 3초 후 재연결 시도
        setTimeout(() => {
          if (rosRef.current) {
            console.log('🔄 Attempting to reconnect...');
            rosRef.current.connect();
          }
        }, 3000);
      });
    }

    function subscribeToTopic(ros) {
      // 이미 구독 중이면 새로 구독하지 않음
      if (topicRef.current) return;
      
      const streamTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/camera/stream'
      });

      streamTopic.subscribe((message) => {
        if (message.data) {
          setImageData(message.data);
          
          // FPS 측정 - useRef 사용
          frameCountRef.current += 1;
          const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
          
          if (elapsedTime >= 1) {
            const newFps = Math.round(frameCountRef.current / elapsedTime);
            setFps(newFps);
            frameCountRef.current = 0;
            startTimeRef.current = Date.now();
          }
        }
      });
      
      topicRef.current = streamTopic;
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (topicRef.current) {
        topicRef.current.unsubscribe();
        topicRef.current = null;
      }
      
      if (rosRef.current) {
        rosRef.current.close();
        rosRef.current = null;
      }
    };
  }, []);

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