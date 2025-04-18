import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';

const ImageStreamWithDetection = () => {
  const [imageData, setImageData] = useState(null);
  const [keypoints, setKeypoints] = useState([]);
  const [bboxes, setBboxes] = useState([]);
  const [fps, setFps] = useState(0);
  const [rosConnected, setRosConnected] = useState(false);

  // useRef로 값들을 관리하여 리렌더링을 방지
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rosRef = useRef(null);
  const imageTopicRef = useRef(null);
  const keypointsTopicRef = useRef(null);
  const bboxTopicRef = useRef(null);

  useEffect(() => {
    // 한 번만 실행되도록 설정
    if (rosRef.current === null) {
      // ROS 연결 설정
      const ros = new ROSLIB.Ros({
        // url: 'ws://localhost:9090'
        url: 'ws://192.168.63.143:9090'
      });

      rosRef.current = ros;

      ros.on('connection', () => {
        console.log('✅ Connected to ROS bridge');
        setRosConnected(true);

        // 연결이 성공한 후에만 토픽 구독
        subscribeToTopics(ros);
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

    function subscribeToTopics(ros) {
      // 이미지 스트림 구독
      if (!imageTopicRef.current) {
        const imageTopic = new ROSLIB.Topic({
          ros: ros,
          name: '/camera/stream'
        });

        imageTopic.subscribe((message) => {
          if (message.data) {
            setImageData(message.data);

            // FPS 측정
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

        imageTopicRef.current = imageTopic;
      }

      // 키포인트 데이터 구독
      if (!keypointsTopicRef.current) {
        const keypointsTopic = new ROSLIB.Topic({
          ros: ros,
          name: '/detector/keypoints' // 실제 키포인트 토픽 이름으로 변경 필요
        });

        keypointsTopic.subscribe((message) => {
          // 키포인트 데이터 파싱 (메시지 구조에 맞게 수정 필요)
          if (message.data) {
            setKeypoints(message.data);
          }
        });

        keypointsTopicRef.current = keypointsTopic;
      }

      // 바운딩 박스 데이터 구독
      if (!bboxTopicRef.current) {
        const bboxTopic = new ROSLIB.Topic({
          ros: ros,
          name: '/detector/bboxes' // 실제 바운딩 박스 토픽 이름으로 변경 필요
        });

        bboxTopic.subscribe((message) => {
          // 바운딩 박스 데이터 파싱 (메시지 구조에 맞게 수정 필요)
          if (message.data) {
            const bboxArray = [];
            // 예제: 각 바운딩 박스는 [x1, y1, x2, y2, conf] 형태
            for (let i = 0; i < message.data.length; i += 5) {
              bboxArray.push({
                x1: message.data[i],
                y1: message.data[i + 1],
                x2: message.data[i + 2],
                y2: message.data[i + 3],
                conf: message.data[i + 4]
              });
            }
            setBboxes(bboxArray);
          }
        });

        bboxTopicRef.current = bboxTopic;
      }
    }

    // 컴포넌트 언마운트 시 정리
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

  // COCO 스켈레톤 정의
  const skeleton = [
    [16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13], [6, 7],
    [6, 8], [7, 9], [8, 10], [9, 11], [2, 3], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7]
  ];

  return (
      <div className="relative w-full h-full">
        {/* 기본 이미지 */}
        {imageData && (
            <div className="relative">
              <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt="Live Stream"
                  className="w-full h-full"
              />

              {/* 바운딩 박스 오버레이 */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {bboxes.map((bbox, index) => (
                    <rect
                        key={`bbox-${index}`}
                        x={bbox.x1}
                        y={bbox.y1}
                        width={bbox.x2 - bbox.x1}
                        height={bbox.y2 - bbox.y1}
                        stroke="#00FF00"
                        strokeWidth="2"
                        fill="none"
                    />
                ))}

                {/* 키포인트 및 스켈레톤 오버레이 */}
                {keypoints.map((person, personIdx) => (
                    <g key={`person-${personIdx}`}>
                      {/* 스켈레톤 라인 먼저 그리기 */}
                      {skeleton.map((pair, lineIdx) => {
                        const p1 = person[pair[0] - 1];
                        const p2 = person[pair[1] - 1];
                        if (p1 && p2 && p1[2] > 0.5 && p2[2] > 0.5) {
                          return (
                              <line
                                  key={`line-${personIdx}-${lineIdx}`}
                                  x1={p1[0]}
                                  y1={p1[1]}
                                  x2={p2[0]}
                                  y2={p2[1]}
                                  stroke="#FF0000"
                                  strokeWidth="2"
                              />
                          );
                        }
                        return null;
                      })}

                      {/* 키포인트 점 그리기 */}
                      {person.map((point, pointIdx) => {
                        if (point[2] > 0.5) {  // 신뢰도 임계값 체크
                          return (
                              <circle
                                  key={`point-${personIdx}-${pointIdx}`}
                                  cx={point[0]}
                                  cy={point[1]}
                                  r="3"
                                  fill="#00FF00"
                              />
                          );
                        }
                        return null;
                      })}
                    </g>
                ))}
              </svg>
            </div>
        )}

        {/* FPS 및 연결 상태 표시 */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          FPS: {fps} {rosConnected ? '🟢' : '🔴'}
        </div>
      </div>
  );
};

export default ImageStreamWithDetection;