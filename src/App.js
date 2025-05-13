import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Header import 제거 (사용하지 않음)
import NodeStatus from './components/dashboard/NodeStatus';
import EventLog from './components/dashboard/EventLog';
import ImageStreamWithDetection from './components/video/ImageStreamWithDetection';
import QuickActions from './components/dashboard/QuickActions';
import StatsPanel from './components/dashboard/StatsPanel';
import FallDetectionChart from './components/dashboard/FallDetectionChart';
import Login from './components/auth/Login';
import './App.css';

// package.json에 proxy 설정 후 baseURL 제거
// axios.defaults.baseURL = 'http://localhost:8000';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // 사용자 정보 가져오기 (필요한 경우)
    const fetchUserInfo = async (token) => {
        try {
            // API에 인증 헤더 추가
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
            // 오류 발생 시 로그아웃 처리
            handleLogout();
        }
    };

    // 컴포넌트 마운트 시 토큰 및 로그인 상태 확인
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (storedToken) {
            // 토큰 유효성 검증 또는 사용자 정보 조회 API 호출
            setToken(storedToken);
            setUsername(storedUsername || '');
            setIsLoggedIn(true);

            // 토큰으로 사용자 정보 가져오기 (필요한 경우)
            fetchUserInfo(storedToken);
        }
    }, [fetchUserInfo]); // fetchUserInfo 의존성 추가

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

        // axios 기본 헤더에 인증 토큰 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

        setToken(receivedToken);
        setUsername(username);
        setIsLoggedIn(true);

        // 토큰으로 사용자 정보 가져오기
        fetchUserInfo(receivedToken);
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // axios 기본 헤더에서 인증 토큰 제거
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

    // 로그인된 경우 메인 대시보드 표시
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        F
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">FOCUS</h1>
                        <p className="text-xs text-gray-500">Fall Detection and Safety System</p>
                    </div>
                </div>
                <div className="flex space-x-3 items-center">
                    <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                        {username}님 환영합니다
                    </div>
                    <div className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full text-sm text-white font-medium shadow-sm flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        시스템 정상
                    </div>
                    <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                        {currentTime}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 font-medium shadow-sm transition-colors duration-200"
                    >
                        로그아웃
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-4">
                <div className="grid grid-cols-12 gap-4">
                    {/* Main Video Stream - 9 columns */}
                    <div className="col-span-9 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                        <ImageStreamWithDetection />
                    </div>

                    {/* Right Sidebar - 3 columns */}
                    <div className="col-span-3 space-y-4">
                        <NodeStatus />
                        <EventLog />
                        <QuickActions />
                        <StatsPanel />
                    </div>
                </div>

                {/* Fall Detection Chart - Bottom Section */}
                <div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center mb-3">
                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h2 className="text-sm font-bold text-gray-700">시간별 쓰러짐 탐지 통계</h2>
                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">실시간</span>
                    </div>
                    <FallDetectionChart />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-3 px-4 text-center text-xs text-gray-500 border-t border-gray-100">
                <p>© 2025 FOCUS - AI 기반 안전 모니터링 시스템</p>
                <p className="mt-1">버전 1.0.3 | 마지막 업데이트: 2025-05-01</p>
            </footer>
        </div>
    );
}

export default App;