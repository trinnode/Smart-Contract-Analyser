import React from 'react';
import { Zap, Code, TrendingUp, Network, Shield, Cpu } from 'lucide-react';
import { AnalysisResult } from '../types';
import { AnalysisSummary } from './AnalysisSummary';
import { StandardCard } from './StandardCard';

interface StandardsResultsProps {
  results: AnalysisResult[];
  isDarkMode: boolean;
}

export const StandardsResults: React.FC<StandardsResultsProps> = ({ results, isDarkMode }) => {
  const categorizeResults = (results: AnalysisResult[]) => {
    const categories: Record<string, AnalysisResult[]> = {};
    results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });
    return categories;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Token': return <Zap className="h-5 w-5 text-yellow-400" />;
      case 'NFT': return <Code className="h-5 w-5 text-pink-400" />;
      case 'DeFi': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'Proxy': return <Network className="h-5 w-5 text-blue-400" />;
      case 'Access': return <Shield className="h-5 w-5 text-purple-400" />;
      case 'Core': return <Cpu className="h-5 w-5 text-gray-400" />;
      default: return <Code className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <AnalysisSummary results={results} isDarkMode={isDarkMode} />

      {/* Standards by Category */}
      {Object.entries(categorizeResults(results)).map(([category, standards]) => (
        <div key={category} className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/30 border border-gray-700/30' : 'bg-white/70 border border-gray-200/50'
        } backdrop-blur-sm`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              {getCategoryIcon(category)}
            </div>
            <h3 className="text-lg font-semibold">{category} Standards</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {standards.filter(s => s.detected).length} / {standards.length}
            </div>
          </div>

          <div className="space-y-3">
            {standards.sort((a, b) => Number(b.detected) - Number(a.detected)).map((standard, index) => (
              <StandardCard
                key={standard.name}
                standard={standard}
                index={index}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};