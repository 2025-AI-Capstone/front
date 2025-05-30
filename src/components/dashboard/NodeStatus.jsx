import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NodeStatus = () => {
    const [nodes, setNodes] = useState([
        { name: '카메라', status: 'warning', statusText: '알 수 없음' },
        { name: '객체 감지', status: 'warning', statusText: '알 수 없음' },
        { name: '추적', status: 'warning', statusText: '알 수 없음' },
    ]);

    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                const res = await axios.get('/system-statuses'/* , {
                    headers: {
                        Authorization: `Bearer ${yourAccessToken}`  // 필요한 경우 활성화
                    }
                } */);

                const data = res.data;

                // 서버 응답이 배열인 경우 처리
                const updatedNodes = data.map((node) => {
                    let status = 'warning';
                    let statusText = '알 수 없음';

                    if (node.status === 'active') {
                        status = 'active';
                        statusText = '정상';
                    } else if (node.status === 'alert') {
                        status = 'alert';
                        statusText = '비정상';
                    }

                    return {
                        name: node.node_name, // 백엔드에서 오는 이름
                        status,
                        statusText,
                    };
                });

                setNodes(updatedNodes);
            } catch (err) {
                console.error('시스템 상태 불러오기 실패:', err);
                setNodes([
                    { name: '카메라', status: 'warning', statusText: '알 수 없음' },
                    { name: '객체 감지', status: 'warning', statusText: '알 수 없음' },
                    { name: '추적', status: 'warning', statusText: '알 수 없음' },
                ]);
            }
        };

        fetchSystemStatus();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'alert': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100';
            case 'warning': return 'bg-yellow-100';
            case 'alert': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'alert':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'alert': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-sm font-bold mb-3 text-gray-700 border-b border-gray-100 pb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                시스템 상태 모니터링
            </h2>
            <div className="space-y-2.5">
                {nodes.map((node, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5 transition-all hover:bg-gray-100">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${getStatusBg(node.status)} flex items-center justify-center mr-3 shadow-sm`}>
                                {getStatusIcon(node.status)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{node.name}</span>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBg(node.status)} ${getTextColor(node.status)} shadow-sm`}>
                            {node.statusText}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodeStatus;
