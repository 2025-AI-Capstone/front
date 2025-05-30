import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NodeStatus = () => {
    const [nodes, setNodes] = useState([
        { name: '카메라', status: 'inactive', statusText: '비작동' },
        { name: '객체 감지', status: 'inactive', statusText: '비작동' },
        { name: '추적', status: 'inactive', statusText: '비작동' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                setLoading(true);
                setError(null);

                // API 문서에 따른 정확한 엔드포인트 사용
                const res = await axios.get('/system-statuses', {
                    timeout: 10000, // 10초 타임아웃
                });

                const data = res.data;
                console.log('시스템 상태 응답:', data);

                // 서버 응답이 배열인지 확인
                if (!Array.isArray(data)) {
                    console.warn('서버 응답이 배열이 아닙니다:', data);
                    throw new Error('서버 응답 형식이 올바르지 않습니다');
                }

                if (data.length === 0) {
                    console.warn('빈 배열이 반환되었습니다');
                    throw new Error('시스템 상태 데이터가 없습니다');
                }

                // 서버 응답 데이터 매핑 - 작동/비작동 두 가지 상태만
                const updatedNodes = data.map((node) => {
                    let status = 'inactive';
                    let statusText = '비작동';

                    // 상태 단순화: active, running은 작동, 나머지는 비작동
                    const nodeStatus = node.status?.toLowerCase();
                    if (nodeStatus === '작동') {
                        status = 'active';
                        statusText = '작동';
                    } else {
                        status = 'inactive';
                        statusText = '비작동';
                    }

                    return {
                        id: node.id,
                        name: node.node_name || '알 수 없는 노드',
                        status,
                        statusText,
                        timestamp: node.timestamp,
                    };
                });

                console.log('매핑된 노드 데이터:', updatedNodes);
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

                // 에러 발생 시 모두 비작동으로 설정
                setNodes([
                    { name: '카메라', status: 'inactive', statusText: '비작동' },
                    { name: '객체 감지', status: 'inactive', statusText: '비작동' },
                    { name: '추적', status: 'inactive', statusText: '비작동' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        // 초기 로드
        fetchSystemStatus();

        // 주기적 업데이트 (30초마다)
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
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-sm font-bold mb-3 text-gray-700 border-b border-gray-100 pb-2 flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    시스템 상태 모니터링
                </div>
                {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                )}
            </h2>

            {/* 에러 메시지 */}
            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            {/* 마지막 업데이트 시간 */}
            {lastUpdated && (
                <div className="mb-3 text-xs text-gray-500">
                    마지막 업데이트: {lastUpdated}
                </div>
            )}

            <div className="space-y-2.5">
                {nodes.map((node, index) => (
                    <div key={node.id || index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5 transition-all hover:bg-gray-100">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${getStatusBg(node.status)} flex items-center justify-center mr-3 shadow-sm`}>
                                {getStatusIcon(node.status)}
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">{node.name}</span>
                            </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBg(node.status)} ${getTextColor(node.status)} shadow-sm`}>
                            {node.statusText}
                        </div>
                    </div>
                ))}
            </div>

            {/* 새로고침 버튼 */}
            <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                <button
                    onClick={() => window.location.reload()}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium transition-colors"
                    disabled={loading}
                >
                    {loading ? '로딩 중...' : '새로고침'}
                </button>
            </div>
        </div>
    );
};

export default NodeStatus;