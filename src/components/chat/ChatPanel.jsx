import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevLengthRef = useRef(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatLogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/event-logs/chat', { timeout: 10000 });
            const data = res.data;

            if (Array.isArray(data)) {
                const parsedMessages = data
                    .filter(log => log.message && log.message.trim() !== '')
                    .map(log => {
                        let query = null;
                        let answer = null;
                        let fallback = null;

                        try {
                            const parsed = JSON.parse(log.message);
                            query = parsed.query;
                            answer = parsed.answer;
                        } catch (e) {
                            fallback = log.message;
                        }

                        return {
                            id: log.id,
                            event_type: log.event_type,
                            timestamp: log.detected_at,
                            query,
                            answer,
                            fallback
                        };
                    });

                if (parsedMessages.length > prevLengthRef.current) {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                    setTimeout(scrollToBottom, 100);
                } else {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                }
            }
        } catch (err) {
            console.error('STT 대화 로그 불러오기 실패:', err);
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
        <div className="flex flex-col h-full rounded-lg shadow-md border bg-white">
            {/* 상단 */}
            <div className="p-3 border-b text-sm font-bold text-gray-700 flex justify-between items-center">
                <div>🗣️ 음성 대화 로그</div>
                {loading && <div className="text-xs text-gray-400">로딩 중...</div>}
            </div>

            {/* 스크롤 영역 */}
            <div className="overflow-y-auto flex-1 px-3 py-2 space-y-2">
                {messages.length === 0 && !loading ? (
                    <p className="text-gray-500 text-sm text-center">대화 기록이 없습니다</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className="p-2 rounded border-l-4"
                            style={{
                                borderColor: msg.event_type === 'talk' ? '#60a5fa' : '#f87171',
                                backgroundColor: msg.event_type === 'talk' ? '#eff6ff' : '#fef2f2'
                            }}
                        >
                            {msg.query && msg.answer ? (
                                <>
                                    <p className="text-xs text-gray-500 mb-1">🙋 {msg.query}</p>
                                    <p className="text-sm text-gray-800">🤖 {msg.answer}</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-700">{msg.fallback}</p>
                            )}
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString('ko-KR')}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 하단 */}
            <div className="p-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>총 {messages.length}개</span>
                <span>30초 간격 자동 업데이트</span>
            </div>
        </div>
    );
};

export default ChatPanel;
