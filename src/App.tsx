import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BackgroundElements } from './components/BackgroundElements';
import { AnalysisForm } from './components/AnalysisForm';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ContractInfo } from './components/ContractInfo';
import { StandardsResults } from './components/StandardsResults';
import { AnalysisHistory } from './components/AnalysisHistory';
import { Footer } from './components/Footer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useContractAnalysis } from './hooks/useContractAnalysis';
import { copyToClipboard } from './utils/address';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme', true);
  const [contractAddress, setContractAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const {
    isAnalyzing,
    results,
    error,
    debugInfo,
    contractInfo,
    analysisHistory,
    analyzeContract,
    setAnalysisHistory
  } = useContractAnalysis();

  const handleCopy = async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAnalyze = () => {
    analyzeContract(contractAddress, selectedNetwork);
  };

  const handleSelectHistoryEntry = (address: string, network: string) => {
    setContractAddress(address);
    setSelectedNetwork(network);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isAnalyzing && contractAddress.trim()) {
        handleAnalyze();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [contractAddress, selectedNetwork, isAnalyzing]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <BackgroundElements isDarkMode={isDarkMode} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
        />

        <div className={`${
          isDarkMode 
            ? 'bg-gray-900/40 border-gray-700/30' 
            : 'bg-white/80 border-gray-200/50 shadow-2xl'
        } border rounded-3xl p-8 mb-8 backdrop-blur-xl`}>
          
          <AnalysisForm
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            isDarkMode={isDarkMode}
            debugInfo={debugInfo}
            showDebug={showDebug}
            setShowDebug={setShowDebug}
          />

          <ErrorDisplay error={error} />

          {contractInfo && (
            <ContractInfo
              contractInfo={contractInfo}
              contractAddress={contractAddress}
              selectedNetwork={selectedNetwork}
              isDarkMode={isDarkMode}
              copied={copied}
              onCopy={handleCopy}
            />
          )}

          {results && (
            <>
              <StandardsResults results={results} isDarkMode={isDarkMode} />
              <Footer isDarkMode={isDarkMode} showTimestamp />
            </>
          )}
        </div>

        <AnalysisHistory
          analysisHistory={analysisHistory}
          isDarkMode={isDarkMode}
          onSelectEntry={handleSelectHistoryEntry}
        />

        {!results && <Footer isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}