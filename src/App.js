import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import NodeStatus from './components/dashboard/NodeStatus';
import EventLog from './components/dashboard/EventLog';
import ImageStreamWithDetection from './components/video/ImageStreamWithDetection';
import QuickActions from './components/dashboard/QuickActions';
import StatsPanel from './components/dashboard/StatsPanel';
import FallDetectionChart from './components/dashboard/FallDetectionChart';
import './App.css';

function App() {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <div className="flex justify-between items-center p-4 bg-gray-900">
                <h1 className="text-xl font-bold">FOCUS</h1>
                <div className="flex space-x-2">
                    <div className="px-2 py-1 bg-green-600 rounded text-sm">시스템 정상</div>
                    <div className="px-2 py-1 bg-gray-700 rounded text-sm">{currentTime}</div>
                </div>
            </div>

            <main className="p-4">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main Video Stream - 9 columns */}
                    <div className="col-span-9 bg-gray-900 rounded-lg overflow-hidden">
                        <ImageStreamWithDetection />
                    </div>

                    {/* Right Sidebar - 3 columns */}
                    <div className="col-span-3 space-y-4">
                        <NodeStatus />
                        <EventLog />
                        <QuickActions />
                        <StatsPanel />
                    </div>
                </div>

                {/* Fall Detection Chart - Bottom Section */}
                <div className="mt-4 bg-gray-900 rounded-lg p-4">
                    <h2 className="text-sm font-bold mb-2">시간별 쓰러짐 탐지 통계</h2>
                    <FallDetectionChart />
                </div>
            </main>
        </div>
    );
}

export default App;