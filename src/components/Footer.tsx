import React from 'react';
import { Shield, Clock } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  showTimestamp?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode, showTimestamp = false }) => {
  return (
    <footer className={`text-center mt-12 pt-8 border-t ${
      isDarkMode ? 'border-gray-800/50 text-gray-500' : 'border-gray-200 text-gray-400'
    }`}>
      {showTimestamp && (
        <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2 mb-6`}>
          <Clock className="h-4 w-4" />
          Analysis completed at {new Date().toLocaleString()}
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-400" />
        <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          StandarDaPP
        </span>
      </div>
      <p className="text-sm">
        Advanced Smart Contract Standard Detection • Built with React & Modern Web3 APIs
      </p>
      <p className="text-xs mt-2 opacity-75">
        Supports ERC-20, ERC-721, ERC-1155, ERC-165, ERC-173, ERC-1967, ERC-2981, ERC-4626, ERC-4906 & more
      </p>
    </footer>
  );
};