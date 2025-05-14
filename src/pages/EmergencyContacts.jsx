import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();

    // 더미 데이터 사용
    useEffect(() => {
        const dummyData = [
            { id: 1, name: '홍길동', phone: '010-1234-5678', role: '관리자' },
            { id: 2, name: '김철수', phone: '010-5678-1234', role: '현장 책임자' },
            { id: 3, name: '이영희', phone: '010-9999-8888', role: '보건 관리자' },
        ];
        setContacts(dummyData);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">비상 연락처</h1>
                    <p className="text-sm text-gray-500">사고 발생 시 즉시 연락 가능한 인원 목록입니다.</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm text-sm"
                >
                    ← 대시보드로 돌아가기
                </button>
            </div>

            {/* 연락처 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                    >
                        <h2 className="text-lg font-semibold text-indigo-600">{contact.name}</h2>
                        <p className="text-sm text-gray-700">전화번호: {contact.phone}</p>
                        <p className="text-sm text-gray-600">관계: {contact.role}</p>
                    </div>
                ))}
            </div>

            {/* 연락처가 없는 경우 */}
            {contacts.length === 0 && (
                <p className="text-center text-gray-500 mt-10">등록된 비상 연락처가 없습니다.</p>
            )}
        </div>
    );
};

export default EmergencyContacts;
