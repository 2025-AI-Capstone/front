import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const ImageStreamWithDetection = () => {
  const [imageData, setImageData] = useState(null);
  const [keypoints, setKeypoints] = useState([]);
  const [bboxes, setBboxes] = useState([]);
  const [fps, setFps] = useState(0);
  const [rosConnected, setRosConnected] = useState(false);

  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rosRef = useRef(null);
  const imageTopicRef = useRef(null);
  const keypointsTopicRef = useRef(null);
  const bboxTopicRef = useRef(null);

  useEffect(() => {
    if (rosRef.current === null) {
      const ros = new ROSLIB.Ros({
        url: 'ws://localhost:9090',
      });

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

        setTimeout(() => {
          if (rosRef.current) {
            console.log('🔄 Attempting to reconnect...');
            rosRef.current.connect();
          }
        }, 3000);
      });
    }

    const subscribeToTopics = (ros) => {
      if (!imageTopicRef.current) {
        const imageTopic = new ROSLIB.Topic({
          ros,
          name: '/camera/stream'
        });

        imageTopic.subscribe((message) => {
          if (message.data) {
            setImageData(message.data);

            frameCountRef.current += 1;
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

            if (elapsedTime >= 1) {
              setFps(Math.round(frameCountRef.current / elapsedTime));
              frameCountRef.current = 0;
              startTimeRef.current = Date.now();
            }
          }
        });

        imageTopicRef.current = imageTopic;
      }

      if (!keypointsTopicRef.current) {
        const keypointsTopic = new ROSLIB.Topic({
          ros,
          name: '/detector/web_keypoints'
        });

        keypointsTopic.subscribe((message) => {
          if (message.data) {
            try {
              const parsedKeypoints = JSON.parse(message.data);
              setKeypoints(parsedKeypoints);
            } catch (e) {
              console.error('Failed to parse keypoints:', e);
            }
          }
        });

        keypointsTopicRef.current = keypointsTopic;
      }

      if (!bboxTopicRef.current) {
        const bboxTopic = new ROSLIB.Topic({
          ros,
          name: '/detector/web_bboxes'
        });

        bboxTopic.subscribe((message) => {
          if (message.data) {
            try {
              const parsedBboxes = JSON.parse(message.data);
              setBboxes(parsedBboxes);
            } catch (e) {
              console.error('Failed to parse bboxes:', e);
            }
          }
        });

        bboxTopicRef.current = bboxTopic;
      }
    };

    return () => {
      if (imageTopicRef.current) {
        imageTopicRef.current.unsubscribe();
        imageTopicRef.current = null;
      }

      if (keypointsTopicRef.current) {
        keypointsTopicRef.current.unsubscribe();
        keypointsTopicRef.current = null;
      }

      if (bboxTopicRef.current) {
        bboxTopicRef.current.unsubscribe();
        bboxTopicRef.current = null;
      }

      if (rosRef.current) {
        rosRef.current.close();
        rosRef.current = null;
      }
    };
  }, []);

  const skeleton = [
    [16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13], [6, 7],
    [6, 8], [7, 9], [8, 10], [9, 11], [2, 3], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7],
  ];

  return (
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
        {/* Background placeholder when no image */}
        {!imageData && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 w-full h-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                <p className="text-gray-700">카메라 스트림 연결 중...</p>
              </div>
            </div>
        )}

        {imageData && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>

              <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt="Live Stream"
                  className="w-full h-full object-cover"
              />

              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
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

                {keypoints.map((person, personIdx) => (
                    <g key={`person-${personIdx}`}>
                      {/* Render skeleton lines */}
                      {skeleton.map((pair, lineIdx) => {
                        const p1 = person.keypoints[pair[0] - 1];
                        const p2 = person.keypoints[pair[1] - 1];
                        if (
                            p1 &&
                            p2 &&
                            p1.confidence > 0.5 &&
                            p2.confidence > 0.5
                        ) {
                          return (
                              <line
                                  key={`line-${personIdx}-${lineIdx}`}
                                  x1={p1.x}
                                  y1={p1.y}
                                  x2={p2.x}
                                  y2={p2.y}
                                  stroke="rgba(255, 107, 129, 0.85)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                              />
                          );
                        }
                        return null;
                      })}

                      {/* Render keypoints circles */}
                      {person.keypoints.map((point, pointIdx) => {
                        if (point.confidence > 0.5) {
                          return (
                              <circle
                                  key={`point-${personIdx}-${pointIdx}`}
                                  cx={point.x}
                                  cy={point.y}
                                  r="4"
                                  fill="white"
                                  stroke="rgba(255, 107, 129, 0.85)"
                                  strokeWidth="2"
                              />
                          );
                        }
                        return null;
                      })}
                    </g>
                ))}
              </svg>

              {/* Status indicators and overlays */}
              <div className="absolute top-3 left-3 flex items-center z-30">
                <div className={`flex items-center ${rosConnected ? 'bg-green-500' : 'bg-red-500'} text-white text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md`}>
                  <div className={`w-2 h-2 rounded-full ${rosConnected ? 'bg-white' : 'bg-red-200'} mr-1.5 ${rosConnected ? 'animate-pulse' : ''}`}></div>
                  {rosConnected ? 'LIVE' : '연결 중...'}
                </div>

                <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium ml-2 px-2.5 py-1.5 rounded-full shadow-md">
                  {fps} FPS
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-30">
                <div className="bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-1.5 shadow-md">
                  감지된 인원: {keypoints.length}명
                </div>

                <div className="flex items-center">
                  <button className="bg-white/90 hover:bg-white transition-colors rounded-full p-2 shadow-md mr-2">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.06-7.072m-1.06 7.072a9 9 0 010-12.728" />
                    </svg>
                  </button>

                  <button className="bg-white/90 hover:bg-white transition-colors rounded-full p-2 shadow-md">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ImageStreamWithDetection;