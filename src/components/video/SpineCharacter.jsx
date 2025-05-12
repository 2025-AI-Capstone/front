import React, { useRef, useEffect } from 'react';
import ROSLIB from 'roslib';

const SpineCharacter = () => {
  const canvasRef = useRef(null);
  const keypointsRef = useRef([]);

  const skeletonPairs = [
    [5, 7], [6, 8], [7, 9], [8, 10],
    [11, 13], [12, 14], [13, 15], [14, 16],
    [5, 6], [11, 12], [5, 11], [6, 12],
  ];

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    const dashboardTopic = new ROSLIB.Topic({
      ros,
      name: '/dashboard/data',
      messageType: 'std_msgs/String',
    });

    dashboardTopic.subscribe((message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.keypoints && data.keypoints.length > 0) {
          const firstPerson = data.keypoints[0]; // 하나만 사용
          const formatted = firstPerson.map(([x, y, c]) => ({
            x,
            y,
            confidence: c
          }));
          keypointsRef.current = formatted;
        }
      } catch (err) {
        console.error('Invalid dashboard keypoint data:', err);
      }
    });

    return () => {
      dashboardTopic.unsubscribe();
      ros.close();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const kp = keypointsRef.current;
      if (!kp || kp.length === 0) return;

      ctx.strokeStyle = 'lime';
      ctx.fillStyle = 'red';
      ctx.lineWidth = 3;

      skeletonPairs.forEach(([a, b]) => {
        const p1 = kp[a];
        const p2 = kp[b];
        if (p1 && p2 && p1.confidence > 0.5 && p2.confidence > 0.5) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      kp.forEach((pt) => {
        if (pt.confidence > 0.5) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      style={{ border: '1px solid #ccc' }}
    />
  );
};

export default SpineCharacter;
