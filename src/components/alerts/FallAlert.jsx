import React from 'react';

const FallAlert = () => {
    return (
        <div className="absolute top-4 right-4 bg-red-600 px-3 py-2 rounded-lg flex items-center">
            <span className="text-white font-bold">⚠️ 쓰러짐 감지!</span>
        </div>
    );
};

export default FallAlert;