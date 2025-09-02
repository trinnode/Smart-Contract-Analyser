import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { NETWORKS } from '../constants/networks';

interface AnalysisFormProps {
  contractAddress: string;
  setContractAddress: (address: string) => void;
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  isDarkMode: boolean;
  debugInfo: string;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  contractAddress,
  setContractAddress,
  selectedNetwork,
  setSelectedNetwork,
  isAnalyzing,
  onAnalyze,
  isDarkMode,
  debugInfo,
  showDebug,
  setShowDebug
}) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600/30 text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-gray-800/70' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
            } backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 outline-none`}
            disabled={isAnalyzing}
          />
        </div>
        
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Network
          </label>
          <div className="relative">
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border appearance-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600/30 text-white focus:border-blue-500/50 focus:bg-gray-800/70' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 outline-none`}
              disabled={isAnalyzing}
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-2 opacity-0">Action</label>
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !contractAddress.trim()}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 ${
              isAnalyzing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 active:scale-95'
            } text-white shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Debug Toggle */}
      {debugInfo && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>
      )}

      {/* Debug Info */}
      {showDebug && debugInfo && (
        <div className={`p-4 rounded-xl text-xs font-mono max-h-32 overflow-y-auto ${
          isDarkMode ? 'bg-gray-800/30 border border-gray-700/30' : 'bg-gray-50 border border-gray-200'
        }`}>
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
};