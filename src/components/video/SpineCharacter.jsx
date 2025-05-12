import React, { useRef, useEffect } from 'react';
import ROSLIB from 'roslib';

const SpineCharacter = () => {
  const canvasRef = useRef(null);
  const keypointsRef = useRef(null);

  const skeletonPairs = [
    [5, 7], [6, 8], [7, 9], [8, 10],
    [11, 13], [12, 14], [13, 15], [14, 16],
    [5, 6], [11, 12], [5, 11], [6, 12],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const keypoints = keypointsRef.current;
      if (!keypoints) return;

      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'red';

      skeletonPairs.forEach(([a, b]) => {
        const p1 = keypoints[a];
        const p2 = keypoints[b];
        if (p1 && p2 && p1.confidence > 0.5 && p2.confidence > 0.5) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      keypoints.forEach((pt) => {
        if (pt.confidence > 0.5) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    };

    const interval = setInterval(draw, 1000 / 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
    const topic = new ROSLIB.Topic({ ros, name: '/detector/web_keypoints' });

    topic.subscribe((message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.length > 0 && data[0].keypoints) {
          keypointsRef.current = data[0].keypoints;
        }
      } catch (e) {
        console.error('Invalid keypoint data:', e);
      }
    });

    return () => topic.unsubscribe();
  }, []);

  return <canvas ref={canvasRef} width={640} height={480} style={{ border: '1px solid #444' }} />;
};

export default SpineCharacterFromROS;
