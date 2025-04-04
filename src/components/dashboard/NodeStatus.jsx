import React from 'react';

const NodeStatus = () => {
    const nodes = [
        { name: '카메라', status: 'active', statusText: '정상' },
        { name: '객체 감지', status: 'active', statusText: '정상' },
        { name: '추적', status: 'active', statusText: '정상' },
        { name: '쓰러짐 감지', status: 'alert', statusText: '알림' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'alert': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg p-3">
            <h2 className="text-sm font-bold mb-2 border-b border-gray-700 pb-1">노드 상태</h2>
            <div className="space-y-2">
                {nodes.map((node, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} mr-2`}></div>
                            <span className="text-sm">{node.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{node.statusText}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodeStatus;