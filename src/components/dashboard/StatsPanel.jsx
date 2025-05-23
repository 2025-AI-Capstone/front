import React from 'react';

const StatsPanel = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-sm font-bold mb-3 text-gray-700 border-b border-gray-100 pb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                오늘의 통계
            </h2>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <div className="text-xs text-blue-600 font-medium mb-1">총 객체 감지</div>
                    <div className="flex items-baseline">
                        <span className="text-xl font-bold text-blue-700">127</span>
                        <span className="text-xs text-blue-500 ml-1">개체</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-3 border border-green-100">
                    <div className="text-xs text-green-600 font-medium mb-1">총 추적 시간</div>
                    <div className="flex items-baseline">
                        <span className="text-xl font-bold text-green-700">3.5</span>
                        <span className="text-xs text-green-500 ml-1">시간</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                    <div className="text-xs text-red-600 font-medium mb-1">쓰러짐 감지</div>
                    <div className="flex items-baseline">
                        <span className="text-xl font-bold text-red-600">8</span>
                        <span className="text-xs text-red-500 ml-1">건</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">데이터 기준: 오늘</div>
                <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium transition-colors">
                    주간 통계 보기
                </button>
            </div>
        </div>
    );
};

export default StatsPanel;