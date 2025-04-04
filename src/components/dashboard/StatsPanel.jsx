import React from 'react';

const StatsPanel = () => {
    return (
        <div className="bg-gray-900 rounded-lg p-3">
            <h2 className="text-sm font-bold mb-2 border-b border-gray-700 pb-1">오늘의 통계</h2>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-400">총 객체 감지</span>
                    <span>127</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">총 추적 시간</span>
                    <span>3.5 시간</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">쓰러짐 감지</span>
                    <span className="text-red-400">8 건</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">신뢰도 평균</span>
                    <span>87%</span>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;