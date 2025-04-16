import React, { useState, useEffect } from 'react';

const ImageStreamWithDetection = () => {
  const [imageData, setImageData] = useState(null);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");  // 💡 웹소켓 주소는 실제 환경에 맞게 조정

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
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
      console.error("❌ WebSocket Error:", err);
    };

    ws.onclose = () => {
      console.log("⚠️ WebSocket disconnected");
    };

    return () => {
      ws.close(); // 컴포넌트 언마운트 시 연결 해제
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
        FPS: {fps}
      </div>
    </div>
  );
};

export default ImageStreamWithDetection;
