import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NodeStatus = () => {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchSystemStatus = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/system-statuses', {
                timeout: 10000,
            });

            const data = response.data;
            console.log('시스템 상태 응답:', data);

            if (!Array.isArray(data)) {
                throw new Error('서버 응답 형식이 올바르지 않습니다');
            }

            const updatedNodes = data
                .sort((a, b) => {
                    const timeDiff = new Date(b.timestamp) - new Date(a.timestamp);
                    if (timeDiff !== 0) return timeDiff;

                    const nameA = (a.node_name || '').toLowerCase();
                    const nameB = (b.node_name || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                })
                .map((node) => {
                    let status = 'inactive';
                    let statusText = '비작동';

                    const nodeStatus = node.status?.toLowerCase();
                    if (nodeStatus === 'active' || nodeStatus === 'running') {
                        status = 'active';
                        statusText = '작동';
                    }

                    return {
                        id: node.id,
                        name: node.node_name || '알 수 없는 노드',
                        status,
                        statusText,
                        timestamp: node.timestamp,
                    };
                });

            setNodes(updatedNodes);
            setLastUpdated(new Date().toLocaleTimeString('ko-KR'));
        } catch (err) {
            console.error('시스템 상태 불러오기 실패:', err);

            const errorMessage = err.response?.status === 404
                ? 'API 엔드포인트를 찾을 수 없습니다'
                : err.response?.status === 500
                    ? '서버 내부 오류입니다'
                    : err.message || '시스템 상태를 불러올 수 없습니다';

            setError(errorMessage);
            setNodes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStatus();
        const interval = setInterval(fetchSystemStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBg = (status) => {
        return status === 'active' ? 'bg-green-100' : 'bg-red-100';
    };

    const getStatusIcon = (status) => {
        if (status === 'active') {
            return (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        }
    };

    const getTextColor = (status) => {
        return status === 'active' ? 'text-green-600' : 'text-red-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-700">시스템 상태 모니터링</h3>
                </div>
                <div className="flex items-center space-x-2">
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    )}
                    <button
                        onClick={fetchSystemStatus}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium transition-colors"
                        disabled={loading}
                        title="새로고침"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            {lastUpdated && (
                <div className="mb-3 text-xs text-gray-500 flex-shrink-0">
                    마지막 업데이트: {lastUpdated}
                </div>
            )}

            <div className="flex-1 space-y-2 overflow-hidden min-h-0">
                {nodes.slice(0, 3).map((node) => (
                    <div key={node.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5 transition-all hover:bg-gray-100">
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
