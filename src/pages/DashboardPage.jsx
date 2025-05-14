import React from 'react';
import NodeStatus from '../components/dashboard/NodeStatus';
import EventLog from '../components/dashboard/EventLog';
import ImageStreamWithDetection from '../components/video/ImageStreamWithDetection';
import QuickActions from '../components/dashboard/QuickActions';
import StatsPanel from '../components/dashboard/StatsPanel';
import FallDetectionChart from '../components/dashboard/FallDetectionChart';

function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                {/* 여기에 대시보드 헤더 내용 추가 */}
            </div>

            {/* Main Content */}
            <main className="p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                        <ImageStreamWithDetection />
                    </div>
                    <div className="col-span-3 space-y-4">
                        <NodeStatus />
                        <EventLog />
                        <QuickActions />
                        <StatsPanel />
                    </div>
                </div>

                <div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <FallDetectionChart />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-3 px-4 text-center text-xs text-gray-500 border-t border-gray-100">
                <p>© 2025 FOCUS - AI 기반 안전 모니터링 시스템</p>
            </footer>
        </div>
    );
}

export default DashboardPage;
