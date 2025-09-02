import { Network } from '../types';

export const NETWORKS: Record<string, Network> = {
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