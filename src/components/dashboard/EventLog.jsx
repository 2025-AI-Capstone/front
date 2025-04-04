import React from 'react';

const EventLog = () => {
    const events = [
        { id: 1, type: 'alert', message: '쓰러짐 감지됨', time: '10:42:30' },
        { id: 2, type: 'warning', message: '객체 감지 신뢰도 낮음', time: '10:40:15' },
        { id: 3, type: 'info', message: '시스템 시작됨', time: '10:30:00' }
    ];

    const getEventColor = (type) => {
        switch (type) {
            case 'alert': return 'border-red-500 text-red-400';
            case 'warning': return 'border-yellow-500 text-yellow-400';
            case 'info': return 'border-blue-500 text-blue-400';
            default: return 'border-gray-500 text-gray-400';
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg p-3">
            <h2 className="text-sm font-bold mb-2 border-b border-gray-700 pb-1">최근 이벤트</h2>
            <div className="space-y-2 max-h-32 overflow-y-auto">
                {events.map(event => (
                    <div key={event.id} className={`border-l-2 pl-2 ${getEventColor(event.type)}`}>
                        <div>{event.message}</div>
                        <div className="text-xs text-gray-400">{event.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventLog;