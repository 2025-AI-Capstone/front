// src/components/auth/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 절대 경로로 변경 (proxy 설정 사용)
            const response = await axios.post('/login', {
                name: username,
                password: password
            });

            // 성공적인 응답 처리
            setIsLoading(false);
            onLogin(response.data, username);
        } catch (err) {
            setIsLoading(false);
            console.error('Login error:', err);

            if (err.response) {
                setError(`로그인 오류: ${err.response.data?.detail || '인증 실패'}`);
            } else if (err.request) {
                setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나 나중에 다시 시도해주세요.');
            } else {
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                    {/* 로고 및 헤더 */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-md">
                            F
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">FOCUS</h1>
                        <p className="text-sm text-gray-500">Fall Detection and Safety System</p>
                    </div>

                    {/* 로그인 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                아이디
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="사용자 아이디 입력"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="비밀번호 입력"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        로그인 중...
                                    </>
                                ) : '로그인'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>테스트 계정: admin / password</p>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>© 2025 FOCUS - AI 기반 안전 모니터링 시스템</p>
                    <p className="mt-1">버전 1.0.3</p>
                </div>
            </div>
        </div>
    );
};

export default Login;