import React from 'react';
import { Shield, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30' 
              : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
          } backdrop-blur-sm`}>
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${
              isDarkMode ? 'from-blue-400 via-purple-400 to-emerald-400' : 'from-blue-600 via-purple-600 to-emerald-600'
            } bg-clip-text text-transparent`}>
              StandarDaPP
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced Smart Contract Standard Analyzer
            </p>
          </div>
        </div>
        
        <button
          onClick={onToggleTheme}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50' 
              : 'bg-white/80 border border-gray-200 hover:bg-gray-50 shadow-lg'
          } backdrop-blur-sm`}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
        </button>
      </div>

      <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Discover and analyze ERC/EIP standards implemented by smart contracts across multiple blockchain networks
      </p>
    </header>
  );
};