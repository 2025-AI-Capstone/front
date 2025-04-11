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
        <div className="relative">
            <div className="h-32 relative" ref={scrollContainerRef}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visibleData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis
                            dataKey="time"
                            stroke="#aaa"
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            stroke="#aaa"
                            domain={[0, 1]}
                            ticks={[0, 1]}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-gray-800 p-2 border border-gray-700 rounded">
                                            <p className="text-white text-sm">{label}</p>
                                            <p className="text-sm text-white">
                                                {payload[0].value === 0 ? "감지 없음" : "쓰러짐 감지"}
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
                            stroke="#f56565"
                            strokeWidth={2}
                            dot={{ fill: '#f56565', r: 4 }}
                            activeDot={{ fill: '#e53e3e', r: 6, stroke: '#fff' }}
                            name="쓰러짐 감지"
                            animationDuration={1000}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 네비게이션 컨트롤 */}
            <div className="flex justify-between mt-2">
                <button
                    onClick={scrollLeft}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                    ◀ 과거
                </button>
                <button
                    onClick={scrollToLatest}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                    최신 데이터
                </button>
                <button
                    onClick={scrollRight}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                    최근 ▶
                </button>
            </div>

            {/* 데이터 범위 표시 */}
            <div className="text-center text-xs text-gray-400 mt-1">
                {visibleData.length > 0 &&
                    `데이터 범위: ${visibleData[0].time} - ${visibleData[visibleData.length-1].time}`
                }
            </div>
        </div>
    );
};

export default FallDetectionChart;