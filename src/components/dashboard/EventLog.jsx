import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const typeColor = {
  fall_alert: 'bg-red-100 text-red-600',
  talk: 'bg-blue-100 text-blue-600',
  routine: 'bg-green-100 text-green-600',
};

const EventLog = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/event-logs/me');
        setLogs(response.data);
      } catch (error) {
        console.error('이벤트 로그 불러오기 실패:', error);
      }
    };

    fetchLogs();
  }, []);

  const renderMessage = (msgStr) => {
    try {
      const parsed = JSON.parse(msgStr);
      if (parsed.query && parsed.answer) {
        return (
          <div className="space-y-1">
            <p><span className="font-medium text-gray-600">Q:</span> {parsed.query}</p>
            <p><span className="font-medium text-gray-600">A:</span> {parsed.answer}</p>
          </div>
        );
      }
    } catch (_) {
      // 파싱 실패 → 일반 문자열 출력
    }
    return <p>{msgStr}</p>;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 상단 제목 및 돌아가기 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">이벤트 로그</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm text-sm"
        >
          ← 대시보드로 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">시간</th>
              <th className="px-6 py-3 text-left">유형</th>
              <th className="px-6 py-3 text-left">내용</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  이벤트 로그가 없습니다.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(log.detected_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        typeColor[log.event_type] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {log.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {renderMessage(log.message)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventLog;
