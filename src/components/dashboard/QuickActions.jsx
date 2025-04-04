import React from 'react';

const QuickActions = () => {
    return (
        <div className="bg-gray-900 rounded-lg p-3">
            <h2 className="text-sm font-bold mb-2 border-b border-gray-700 pb-1">빠른 작업</h2>
            <div className="grid grid-cols-2 gap-2">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">긴급 연락</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">알림 전송</button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">설정</button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">로그 보기</button>
            </div>
        </div>
    );
};

export default QuickActions;