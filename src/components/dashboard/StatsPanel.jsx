import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsPanel = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/stats/today');
            setStats(response.data);
        } catch (error) {
            console.error('오늘의 통계 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center text-gray-500">
                로딩 중...
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center text-red-500">
                데이터를 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-700">오늘의 통계</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">기준일: {formatDate(stats.date)}</span>
                    <button
                        onClick={fetchStats}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium transition-colors"
                        title="새로고침"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 w-full">
                    {/* 쓰러짐 감지 */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                        <div className="text-xs text-red-600 font-medium mb-1">쓰러짐 감지</div>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-red-600">{stats.fall_event_count}</span>
                            <span className="text-xs text-red-500 ml-1">건</span>
                        </div>
                    </div>

                    {/* 평균 confidence score */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-100">
                        <div className="text-xs text-yellow-700 font-medium mb-1">평균 Confidence</div>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-yellow-700">
                                {typeof stats.average_confidence_score === 'number'
                                    ? stats.average_confidence_score.toFixed(2)
                                    : '-'}
                            </span>
                            <span className="text-xs text-yellow-600 ml-1">점</span>
                        </div>
                    </div>

                    {/* 루틴 등록 수 */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                        <div className="text-xs text-blue-600 font-medium mb-1">루틴 등록 수</div>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-blue-700">{stats.routine_count}</span>
                            <span className="text-xs text-blue-500 ml-1">건</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
