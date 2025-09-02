import React from 'react';
import { Cpu, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { ContractInfo as ContractInfoType } from '../types';
import { NETWORKS } from '../constants/networks';
import { shortenAddress } from '../utils/address';

interface ContractInfoProps {
  contractInfo: ContractInfoType;
  contractAddress: string;
  selectedNetwork: string;
  isDarkMode: boolean;
  copied: boolean;
  onCopy: (address: string) => void;
}

export const ContractInfo: React.FC<ContractInfoProps> = ({
  contractInfo,
  contractAddress,
  selectedNetwork,
  isDarkMode,
  copied,
  onCopy
}) => {
  return (
    <div className={`mb-6 p-4 rounded-xl ${
      isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <Cpu className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-blue-400">Contract Information</h3>
        <button
          onClick={() => onCopy(contractAddress)}
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
  );
};