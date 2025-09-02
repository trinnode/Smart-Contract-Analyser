import { Standard } from '../types';

export const STANDARDS: Standard[] = [
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