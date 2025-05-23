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
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Header />
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">

            </div>

            {/* Main Content */}
            <main className="p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                        <ImageStreamWithDetection />
                    </div>
                    <div className="col-span-3 space-y-4">
                        {/*<EventLog />*/}
                        {/*<QuickActions />*/}
                        <StatsPanel />
                        <NodeStatus />

                    </div>
                </div>

                <div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <FallDetectionChart />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
