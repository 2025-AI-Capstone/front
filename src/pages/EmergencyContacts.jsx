import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 서버에서 비상 연락처 데이터를 불러오는 함수
    const fetchContacts = async () => {
      try {
        // 서버로부터 연락처 리스트를 GET 요청으로 받아옴
        const response = await axios.get('/api/emergency-contacts');
        setContacts(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error('비상 연락처 불러오기 실패:', error);
      }
    };

    fetchContacts(); // 컴포넌트가 처음 마운트될 때 호출
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
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm text-sm"
        >
          ← 대시보드로 돌아가기
        </button>
      </div>

      {/* 연락처 리스트 출력 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
          >
            <h2 className="text-lg font-semibold text-indigo-600">{contact.name}</h2>
            <p className="text-sm text-gray-700">전화번호: {contact.phone}</p>
            <p className="text-sm text-gray-600">관계: {contact.role || '―'}</p>
          </div>
        ))}
      </div>

      {/* 연락처가 없는 경우 출력 */}
      {contacts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">등록된 비상 연락처가 없습니다.</p>
      )}
    </div>
  );
};

export default EmergencyContacts;
