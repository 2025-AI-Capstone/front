import React from 'react';

const EventLog = () => {
    const events = [
        { id: 1, type: 'alert', message: '쓰러짐 감지됨', time: '10:42:30' },
        { id: 2, type: 'warning', message: '객체 감지 신뢰도 낮음', time: '10:40:15' },
        { id: 3, type: 'info', message: '시스템 시작됨', time: '10:30:00' }
    ];

    const getEventColor = (type) => {
        switch (type) {
            case 'alert': return 'border-red-500 text-red-600';
            case 'warning': return 'border-yellow-500 text-yellow-600';
            case 'info': return 'border-blue-500 text-blue-600';
            default: return 'border-gray-500 text-gray-600';
        }
    };

    const getEventBgColor = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-50';
            case 'warning': return 'bg-yellow-50';
            case 'info': return 'bg-blue-50';
            default: return 'bg-gray-50';
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'alert': return '🚨';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '📌';
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-sm font-bold mb-3 pb-2 border-b border-gray-100 text-gray-700 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-1 rounded mr-2 text-xs">LIVE</span>
                최근 이벤트
            </h2>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {events.map(event => (
                    <div
                        key={event.id}
                        className={`rounded-lg p-2 ${getEventBgColor(event.type)} border-l-4 ${getEventColor(event.type).replace('text-', 'border-')} flex items-start`}
                    >
                        <div className="mr-2 mt-0.5">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                            <div className={`font-medium text-sm ${getEventColor(event.type)}`}>{event.message}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-1"></div>
                                {event.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventLog;