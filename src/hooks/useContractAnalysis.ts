import { useState } from 'react';
import { AnalysisResult, ContractInfo, AnalysisHistoryEntry } from '../types';
import { STANDARDS } from '../constants/standards';
import { RPCService } from '../services/rpcService';
import { StandardAnalyzer } from '../services/standardAnalyzer';
import { isValidAddress } from '../utils/address';
import { useLocalStorage } from './useLocalStorage';

export const useContractAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage<AnalysisHistoryEntry[]>('analysisHistory', []);

  const debugLog = (message: string) => {
    console.log(`[StandarDaPP] ${message}`);
    setDebugInfo(prev => `${prev}\n${new Date().toLocaleTimeString()}: ${message}`);
  };

  const analyzeContract = async (contractAddress: string, selectedNetwork: string) => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    if (!isValidAddress(contractAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);
    setContractInfo(null);
    setDebugInfo('');

    try {
      debugLog(`Starting analysis for ${contractAddress}`);
      const rpcUrl = await RPCService.createProvider(selectedNetwork);

      // Check if it's a contract
      const hasCode = await RPCService.isContract(rpcUrl, contractAddress);
      if (!hasCode) {
        setError('This address is an Externally Owned Account (EOA), not a smart contract.');
        return;
      }

      // Get contract info
      const info = await RPCService.getContractInfo(rpcUrl, contractAddress);
      setContractInfo(info);

      // Get bytecode
      debugLog('Fetching contract bytecode...');
      const bytecode = await RPCService.rpcCall(rpcUrl, 'eth_getCode', [contractAddress, 'latest']);

      debugLog(`Bytecode size: ${Math.floor((bytecode.length - 2) / 2)} bytes`);

      // Analyze standards
      const analysisPromises = STANDARDS.map(standard => 
        StandardAnalyzer.analyzeStandard(rpcUrl, contractAddress, bytecode, standard)
      );

      const analysisResults = await Promise.all(analysisPromises);
      const detectedCount = analysisResults.filter(r => r.detected).length;

      debugLog(`Analysis complete! Detected ${detectedCount}/${STANDARDS.length} standards`);

      // Save to history
      const historyEntry: AnalysisHistoryEntry = {
        address: contractAddress,
        network: selectedNetwork,
        timestamp: Date.now(),
        results: analysisResults,
        detectedCount
      };

      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
      setResults(analysisResults);

    } catch (err: any) {
      console.error('Analysis error:', err);
      debugLog(`Analysis failed: ${err.message}`);
      
      let errorMessage = 'Analysis failed. ';
      if (err.message.includes('timeout') || err.message.includes('Timeout')) {
        errorMessage += 'Request timed out. The network may be slow.';
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        errorMessage += 'Network connection failed. Please check your connection.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    results,
    error,
    debugInfo,
    contractInfo,
    analysisHistory,
    analyzeContract,
    setAnalysisHistory
  };
};