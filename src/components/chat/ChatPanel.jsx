import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const prevLengthRef = useRef(0);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchChatLogs = async () => {
        try {
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
                            console.warn('JSON parse error for status:', log.status);
                        }

                        return {
                            id: log.id,
                            timestamp: log.detected_at,
                            event_type: log.event_type,
                            query: parsedStatus.query || '',
                            answer: parsedStatus.answer || ''
                        };
                    })
                    .filter(msg => msg.event_type === 'talk' || msg.event_type === 'fall_alert')
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                if (parsedMessages.length > prevLengthRef.current) {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                    setTimeout(scrollToBottom, 100);
                } else {
                    setMessages(parsedMessages);
                    prevLengthRef.current = parsedMessages.length;
                }
            }
        } catch (error) {
            console.error('Error fetching chat logs:', error);
        }
    };

    useEffect(() => {
        fetchChatLogs();
        const interval = setInterval(fetchChatLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: '10px' }}>
                    <div><strong>타입:</strong> {msg.event_type}</div>
                    <div><strong>시간:</strong> {new Date(msg.timestamp).toLocaleTimeString()}</div>
                    {msg.query && <div><strong>질문:</strong> {msg.query}</div>}
                    {msg.answer && <div><strong>응답:</strong> {msg.answer}</div>}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatPanel;
