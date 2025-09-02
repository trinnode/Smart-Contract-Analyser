import { NETWORKS } from '../constants/networks';

export class RPCService {
  private static debugLog = (message: string) => {
    console.log(`[StandarDaPP] ${message}`);
  };

  static async createProvider(networkKey: string): Promise<string> {
    const network = NETWORKS[networkKey];
    if (!network) throw new Error('Invalid network selected');

    this.debugLog(`Connecting to ${network.name}...`);

    const testRPC = async (url: string) => {
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
      this.debugLog(`Connected to ${network.name}! Block: ${primary.blockNumber}`);
      return primary.url;
    } catch (error) {
      this.debugLog(`Primary RPC failed: ${error.message}`);
      
      if (network.fallbackRpcUrl) {
        try {
          const fallback = await testRPC(network.fallbackRpcUrl);
          this.debugLog(`Connected via fallback! Block: ${fallback.blockNumber}`);
          return fallback.url;
        } catch (fallbackError) {
          this.debugLog(`Fallback RPC failed: ${fallbackError.message}`);
        }
      }
      throw error;
    }
  }

  static async rpcCall(rpcUrl: string, method: string, params: any[] = []): Promise<any> {
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
  }

  static async isContract(rpcUrl: string, address: string): Promise<boolean> {
    const code = await this.rpcCall(rpcUrl, 'eth_getCode', [address, 'latest']);
    return code && code !== '0x';
  }

  static async getContractInfo(rpcUrl: string, address: string) {
    try {
      const [code, balance] = await Promise.all([
        this.rpcCall(rpcUrl, 'eth_getCode', [address, 'latest']),
        this.rpcCall(rpcUrl, 'eth_getBalance', [address, 'latest'])
      ]);

      return {
        codeSize: Math.floor((code.length - 2) / 2),
        balance: parseInt(balance, 16) / Math.pow(10, 18),
        hasCode: code && code !== '0x'
      };
    } catch (error) {
      return null;
    }
  }
}