import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchChatLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/event-logs/chat', { timeout: 10000 });
      const data = response.data;

      if (Array.isArray(data)) {
        const parsed = data
          .filter(log => log.status && log.status.includes('{')) // JSON 형태인 것만
          .map(log => {
            let parsedStatus;
            try {
              parsedStatus = JSON.parse(log.status);
            } catch (e) {
              parsedStatus = {};
            }
            return {
              id: log.id,
              timestamp: log.detected_at,
              event_type: log.event_type,
              query: parsedStatus.query || null,
              answer: parsedStatus.answer || null,
            };
          })
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setMessages(parsed);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('대화 로그 불러오기 실패:', err);
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
        {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>}
      </div>

      {/* 메시지 영역 */}
      <div className="overflow-y-auto px-3 py-3 space-y-3 border-b border-gray-100" style={{ height: '280px' }}>
        {messages.length === 0 && !loading ? (
          <div className="text-center text-gray-500 text-sm py-4">
            <p className="text-xs">대화 기록이 없습니다</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className="space-y-1">
              {msg.query && (
                <div className="bg-gray-100 border-l-4 border-gray-400 px-3 py-2 rounded-r-lg shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">🙋 사용자 질문</div>
                  <p className="text-sm text-gray-800">{msg.query}</p>
                </div>
              )}
              {msg.answer && (
                <div className="bg-blue-50 border-l-4 border-blue-400 px-3 py-2 rounded-r-lg shadow-sm">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>🤖 AI 응답</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString('ko-KR')}</span>
                  </div>
                  <p className="text-sm text-gray-800">{msg.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 하단 정보 */}
      <div className="p-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
        <span>총 {messages.length}개</span>
        <span>30초 자동 업데이트</span>
      </div>
    </div>
  );
};

export default ChatPanel;
