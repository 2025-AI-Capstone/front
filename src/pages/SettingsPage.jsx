import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const navigate = useNavigate();

  // 백엔드에서 받아온 연락처 리스트 상태
  const [contacts, setContacts] = useState([]);

  // 입력 폼 상태 (relation 추가)
  const [formData, setFormData] = useState({ name: '', phone: '', relation: '' });

  // 편집 중인 연락처 인덱스
  const [editingIndex, setEditingIndex] = useState(null);

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 컴포넌트가 처음 렌더링될 때 백엔드에서 연락처 목록 불러오기
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/emergency-contacts/me');
        setContacts(response.data);
      } catch (error) {
        console.error('연락처 불러오기 실패:', error);
      }
    };
    fetchContacts();
  }, []);

  // 입력 폼 변경 핸들러
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 연락처 추가 또는 수정 처리
  const handleAddOrEdit = async () => {
    if (!formData.name || !formData.phone) return;

    try {
      if (editingIndex !== null) {
        // 수정일 경우 PUT 요청
        const contactToEdit = contacts[editingIndex];
        const response = await axios.put(`/emergency-contacts/${contactToEdit.id}`, formData);
        const updatedContact = response.data;

        const updatedContacts = [...contacts];
        updatedContacts[editingIndex] = updatedContact;
        setContacts(updatedContacts);
        setEditingIndex(null);
      } else {
        // 추가일 경우 POST 요청
        const response = await axios.post('/emergency-contacts', formData);
        const newContact = response.data;
        setContacts([...contacts, newContact]);
      }
      setFormData({ name: '', phone: '', relation: '' }); // relation 초기화 포함
    } catch (error) {
      console.error('연락처 저장 실패:', error);
    }
  };

  // 편집 시작
  const handleEdit = (index) => {
    setFormData(contacts[index]);
    setEditingIndex(index);
  };

  // 연락처 삭제 처리
  const handleDelete = async (index) => {
    try {
      const contactToDelete = contacts[index];
      await axios.delete(`/emergency-contacts/${contactToDelete.id}`);

      const updated = contacts.filter((_, i) => i !== index);
      setContacts(updated);
      setEditingIndex(null);
      setFormData({ name: '', phone: '', relation: '' });
    } catch (error) {
      console.error('연락처 삭제 실패:', error);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어로 연락처 필터링 (relation 포함)
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    (contact.relation && contact.relation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">긴급 연락처 설정</h1>
          <p className="text-sm text-gray-500">긴급 연락처를 등록, 수정, 삭제할 수 있습니다.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm text-sm"
        >
          ← 대시보드로 돌아가기
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="이름, 전화번호, 관계로 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* 입력폼: flex-row, 입력창 3개 균등, 버튼 고정폭 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center space-x-4">
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          className="flex-grow min-w-0 rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleChange}
          className="flex-grow min-w-0 rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="relation"
          placeholder="관계"
          value={formData.relation}
          onChange={handleChange}
          className="flex-grow min-w-0 rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddOrEdit}
          className="w-24 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition flex-shrink-0"
        >
          {editingIndex !== null ? '저장' : '추가'}
        </button>
      </div>

      <ul className="space-y-2">
        {filteredContacts.map((contact, index) => (
          <li key={contact.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded shadow-sm">
            <div>
              <p className="font-medium text-gray-800">{contact.name}</p>
              <p className="text-gray-500 text-sm">{contact.phone}</p>
              <p className="text-gray-500 text-sm italic">{contact.relation}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="text-sm text-blue-600 hover:underline"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-sm text-red-600 hover:underline"
              >
                삭제
              </button>
            </div>
          </li>
        ))}

        {/* 검색어가 비어있지 않고, 필터링된 결과가 없을 때만 메시지 표시하도록 수정 */}
        {searchTerm !== '' && filteredContacts.length === 0 && (
          <li className="text-center text-gray-400">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default SettingsPage;
