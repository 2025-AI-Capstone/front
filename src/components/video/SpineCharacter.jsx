import React, { useRef, useEffect } from 'react';

const SpineCharacter = ({ keypoints }) => {
  const canvasRef = useRef(null);

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
      if (!keypoints || keypoints.length === 0) return;

      const kp = keypoints[0].keypoints; // 첫 번째 사람만 그린다고 가정

      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'red';

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
    };

    const interval = setInterval(draw, 1000 / 30);
    return () => clearInterval(interval);
  }, [keypoints]);

  return <canvas ref={canvasRef} width={640} height={480} style={{ border: '1px solid #444' }} />;
};

export default SpineCharacter;
