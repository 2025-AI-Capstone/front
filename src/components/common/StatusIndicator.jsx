import React from 'react';

const StatusIndicator = ({ status, label, lastUpdate }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
            <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} mr-2`}></div>
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-xs text-gray-400">{lastUpdate || '정보 없음'}</span>
        </div>
    );
};

export default StatusIndicator;