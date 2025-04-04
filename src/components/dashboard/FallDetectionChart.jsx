import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FallDetectionChart = () => {
    // 데이터 샘플
    const chartData = [
        { time: '00:00', count: 0 },
        { time: '03:00', count: 1 },
        { time: '06:00', count: 0 },
        { time: '09:00', count: 2 },
        { time: '12:00', count: 1 },
        { time: '15:00', count: 0 },
        { time: '18:00', count: 3 },
        { time: '21:00', count: 1 },
    ];

    return (
        <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                        labelStyle={{ color: '#fff' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#f56565"
                        strokeWidth={2}
                        dot={{ fill: '#f56565', r: 4 }}
                        activeDot={{ fill: '#e53e3e', r: 6, stroke: '#fff' }}
                        name="쓰러짐 횟수"
                        animationDuration={1500}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FallDetectionChart;