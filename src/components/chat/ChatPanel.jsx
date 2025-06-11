import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

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
                const sttMessages = data
                    .filter((log) => log.message && log.message.trim() !== '')
                    .map((log) => ({
                        id: log.id,
                        message: log.message,
                        timestamp: log.detected_at,
                        status: log.status,
                    }))
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                setMessages(sttMessages);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error('STT 대화 로그 불러오기 실패:', err);
            setError('대화 로그를 불러올 수 없습니다.');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatLogs();
        const interval = setInterval(fetchChatLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2" style={{ maxHeight: '400px' }}>
                {messages.length === 0 && !loading ? (
                    <div className="text-center text-gray-500 text-sm py-4">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-xs">대화 기록이 없습니다</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="border-l-4 border-blue-400 bg-blue-50 p-2 rounded-r-lg"
                        >
                            <p className="text-xs text-gray-800 mb-1 leading-relaxed">
                                {msg.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{new Date(msg.timestamp).toLocaleTimeString('ko-KR')}</span>
                                <span className="px-1 py-0.5 rounded bg-gray-200 text-gray-600">
                                    {msg.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 하단 정보 */}
            <div className="p-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>총 {messages.length}개</span>
                    <span>30초 자동 업데이트</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
