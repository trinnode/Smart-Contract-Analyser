import React, { useState, useEffect } from 'react';
import { Search, Shield, Code, Zap, Moon, Sun, ChevronDown, ExternalLink, Copy, CheckCircle, XCircle, AlertTriangle, Cpu, Network, Clock, TrendingUp } from 'lucide-react';

// Enhanced network configurations with latest endpoints
const NETWORKS = {
  ethereum: {
    name: "Ethereum",
    rpcUrl: "https://ethereum.publicnode.com",
    fallbackRpcUrl: "https://rpc.ankr.com/eth",
    explorer: "https://etherscan.io",
    color: "from-blue-400 to-purple-500",
    chainId: 1
  },
  polygon: {
    name: "Polygon",
    rpcUrl: "https://polygon.llamarpc.com",
    fallbackRpcUrl: "https://rpc.ankr.com/polygon",
    explorer: "https://polygonscan.com",
    color: "from-purple-400 to-pink-500",
    chainId: 137
  },
  arbitrum: {
    name: "Arbitrum",
    rpcUrl: "https://arbitrum.llamarpc.com",
    fallbackRpcUrl: "https://rpc.ankr.com/arbitrum",
    explorer: "https://arbiscan.io",
    color: "from-blue-400 to-cyan-500",
    chainId: 42161
  },
  optimism: {
    name: "Optimism",
    rpcUrl: "https://optimism.llamarpc.com",
    fallbackRpcUrl: "https://rpc.ankr.com/optimism",
    explorer: "https://optimistic.etherscan.io",
    color: "from-red-400 to-pink-500",
    chainId: 10
  },
  base: {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    fallbackRpcUrl: "https://base.llamarpc.com",
    explorer: "https://basescan.org",
    color: "from-blue-400 to-indigo-500",
    chainId: 8453
  },
  bsc: {
    name: "BNB Chain",
    rpcUrl: "https://bsc.publicnode.com",
    fallbackRpcUrl: "https://rpc.ankr.com/bsc",
    explorer: "https://bscscan.com",
    color: "from-yellow-400 to-orange-500",
    chainId: 56
  }
};

// Comprehensive ERC/EIP standards with enhanced detection
const STANDARDS = [
  {
    name: 'ERC-20',
    type: 'BYTECODE',
    selectors: ['a9059cbb', '18160ddd', '70a08231', '23b872dd', '095ea7b3', 'dd62ed3e', '06fdde03', '95d89b41', '313ce567'],
    requiredSelectorPercentage: 60,
    description: 'Fungible Token Standard - The most widely used standard for cryptocurrencies and utility tokens',
    category: 'Token',
    icon: '🪙'
  },
  {
    name: 'ERC-721',
    type: 'ERC165',
    interfaceId: '0x80ac58cd',
    description: 'Non-Fungible Token Standard - Each token is unique and indivisible',
    category: 'NFT',
    icon: '🎨'
  },
  {
    name: 'ERC-1155',
    type: 'ERC165',
    interfaceId: '0xd9b67a26',
    description: 'Multi-Token Standard - Supports both fungible and non-fungible tokens in a single contract',
    category: 'Token',
    icon: '🎭'
  },
  {
    name: 'ERC-721 Metadata',
    type: 'ERC165',
    interfaceId: '0x5b5e139f',
    description: 'NFT Metadata Extension - Adds name, symbol, and tokenURI functionality',
    category: 'NFT',
    icon: '📋'
  },
  {
    name: 'ERC-721 Enumerable',
    type: 'ERC165',
    interfaceId: '0x780e9d63',
    description: 'NFT Enumeration Extension - Allows iteration over all tokens',
    category: 'NFT',
    icon: '📊'
  },
  {
    name: 'ERC-4906',
    type: 'ERC165',
    interfaceId: '0x49064906',
    description: 'EIP-4906 Metadata Update Extension - Emits events when NFT metadata changes',
    category: 'NFT',
    icon: '🔄'
  },
  {
    name: 'ERC-2981',
    type: 'ERC165',
    interfaceId: '0x2a55205a',
    description: 'NFT Royalty Standard - Enables on-chain royalty payments',
    category: 'NFT',
    icon: '💰'
  },
  {
    name: 'ERC-1967',
    type: 'BYTECODE',
    selectors: ['5c60da1b', '3659cfe6'],
    requiredSelectorPercentage: 50,
    description: 'Proxy Storage Slots - Standard for upgradeable smart contracts',
    category: 'Proxy',
    icon: '🔗'
  },
  {
    name: 'ERC-173',
    type: 'ERC165',
    interfaceId: '0x7f5828d0',
    description: 'Contract Ownership Standard - Defines ownership transfer mechanisms',
    category: 'Access',
    icon: '👑'
  },
  {
    name: 'ERC-165',
    type: 'BYTECODE',
    selectors: ['01ffc9a7'],
    requiredSelectorPercentage: 100,
    description: 'Standard Interface Detection - Allows contracts to advertise their interfaces',
    category: 'Core',
    icon: '🔍'
  },
  {
    name: 'ERC-3156',
    type: 'ERC165',
    interfaceId: '0xb3086308',
    description: 'Flash Loan Standard - Enables uncollateralized loans within a single transaction',
    category: 'DeFi',
    icon: '⚡'
  },
  {
    name: 'ERC-4626',
    type: 'BYTECODE',
    selectors: ['ce96cb77', '38d52e0f', 'c6e6f592', 'ba087652'],
    requiredSelectorPercentage: 75,
    description: 'Tokenized Vault Standard - Standard for yield-bearing vaults',
    category: 'DeFi',
    icon: '🏦'
  }
];

// Utility functions
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const shortenAddress = (address, chars = 4) => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

// Custom hooks
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

// Main component
export default function StandarDaPP() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme', true);
  const [contractAddress, setContractAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useLocalStorage('analysisHistory', []);
  const [contractInfo, setContractInfo] = useState(null);

  // Debug logging
  const debugLog = (message) => {
    console.log(`[StandarDaPP] ${message}`);
    setDebugInfo(prev => `${prev}\n${new Date().toLocaleTimeString()}: ${message}`);
  };

  // Theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Provider creation with fallback
  const createProvider = async (networkKey) => {
    const network = NETWORKS[networkKey];
    if (!network) throw new Error('Invalid network selected');

    debugLog(`Connecting to ${network.name}...`);

    // Using fetch instead of ethers for broader compatibility
    const testRPC = async (url) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      if (!response.ok) throw new Error(`RPC request failed: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      return {
        url,
        blockNumber: parseInt(data.result, 16)
      };
    };

    try {
      const primary = await testRPC(network.rpcUrl);
      debugLog(`Connected to ${network.name}! Block: ${primary.blockNumber}`);
      return primary.url;
    } catch (error) {
      debugLog(`Primary RPC failed: ${error.message}`);
      
      if (network.fallbackRpcUrl) {
        try {
          const fallback = await testRPC(network.fallbackRpcUrl);
          debugLog(`Connected via fallback! Block: ${fallback.blockNumber}`);
          return fallback.url;
        } catch (fallbackError) {
          debugLog(`Fallback RPC failed: ${fallbackError.message}`);
        }
      }
      throw error;
    }
  };

  // RPC call helper
  const rpcCall = async (rpcUrl, method, params = []) => {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Math.floor(Math.random() * 1000)
      })
    });

    if (!response.ok) throw new Error(`RPC request failed: ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.result;
  };

  // Check if address is contract
  const isContract = async (rpcUrl, address) => {
    const code = await rpcCall(rpcUrl, 'eth_getCode', [address, 'latest']);
    return code && code !== '0x';
  };

  // ERC-165 interface check
  const checkERC165 = async (rpcUrl, address, interfaceId) => {
    try {
      const data = `0x01ffc9a7${interfaceId.slice(2).padStart(64, '0')}`;
      const result = await rpcCall(rpcUrl, 'eth_call', [
        { to: address, data },
        'latest'
      ]);
      
      return result && result !== '0x' && result.endsWith('1');
    } catch (error) {
      return false;
    }
  };

  // Bytecode analysis
  const analyzeBytecode = (bytecode, standard) => {
    const cleanBytecode = bytecode.toLowerCase();
    let matches = 0;
    const foundSelectors = [];

    for (const selector of standard.selectors) {
      if (cleanBytecode.includes(selector.toLowerCase())) {
        matches++;
        foundSelectors.push(selector);
      }
    }

    const percentage = (matches / standard.selectors.length) * 100;
    return {
      detected: percentage >= standard.requiredSelectorPercentage,
      matchPercentage: percentage,
      foundSelectors,
      totalSelectors: standard.selectors.length
    };
  };

  // Get contract info
  const getContractInfo = async (rpcUrl, address) => {
    try {
      const [code, balance] = await Promise.all([
        rpcCall(rpcUrl, 'eth_getCode', [address, 'latest']),
        rpcCall(rpcUrl, 'eth_getBalance', [address, 'latest'])
      ]);

      return {
        codeSize: Math.floor((code.length - 2) / 2), // Remove 0x and divide by 2
        balance: parseInt(balance, 16) / Math.pow(10, 18),
        hasCode: code && code !== '0x'
      };
    } catch (error) {
      return null;
    }
  };

  // Main analysis function
  const analyzeContract = async () => {
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
      const rpcUrl = await createProvider(selectedNetwork);
      const network = NETWORKS[selectedNetwork];

      // Check if it's a contract
      const hasCode = await isContract(rpcUrl, contractAddress);
      if (!hasCode) {
        setError('This address is an Externally Owned Account (EOA), not a smart contract.');
        return;
      }

      // Get contract info
      const info = await getContractInfo(rpcUrl, contractAddress);
      setContractInfo(info);

      // Get bytecode
      debugLog('Fetching contract bytecode...');
      const bytecode = await rpcCall(rpcUrl, 'eth_getCode', [contractAddress, 'latest']);

      debugLog(`Bytecode size: ${Math.floor((bytecode.length - 2) / 2)} bytes`);

      // Analyze standards
      const analysisPromises = STANDARDS.map(async (standard) => {
        try {
          debugLog(`Checking ${standard.name}...`);
          
          if (standard.type === 'ERC165') {
            const detected = await checkERC165(rpcUrl, contractAddress, standard.interfaceId);
            return { ...standard, detected };
          } else {
            const analysis = analyzeBytecode(bytecode, standard);
            return { ...standard, ...analysis };
          }
        } catch (error) {
          debugLog(`Error checking ${standard.name}: ${error.message}`);
          return { ...standard, detected: false, error: error.message };
        }
      });

      const analysisResults = await Promise.all(analysisPromises);
      const detectedCount = analysisResults.filter(r => r.detected).length;

      debugLog(`Analysis complete! Detected ${detectedCount}/${STANDARDS.length} standards`);

      // Save to history
      const historyEntry = {
        address: contractAddress,
        network: selectedNetwork,
        timestamp: Date.now(),
        results: analysisResults,
        detectedCount
      };

      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      setResults(analysisResults);

    } catch (err) {
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

  // Handle copy address
  const handleCopy = async (address) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isAnalyzing) {
        analyzeContract();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [contractAddress, selectedNetwork, isAnalyzing]);

  // Categories for results
  const categorizeResults = (results) => {
    const categories = {};
    results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });
    return categories;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      {/* Animated background elements */}
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
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
              onClick={toggleTheme}
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

        {/* Main Analysis Card */}
        <div className={`${
          isDarkMode 
            ? 'bg-gray-900/40 border-gray-700/30' 
            : 'bg-white/80 border-gray-200/50 shadow-2xl'
        } border rounded-3xl p-8 mb-8 backdrop-blur-xl`}>
          
          {/* Input Section */}
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
                  onClick={analyzeContract}
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

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Contract Info */}
          {contractInfo && (
            <div className={`mb-6 p-4 rounded-xl ${
              isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">Contract Information</h3>
                <button
                  onClick={() => handleCopy(contractAddress)}
                  className="ml-auto text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  title="Copy address"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
                  <div className="text-blue-400 font-medium">Address</div>
                  <div className="font-mono">{shortenAddress(contractAddress, 6)}</div>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
                  <div className="text-blue-400 font-medium">Bytecode Size</div>
                  <div>{contractInfo.codeSize.toLocaleString()} bytes</div>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}>
                  <div className="text-blue-400 font-medium">Balance</div>
                  <div>{contractInfo.balance.toFixed(4)} ETH</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Network: {NETWORKS[selectedNetwork].name}
                </div>
                <a
                  href={`${NETWORKS[selectedNetwork].explorer}/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 text-sm"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Summary Stats */}
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
                      {results.filter(r => r.detected).length}
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
                      {Math.round((results.filter(r => r.detected).length / results.length) * 100)}%
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Coverage Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">
                      {new Set(results.filter(r => r.detected).map(r => r.category)).size}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Categories
                    </div>
                  </div>
                </div>
              </div>

              {/* Standards by Category */}
              {Object.entries(categorizeResults(results)).map(([category, standards]) => (
                <div key={category} className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800/30 border border-gray-700/30' : 'bg-white/70 border border-gray-200/50'
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      {category === 'Token' && <Zap className="h-5 w-5 text-yellow-400" />}
                      {category === 'NFT' && <Code className="h-5 w-5 text-pink-400" />}
                      {category === 'DeFi' && <TrendingUp className="h-5 w-5 text-green-400" />}
                      {category === 'Proxy' && <Network className="h-5 w-5 text-blue-400" />}
                      {category === 'Access' && <Shield className="h-5 w-5 text-purple-400" />}
                      {category === 'Core' && <Cpu className="h-5 w-5 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold">{category} Standards</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {standards.filter(s => s.detected).length} / {standards.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {standards.sort((a, b) => b.detected - a.detected).map((standard, index) => (
                      <div
                        key={standard.name}
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
                                    ({Math.round(standard.matchPercentage)}%)
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

                            {standard.type === 'ERC165' && (
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
                    ))}
                  </div>
                </div>
              ))}

              {/* Analysis Timestamp */}
              <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2`}>
                <Clock className="h-4 w-4" />
                Analysis completed at {new Date().toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Recent Analysis History */}
        {analysisHistory.length > 0 && (
          <div className={`${
            isDarkMode ? 'bg-gray-900/40 border-gray-700/30' : 'bg-white/80 border-gray-200/50 shadow-xl'
          } border rounded-3xl p-8 backdrop-blur-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Recent Analyses</h2>
            </div>

            <div className="space-y-3">
              {analysisHistory.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.timestamp}
                  onClick={() => {
                    setContractAddress(entry.address);
                    setSelectedNetwork(entry.network);
                  }}
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
        )}

        {/* Footer */}
        <footer className={`text-center mt-12 pt-8 border-t ${
          isDarkMode ? 'border-gray-800/50 text-gray-500' : 'border-gray-200 text-gray-400'
        }`}>
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
      </div>
    </div>
  );
}
