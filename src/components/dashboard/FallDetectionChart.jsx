import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FallDetectionChart = () => {
    // 모든 데이터 포인트를 저장할 상태
    const [allChartData, setAllChartData] = useState([]);
    // 현재 보여지는 데이터 윈도우
    const [visibleData, setVisibleData] = useState([]);
    // 보여지는 데이터 윈도우의 크기
    const windowSize = 10;
    // 스크롤 컨테이너 ref
    const scrollContainerRef = useRef(null);

    // 컴포넌트 마운트 시 초기 데이터 설정
    useEffect(() => {
        // 초기 데이터 생성 (최근 30분 데이터)
        const initialData = generateInitialData(30);
        setAllChartData(initialData);
        // 가장 최근 8개 데이터를 보이는 윈도우로 설정
        setVisibleData(initialData.slice(-windowSize));

        // 1분마다 데이터 업데이트
        const interval = setInterval(() => {
            updateChartData();
        }, 60000); // 실제 환경에서는 60000ms (1분)

        // 개발 중 테스트를 위한 빠른 업데이트 (10초마다)
        const testInterval = setInterval(() => {
            updateChartData();
        }, 10000); // 테스트용: 10초마다 업데이트

        return () => {
            clearInterval(interval);
            clearInterval(testInterval);
        };
    }, []);

    // 초기 데이터 생성 함수
    const generateInitialData = (minutes) => {
        const data = [];
        const now = new Date();

        // 지정된 분 수만큼 데이터 포인트 생성
        for (let i = minutes - 1; i >= 0; i--) {
            const time = new Date(now);
            time.setMinutes(now.getMinutes() - i);

            data.push({
                time: time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                count: Math.random() > 0.7 ? 1 : 0, // 30% 확률로 쓰러짐 발생
                timestamp: time.getTime() // 정렬을 위한 타임스탬프
            });
        }

        return data;
    };

    // 차트 데이터 업데이트 함수
    const updateChartData = () => {
        setAllChartData(prevData => {
            // 새로운 데이터 생성
            const now = new Date();
            const newDataPoint = {
                time: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                count: Math.random() > 0.7 ? 1 : 0, // 30% 확률로 쓰러짐 발생
                timestamp: now.getTime()
            };

            // 모든 데이터에 새 항목 추가
            const newData = [...prevData, newDataPoint];

            // 최근 8개 데이터로 보이는 윈도우 업데이트
            setVisibleData(newData.slice(-windowSize));

            return newData;
        });
    };

    // 왼쪽으로 스크롤 (과거 데이터 보기)
    const scrollLeft = () => {
        const currentFirstIndex = allChartData.findIndex(
            item => item.timestamp === visibleData[0].timestamp
        );

        if (currentFirstIndex > 0) {
            const newStartIndex = Math.max(0, currentFirstIndex - windowSize);
            setVisibleData(allChartData.slice(newStartIndex, newStartIndex + windowSize));
        }
    };

    // 오른쪽으로 스크롤 (최신 데이터 보기)
    const scrollRight = () => {
        const currentLastIndex = allChartData.findIndex(
            item => item.timestamp === visibleData[visibleData.length - 1].timestamp
        );

        if (currentLastIndex < allChartData.length - 1) {
            const newStartIndex = Math.min(
                allChartData.length - windowSize,
                currentLastIndex + 1
            );
            setVisibleData(allChartData.slice(newStartIndex, newStartIndex + windowSize));
        }
    };

    // 최신 데이터로 이동
    const scrollToLatest = () => {
        setVisibleData(allChartData.slice(-windowSize));
    };

    return (
        <div className="relative bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center">
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full mr-2 text-xs font-semibold">실시간</span>
                    쓰러짐 감지 타임라인
                </h3>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    {visibleData.length > 0 &&
                        `${visibleData[0].time} - ${visibleData[visibleData.length-1].time}`
                    }
                </div>
            </div>

            <div className="h-32 relative bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100" ref={scrollContainerRef}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visibleData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            dataKey="time"
                            stroke="#9ca3af"
                            padding={{ left: 10, right: 10 }}
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            domain={[0, 1]}
                            ticks={[0, 1]}
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => value === 0 ? '안전' : '감지'}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-md">
                                            <p className="text-gray-700 text-xs font-medium">{label}</p>
                                            <p className="text-xs font-semibold mt-1" style={{ color: payload[0].value === 0 ? '#10b981' : '#ef4444' }}>
                                                {payload[0].value === 0 ? "정상 상태" : "쓰러짐 감지됨"}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#fff', r: 4, strokeWidth: 2, stroke: '#ef4444' }}
                            activeDot={{ fill: '#ef4444', r: 6, stroke: '#fff', strokeWidth: 2 }}
                            name="쓰러짐 감지"
                            animationDuration={1000}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 네비게이션 컨트롤 */}
            <div className="flex justify-between mt-3">
                <button
                    onClick={scrollLeft}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center shadow-sm"
                >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    과거
                </button>
                <button
                    onClick={scrollToLatest}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                >
                    최신 데이터
                </button>
                <button
                    onClick={scrollRight}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center shadow-sm"
                >
                    최근
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FallDetectionChart;