import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface StandardCardProps {
  standard: AnalysisResult;
  index: number;
  isDarkMode: boolean;
}

export const StandardCard: React.FC<StandardCardProps> = ({ standard, index, isDarkMode }) => {
  return (
    <div
      className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
        standard.detected 
          ? `bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 hover:border-emerald-400/50` 
          : `${isDarkMode ? 'bg-gray-700/30 border border-gray-600/30' : 'bg-gray-50 border border-gray-300/50'} hover:border-gray-500/50`
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {standard.detected ? (
            <CheckCircle className="h-6 w-6 text-emerald-400" />
          ) : (
            <XCircle className={`h-6 w-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{standard.icon}</span>
              <h4 className="font-semibold text-lg">{standard.name}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                standard.detected 
                  ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                  : `${isDarkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-gray-200 text-gray-600'} border border-gray-400/30`
              }`}>
                {standard.detected ? 'Detected' : 'Not Found'}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                {standard.type}
              </span>
            </div>
          </div>
          
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {standard.description}
          </p>

          {/* Additional analysis info */}
          {standard.type === 'BYTECODE' && standard.foundSelectors && (
            <div className={`text-xs p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Function Signatures Analysis
                </span>
                <span className="font-medium">
                  {standard.foundSelectors.length}/{standard.totalSelectors} 
                  ({Math.round(standard.matchPercentage || 0)}%)
                </span>
              </div>
              {standard.foundSelectors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {standard.foundSelectors.map(selector => (
                    <code 
                      key={selector}
                      className={`px-2 py-1 rounded text-xs ${
                        isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {selector}
                    </code>
                  ))}
                </div>
              )}
            </div>
          )}

          {standard.type === 'ERC165' && standard.interfaceId && (
            <div className={`text-xs p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Interface ID
                </span>
                <code className={`px-2 py-1 rounded font-mono ${
                  standard.detected 
                    ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                    : (isDarkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-gray-200 text-gray-600')
                }`}>
                  {standard.interfaceId}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};