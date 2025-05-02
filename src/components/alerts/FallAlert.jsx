import React from 'react';

const FallAlert = () => {
    return (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 rounded-xl shadow-lg flex items-center animate-pulse-subtle">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                <span className="text-red-600 font-bold text-lg">!</span>
            </div>
            <div className="flex flex-col">
                <span className="text-white font-bold text-sm">쓰러짐 감지!</span>
                <span className="text-red-100 text-xs">즉시 확인이 필요합니다</span>
            </div>
        </div>
    );
};

// 부드러운 펄스 애니메이션을 위한 스타일 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.97; transform: scale(1.02); }
  }
  .animate-pulse-subtle {
    animation: pulse-subtle 2s infinite ease-in-out;
  }
`;
document.head.appendChild(style);

export default FallAlert;