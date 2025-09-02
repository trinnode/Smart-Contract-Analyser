import React from 'react';

interface BackgroundElementsProps {
  isDarkMode: boolean;
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl ${
        isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-300 to-purple-400'
      } animate-pulse`}></div>
      <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl ${
        isDarkMode ? 'bg-gradient-to-r from-emerald-500 to-cyan-600' : 'bg-gradient-to-r from-emerald-300 to-cyan-400'
      } animate-pulse`} style={{animationDelay: '2s'}}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl ${
        isDarkMode ? 'bg-gradient-to-r from-rose-500 to-orange-600' : 'bg-gradient-to-r from-rose-300 to-orange-400'
      } animate-pulse`} style={{animationDelay: '4s'}}></div>
    </div>
  );
};