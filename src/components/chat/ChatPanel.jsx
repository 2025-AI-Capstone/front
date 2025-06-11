import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevLengthRef = useRef(0);
    const messagesEndRef = useRef(null);

    // 말풍선 스타일 정의
    const bubbleStyle = {
        talk: {
            bg: 'bg-blue-50',
            border: 'border-blue-400',
            icon: '🤖',
            label: 'AI 응답',
        },
        fall_alert: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            icon: '🚨',
            label: '낙상 경고',
        },
        default: {
            bg: 'bg-gray-100',
            border: 'border-gray-400',
            icon: '💬',
            label: '기타',
        }
    };

    // 맨 아래로 스크롤
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchChatLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/event-logs/chat', { timeout: 10000 });
            const data = response.data;

            if (Array.isArray(data)) {
                const parsedMessages = data
                    .filter(log => log.status && typeof log.status === 'string')
                    .map(log => {
                        let parsedStatus = {};
                        try {
                            parsedStatus = JSON.parse(log.status);
                        } catch (e) {
                            console.warn('Failed to parse status:', log.status);
                        }

                        return {
                            id: log.id,
                            timestamp: log.detected_at,
                            event_type: log.event_type,
                            query: parsedStatus.query || '',
                            answer: parsedStatus.answer || '',
                        };
                    })
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                // 메시지가 추가되었을 때만 스크롤
                if (parsedMessages.length > prevLengthRef.current) {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                    setTimeout(scrollToBottom, 100);
                } else {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                }
            } else {
                setMessages([]);
                prevLengthRef.current = 0;
            }
        } catch (err) {
            console.error('STT 대화 로그 불러오기 실패:', err);
            setError('대화 로그를 불러올 수 없습니다.');
            setMessages([]);
            prevLengthRef.current = 0;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatLogs();
        const interval = setInterval(fetchChatLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 h-full flex flex-col">
            {/* 헤더 */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-700">음성 대화 로그</h3>
                </div>
                {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                )}
            </div>

            {/* 고정된 높이의 스크롤 영역 */}
            <div className="overflow-y-auto px-3 py-3 space-y-3 border-b border-gray-100" style={{ height: '280px' }}>
                {messages.length === 0 && !loading ? (
                    <div className="text-center text-gray-500 text-sm py-4">
                        <p className="text-xs">대화 기록이 없습니다</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const style = bubbleStyle[msg.event_type] || bubbleStyle.default;

                        return (
                            <div key={msg.id} className="space-y-1">
                                {msg.query && (
                                    <div className="bg-gray-100 border-l-4 border-gray-400 px-3 py-2 rounded-r-lg shadow-sm">
                                        <div className="text-xs text-gray-500 mb-1">🙋 사용자 질문</div>
                                        <p className="text-sm text-gray-800">{msg.query}</p>
                                    </div>
                                )}
                                {msg.answer && (
                                    <div className={`${style.bg} ${style.border} border-l-4 px-3 py-2 rounded-r-lg shadow-sm`}>
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                            <span>{style.icon} {style.label}</span>
                                            <span>{new Date(msg.timestamp).toLocaleTimeString('ko-KR')}</span>
                                        </div>
                                        <p className="text-sm text-gray-800">{msg.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 하단 정보 */}
            <div className="p-2 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>총 {messages.length}개</span>
                    <span>30초 자동 업데이트</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
