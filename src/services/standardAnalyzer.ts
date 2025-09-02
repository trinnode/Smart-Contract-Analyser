import { Standard, AnalysisResult } from '../types';
import { RPCService } from './rpcService';

export class StandardAnalyzer {
  private static debugLog = (message: string) => {
    console.log(`[StandardAnalyzer] ${message}`);
  };

  static async checkERC165(rpcUrl: string, address: string, interfaceId: string): Promise<boolean> {
    try {
      const data = `0x01ffc9a7${interfaceId.slice(2).padStart(64, '0')}`;
      const result = await RPCService.rpcCall(rpcUrl, 'eth_call', [
        { to: address, data },
        'latest'
      ]);
      
      return result && result !== '0x' && result.endsWith('1');
    } catch (error) {
      return false;
    }
  }

  static analyzeBytecode(bytecode: string, standard: Standard) {
    const cleanBytecode = bytecode.toLowerCase();
    let matches = 0;
    const foundSelectors: string[] = [];

    if (!standard.selectors) {
      return { detected: false, matchPercentage: 0, foundSelectors, totalSelectors: 0 };
    }

    for (const selector of standard.selectors) {
      if (cleanBytecode.includes(selector.toLowerCase())) {
        matches++;
        foundSelectors.push(selector);
      }
    }

    const percentage = (matches / standard.selectors.length) * 100;
    return {
      detected: percentage >= (standard.requiredSelectorPercentage || 100),
      matchPercentage: percentage,
      foundSelectors,
      totalSelectors: standard.selectors.length
    };
  }

  static async analyzeStandard(
    rpcUrl: string, 
    address: string, 
    bytecode: string, 
    standard: Standard
  ): Promise<AnalysisResult> {
    try {
      this.debugLog(`Checking ${standard.name}...`);
      
      if (standard.type === 'ERC165' && standard.interfaceId) {
        const detected = await this.checkERC165(rpcUrl, address, standard.interfaceId);
        return { ...standard, detected };
      } else {
        const analysis = this.analyzeBytecode(bytecode, standard);
        return { ...standard, ...analysis };
      }
    } catch (error) {
      this.debugLog(`Error checking ${standard.name}: ${error.message}`);
      return { ...standard, detected: false, error: error.message };
    }
  }
}