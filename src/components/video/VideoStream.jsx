import React from 'react';
import FallAlert from '../alerts/FallAlert';

const VideoStream = () => {
    // 실제 구현에서는 WebSocket으로 비디오 스트림 데이터를 받게 됩니다
    const fallDetected = true; // 테스트를 위해 true로 설정

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="relative" style={{ height: "65vh" }}>
                {/* 배경 그라데이션 */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-50 to-slate-100">
                    <div className="text-center">
                        <div className="inline-block p-3 bg-white rounded-full shadow-md mb-3">
                            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-medium">카메라 연결 중...</p>
                        <div className="mt-3 flex space-x-1 justify-center">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>

                {/* 카메라 인터페이스 요소 */}
                <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                    <div className="flex space-x-2">
                        <span className="flex items-center px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium shadow-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            실시간
                        </span>
                        <span className="flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium shadow-sm">
                            HD
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        <button className="p-1.5 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm transition-colors">
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button className="p-1.5 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm transition-colors">
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 가상의 사람 감지 영역 - 모서리가 둥근 스타일 */}
                <div className="absolute inset-0 m-auto w-1/3 h-3/5 border-2 border-green-400 border-dashed rounded-lg flex items-center justify-center">
                    <div className="px-2.5 py-1 bg-green-400/80 backdrop-blur-sm text-white text-xs font-medium rounded">
                        사람 감지됨
                    </div>
                </div>

                {/* 하단 컨트롤 */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
                    <div className="flex items-center bg-black/30 backdrop-blur-sm text-white text-xs py-1 px-2.5 rounded-full shadow-sm">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        AI 분석 활성화
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs shadow-sm">
                        30 FPS
                    </div>
                </div>

                {fallDetected && <FallAlert />}
            </div>
        </div>
    );
};

export default VideoStream;