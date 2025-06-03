import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const typeColor = {
  fall: 'bg-red-100 text-red-600',
  alert: 'bg-yellow-100 text-yellow-600',
  normal: 'bg-green-100 text-green-600',
  entry: 'bg-blue-100 text-blue-600',
};

// 액션 로그 모달 컴포넌트
const ActionLogModal = ({ eventId, onClose }) => {
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActionLogs = async () => {
      try {
        const response = await axios.get(`/action-logs/event/${eventId}`);
        setActionLogs(response.data);
      } catch (error) {
        console.error('액션 로그 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionLogs();
  }, [eventId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4">액션 로그 (이벤트 ID: {eventId})</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
          aria-label="닫기"
        >
          ✕
        </button>

        {loading ? (
          <p>로딩 중...</p>
        ) : actionLogs.length === 0 ? (
          <p>해당 이벤트에 연결된 액션 로그가 없습니다.</p>
        ) : (
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">시간</th>
                <th className="border px-4 py-2 text-left">작업 유형</th>
                <th className="border px-4 py-2 text-left">상태</th>
                <th className="border px-4 py-2 text-left">실행 주체</th>
              </tr>
            </thead>
            <tbody>
              {actionLogs.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">{log.action_type}</td>
                  <td className="border px-4 py-2">
                    {/* 상태가 숫자(예: tracking_time)는 초단위를 시간 등으로 변환해서 보여주기 */}
                    {log.action_type === 'tracking_time'
                      ? `${(log.status / 3600).toFixed(2)} 시간`
                      : log.status}
                  </td>
                  <td className="border px-4 py-2">{log.triggered_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const EventLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 오른쪽 위 대시보드로 돌아가기 버튼 */}
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
              <th className="px-6 py-3 text-left">설명</th>
              <th className="px-6 py-3 text-left">액션 로그</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
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
                  <td className="px-6 py-4 text-sm text-gray-800">{log.message}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedEventId(log.id)}
                      className="text-indigo-600 hover:underline"
                    >
                      액션 로그 보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 액션 로그 모달 출력 */}
      {selectedEventId && (
        <ActionLogModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
};

export default EventLog;
