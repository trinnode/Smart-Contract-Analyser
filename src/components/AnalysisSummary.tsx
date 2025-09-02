import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisSummaryProps {
  results: AnalysisResult[];
  isDarkMode: boolean;
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ results, isDarkMode }) => {
  const detectedCount = results.filter(r => r.detected).length;
  const categoriesCount = new Set(results.filter(r => r.detected).map(r => r.category)).size;

  return (
    <div className={`p-6 rounded-xl ${
      isDarkMode ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20' 
                : 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="h-6 w-6 text-emerald-400" />
        <h3 className="text-xl font-bold">Analysis Summary</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">
            {detectedCount}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Standards Detected
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">
            {results.length}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Standards Checked
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            {Math.round((detectedCount / results.length) * 100)}%
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Coverage Rate
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400">
            {categoriesCount}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Categories
          </div>
        </div>
      </div>
    </div>
  );
};