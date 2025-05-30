import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import DashboardPage from './pages/DashboardPage';
import EmergencyContacts from './pages/EmergencyContacts';
import SettingsPage from './pages/SettingsPage'; // ✅ 설정 페이지 import 추가
import './App.css';
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

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

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (storedToken) {
            setToken(storedToken);
            setUsername(storedUsername || '');
            setIsLoggedIn(true);
            fetchUserInfo(storedToken);
        }
    }, []); // ✅ fetchUserInfo를 deps에서 제거 (useEffect 함수 내부에서 정의되므로)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = (receivedToken, username) => {
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('username', username);

        axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

        setToken(receivedToken);
        setUsername(username);
        setIsLoggedIn(true);

        fetchUserInfo(receivedToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        delete axios.defaults.headers.common['Authorization'];

        setToken('');
        setUserId(null);
        setUsername('');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                <Route path="/settings" element={<SettingsPage />} /> {/* ✅ 설정 페이지 라우팅 추가 */}
            </Routes>
        </Router>
    );
}

export default App;
