import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 ID 가져오기 (로컬스토리지, 세션, 또는 컨텍스트에서)
    // 실제 구현에서는 현재 로그인한 사용자의 ID를 가져와야 합니다
    const getUserId = () => {
      // 예시: 로컬스토리지에서 사용자 정보 가져오기
      const userData = localStorage.getItem('user');
      console.log('userData:', userData);
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
      // 또는 다른 방법으로 현재 사용자 ID 가져오기
      return 1; // 임시 하드코딩 (실제로는 동적으로 가져와야 함)
    };

    // 서버에서 비상 연락처 데이터를 불러오는 함수
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserId();
        console.log('userId:', userId);
        // API 문서에 따른 엔드포인트 사용
        const response = await axios.get(`/emergency-contacts/user/${userId}`);


        setContacts(response.data || []); // 받아온 데이터를 상태에 저장
        console.log('비상 연락처 불러오기 성공:', response.data);
      } catch (error) {
        console.error('비상 연락처 불러오기 실패:', error);
        setError('비상 연락처를 불러오는데 실패했습니다.');

        // 404 오류인 경우 (사용자에게 연락처가 없는 경우)
        if (error.response?.status === 404) {
          setContacts([]);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts(); // 컴포넌트가 처음 마운트될 때 호출
  }, []);

  // 전화 걸기 기능
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">비상 연락처를 불러오는 중...</p>
          </div>
        </div>
    );
  }

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
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm text-sm transition-colors"
          >
            ← 대시보드로 돌아가기
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
        )}

        {/* 연락처 리스트 출력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
              <div
                  key={contact.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-indigo-600">{contact.name}</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {contact.relationship || contact.role || '관계 미설정'}
              </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700 flex items-center">
                    <span className="w-16 font-medium">전화:</span>
                    <span>{contact.phone_number || contact.phone}</span>
                  </p>
                  {contact.email && (
                      <p className="text-sm text-gray-700 flex items-center">
                        <span className="w-16 font-medium">이메일:</span>
                        <span>{contact.email}</span>
                      </p>
                  )}
                </div>

                {/* 연락하기 버튼 */}
                <button
                    onClick={() => handleCall(contact.phone_number || contact.phone)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  📞 긴급 연락하기
                </button>
              </div>
          ))}
        </div>

        {/* 연락처가 없는 경우 출력 */}
        {!loading && contacts.length === 0 && !error && (
            <div className="text-center mt-16">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">📞</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  등록된 비상 연락처가 없습니다
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  응급 상황에 대비해 비상 연락처를 등록해보세요.
                </p>
                <button
                    onClick={() => navigate('/emergency-contacts/add')} // 연락처 추가 페이지로 이동
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors"
                >
                  비상 연락처 추가하기
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default EmergencyContacts;