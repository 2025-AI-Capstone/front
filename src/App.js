import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import DashboardPage from './pages/DashboardPage'; // 대시보드 페이지 import
import EmergencyContacts from './pages/EmergencyContacts'; // 긴급 연락처 페이지 import
import './App.css';
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // 사용자 정보 가져오기 (필요한 경우)
    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.id) {
                setUserId(response.data.id);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            handleLogout();
        }
    };

    // 컴포넌트 마운트 시 토큰 및 로그인 상태 확인
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (storedToken) {
            setToken(storedToken);
            setUsername(storedUsername || '');
            setIsLoggedIn(true);
            fetchUserInfo(storedToken);
        }
    }, [fetchUserInfo]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 로그인 처리 함수
    const handleLogin = (receivedToken, username) => {
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('username', username);

        axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

        setToken(receivedToken);
        setUsername(username);
        setIsLoggedIn(true);

        fetchUserInfo(receivedToken);
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        delete axios.defaults.headers.common['Authorization'];

        setToken('');
        setUserId(null);
        setUsername('');
        setIsLoggedIn(false);
    };

    // 로그인되지 않은 경우 로그인 화면 표시
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardPage />} /> {/* 기본 대시보드 페이지 */}
                <Route path="/emergency-contacts" element={<EmergencyContacts />} /> {/* 긴급 연락처 페이지 */}
            </Routes>
        </Router>
    );
}

export default App;
