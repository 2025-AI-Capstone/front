import React from 'react';

const Header = ({ currentTime }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg m-2">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">F</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">FOCUS</h1>
                <span className="ml-2 text-xs text-gray-500">안전한 홈 케어 솔루션</span>
            </div>
            <div className="flex space-x-3">
                <div className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full text-sm text-white font-medium shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    시스템 정상
                </div>
                <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                    {currentTime}
                </div>
            </div>
        </div>
    );
};

export default Header;