import React from 'react';
import NodeStatus from '../components/dashboard/NodeStatus';
import EventLog from '../components/dashboard/EventLog';
import ImageStreamWithDetection from '../components/video/ImageStreamWithDetection';
import QuickActions from '../components/dashboard/QuickActions';
import StatsPanel from '../components/dashboard/StatsPanel';
import FallDetectionChart from '../components/dashboard/FallDetectionChart';
import Header from "../components/common/Header";

function DashboardPage() {
    return (
        <div className="h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
            <Header />

            {/* Main Content - 남은 공간을 모두 사용 */}
            <main className="flex-1 p-4 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 h-full">
                    {/* 이미지 영역 - 전체 높이 사용 */}
                    <div className="col-span-9 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full">
                        <ImageStreamWithDetection />
                    </div>

                    {/* 사이드바 - 스크롤 가능 */}
                    <div className="col-span-3 space-y-4 overflow-y-auto h-full">
                        <StatsPanel />
                        <NodeStatus />
                        {/*<EventLog />*/}
                        {/*<QuickActions />*/}
                    </div>
                </div>

                {/*<div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <FallDetectionChart />
                </div>*/}
            </main>
        </div>
    );
}

export default DashboardPage;