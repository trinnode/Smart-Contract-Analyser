export interface Network {
  name: string;
  rpcUrl: string;
  fallbackRpcUrl: string;
  explorer: string;
  color: string;
  chainId: number;
}

export interface Standard {
  name: string;
  type: 'BYTECODE' | 'ERC165';
  selectors?: string[];
  interfaceId?: string;
  requiredSelectorPercentage?: number;
  description: string;
  category: string;
  icon: string;
}

export interface AnalysisResult extends Standard {
  detected: boolean;
  matchPercentage?: number;
  foundSelectors?: string[];
  totalSelectors?: number;
  error?: string;
}

export interface ContractInfo {
  codeSize: number;
  balance: number;
  hasCode: boolean;
}

export interface AnalysisHistoryEntry {
  address: string;
  network: string;
  timestamp: number;
  results: AnalysisResult[];
  detectedCount: number;
}