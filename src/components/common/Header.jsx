import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const [showFallModal, setShowFallModal] = useState(false); // 모달 상태

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    const handleLogClick = () => {
        navigate('/logs');
    };

    const handleFallAlertClick = () => {
        setShowFallModal(true);
    };

    const closeModal = () => {
        setShowFallModal(false);
    };

    const updateTime = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        setCurrentTime(now.toLocaleString('ko-KR', options));
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg m-2">
            {/* 좌측 로고 + 텍스트 */}
            <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">F</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">FOCUS</h1>
                <span className="ml-2 text-xs text-gray-500">안전한 홈 케어 솔루션</span>
            </div>

            {/* 우측 버튼들 */}
            <div className="flex items-center space-x-3">
                <div className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full text-sm text-white font-medium shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    시스템 정상
                </div>
                <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                    {currentTime}
                </div>

                {/* 낙상 알림 끄기 버튼 */}
                <div className="relative group">
                    <button
                        onClick={handleFallAlertClick}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"/>
                        </svg>
                    </button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                            낙상 알림 끄기
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                </div>

                {/* 설정 버튼 */}
                <div className="relative group">
                    <button
                        onClick={handleSettingsClick}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                            설정
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                </div>

                {/* 로그 버튼 */}
                <div className="relative group">
                    <button
                        onClick={handleLogClick}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
                            로그 보기
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 낙상 알림 끄기 모달 */}
            {showFallModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
                        <h2 className="text-lg font-semibold mb-4">낙상 알림을 끄시겠습니까?</h2>
                        <p className="text-sm text-gray-600 mb-6">이 작업은 실제로 적용되지 않습니다.</p>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
