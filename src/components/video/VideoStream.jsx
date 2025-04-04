import React from 'react';
import FallAlert from '../alerts/FallAlert';

const VideoStream = () => {
    // 실제 구현에서는 WebSocket으로 비디오 스트림 데이터를 받게 됩니다
    const fallDetected = true; // 테스트를 위해 true로 설정

    return (
        <div className="relative">
            <div className="relative" style={{ height: "65vh" }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <span className="text-gray-500">카메라 스트림</span>
                </div>

                {/* 가상의 녹색 테두리 - 실제 구현시 제거 */}
                <div className="absolute inset-0 border-2 border-green-500 m-auto w-1/3 h-3/5"></div>

                {fallDetected && <FallAlert />}
            </div>
        </div>
    );
};

export default VideoStream;