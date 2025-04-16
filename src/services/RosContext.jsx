import React, { createContext, useState, useEffect } from 'react';

const RosContext = createContext();

const RosProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // WebSocket 연결 및 데이터 처리
        const socket = new WebSocket("ws://your-websocket-url");

        socket.onopen = () => {
            setConnected(true);
            console.log("WebSocket connected");
            socket.send(JSON.stringify({ op: "subscribe", topic: "/dashboard/data" }));
        };

        socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
        };

        socket.onclose = () => {
            setConnected(false);
            console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <RosContext.Provider value={{ data, connected }}>
            {children}
        </RosContext.Provider>
    );
};

export { RosContext, RosProvider };
