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
    <div className="relative w-full h-full">
      {imageData && (
        <div className="relative">
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt="Live Stream"
            className="w-full h-full"
          />

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
                    stroke="#FF0000"
                    strokeWidth="2"
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
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        FPS: {fps} {rosConnected ? '🟢' : '🔴'}
      </div>
    </div>
  );
};

export default ImageStreamWithDetection;
