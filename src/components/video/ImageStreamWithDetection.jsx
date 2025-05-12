import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const ImageStreamWithDetection = ({ setKeypoints }) => {
  const [imageData, setImageData] = useState(null);
  const [bboxes, setBboxes] = useState([]);
  const [fps, setFps] = useState(0);
  const [rosConnected, setRosConnected] = useState(false);

  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rosRef = useRef(null);
  const dashboardTopicRef = useRef(null);

  useEffect(() => {
    if (rosRef.current === null) {
      const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
      rosRef.current = ros;

      ros.on('connection', () => {
        console.log('✅ Connected to ROS bridge');
        setRosConnected(true);
        subscribeToTopics(ros);
      });

      ros.on('error', (error) => {
        console.error('❌ ROS bridge error:', error);
      });

      ros.on('close', () => {
        console.log('⚠️ Connection to ROS bridge closed');
        setRosConnected(false);
        setTimeout(() => rosRef.current?.connect(), 3000);
      });
    }

    const subscribeToTopics = (ros) => {
      if (!dashboardTopicRef.current) {
        const dashboardTopic = new ROSLIB.Topic({ 
          ros, 
          name: '/dashboard/data',
        });

        dashboardTopic.subscribe((message) => {
          try {
            const dashboardData = JSON.parse(message.data);

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

            if (dashboardData.bboxes) {
              setBboxes(dashboardData.bboxes);
            }

            if (dashboardData.keypoints) {
              const formattedKeypoints = dashboardData.keypoints.map(person => ({
                keypoints: person.map(point => ({
                  x: point[0],
                  y: point[1],
                  confidence: point[2]
                }))
              }));
              setKeypoints(formattedKeypoints);  // ✅ 상위 컴포넌트에서 관리
            }
          } catch (e) {
            console.error('Failed to parse dashboard data:', e);
          }
        });

        dashboardTopicRef.current = dashboardTopic;
      }
    };

    return () => {
      dashboardTopicRef.current?.unsubscribe();
      rosRef.current?.close();
      dashboardTopicRef.current = rosRef.current = null;
    };
  }, [setKeypoints]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {!imageData ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 w-full h-full flex items-center justify-center">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"></div>
            <p className="text-gray-700">카메라 스트림 연결 중...</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10" />
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt="Live Stream"
            className="w-full h-full object-cover"
          />

          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 640 480"
            preserveAspectRatio="xMidYMid meet"
          >
            {bboxes.map((bbox, index) => (
              <rect
                key={`bbox-${index}`}
                x={bbox.x1}
                y={bbox.y1}
                width={bbox.x2 - bbox.x1}
                height={bbox.y2 - bbox.y1}
                stroke="rgba(46, 213, 115, 0.8)"
                strokeWidth="2.5"
                fill="none"
                rx="4"
                strokeDasharray="8 4"
              />
            ))}
          </svg>

          <div className="absolute top-3 left-3 flex items-center z-30">
            <div className={`flex items-center ${rosConnected ? 'bg-green-500' : 'bg-red-500'} text-white text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md`}>
              <div className={`w-2 h-2 rounded-full ${rosConnected ? 'bg-white' : 'bg-red-200'} mr-1.5 ${rosConnected ? 'animate-pulse' : ''}`} />
              {rosConnected ? 'LIVE' : '연결 중...'}
            </div>
            <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium ml-2 px-2.5 py-1.5 rounded-full shadow-md">
              {fps} FPS
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageStreamWithDetection;
