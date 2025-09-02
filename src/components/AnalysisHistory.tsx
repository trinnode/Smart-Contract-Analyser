import React from 'react';
import { Clock } from 'lucide-react';
import { AnalysisHistoryEntry } from '../types';
import { NETWORKS } from '../constants/networks';
import { shortenAddress } from '../utils/address';

interface AnalysisHistoryProps {
  analysisHistory: AnalysisHistoryEntry[];
  isDarkMode: boolean;
  onSelectEntry: (address: string, network: string) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  analysisHistory,
  isDarkMode,
  onSelectEntry
}) => {
  if (analysisHistory.length === 0) return null;

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-900/40 border-gray-700/30' : 'bg-white/80 border-gray-200/50 shadow-xl'
    } border rounded-3xl p-8 backdrop-blur-xl`}>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Recent Analyses</h2>
      </div>

      <div className="space-y-3">
        {analysisHistory.slice(0, 5).map((entry) => (
          <div
            key={entry.timestamp}
            onClick={() => onSelectEntry(entry.address, entry.network)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/40' 
                : 'bg-white/70 border border-gray-200/50 hover:bg-gray-50/80'
            } backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${NETWORKS[entry.network].color}`}></div>
                <code className="font-mono text-sm">{shortenAddress(entry.address)}</code>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                  {NETWORKS[entry.network].name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-emerald-400 font-medium">
                  {entry.detectedCount} standards
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};