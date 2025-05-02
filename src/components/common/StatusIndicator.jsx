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

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'error':
                return 'bg-red-50';
            default:
                return 'bg-gray-50';
        }
    };

    return (
        <div className={`flex justify-between items-center py-2.5 px-3 mb-1.5 rounded-lg ${getStatusBgColor(status)} border-l-4 ${getStatusColor(status).replace('bg-', 'border-')}`}>
            <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-2.5 shadow-sm`}></div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <span className="text-xs bg-white py-1 px-2 rounded-full text-gray-500 shadow-sm">{lastUpdate || '정보 없음'}</span>
        </div>
    );
};

export default StatusIndicator;