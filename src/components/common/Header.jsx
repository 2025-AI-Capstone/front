import React from 'react';

const Header = ({ currentTime }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-900">
            <h1 className="text-xl font-bold">FOCUS</h1>
            <div className="flex space-x-2">
                <div className="px-2 py-1 bg-green-600 rounded text-sm">시스템 정상</div>
                <div className="px-2 py-1 bg-gray-700 rounded text-sm">{currentTime}</div>
            </div>
        </div>
    );
};

export default Header;