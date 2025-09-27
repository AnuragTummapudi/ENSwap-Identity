import { ONE_INCH_API_KEY, ONE_INCH_ENDPOINTS, TOKENS } from '@/config/constants';

export interface SwapQuote {
  fromToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
  toToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
  toAmount: string;
  fromAmount: string;
  estimatedGas: string;
  protocols: any[];
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  fromAddress: string;
  slippage: number;
}

class OneInchService {
  private apiKey: string;

  constructor() {
    this.apiKey = ONE_INCH_API_KEY;
  }

  private async makeRequest(url: string, params: Record<string, any> = {}): Promise<any> {
    const queryString = new URLSearchParams({
      ...params,
      key: this.apiKey,
    }).toString();

    const response = await fetch(`${url}?${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getQuote(params: SwapParams): Promise<SwapQuote> {
    try {
      const { fromToken, toToken, amount, fromAddress, slippage } = params;
      
      const result = await this.makeRequest(ONE_INCH_ENDPOINTS.QUOTE, {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amount,
        fromAddress: fromAddress,
        slippage: slippage,
      });

      return {
        fromToken: {
          symbol: result.fromToken.symbol,
          name: result.fromToken.name,
          address: result.fromToken.address,
          decimals: result.fromToken.decimals,
        },
        toToken: {
          symbol: result.toToken.symbol,
          name: result.toToken.name,
          address: result.toToken.address,
          decimals: result.toToken.decimals,
        },
        toAmount: result.toAmount,
        fromAmount: result.fromAmount,
        estimatedGas: result.estimatedGas,
        protocols: result.protocols,
      };
    } catch (error) {
      console.error('Failed to get quote from 1inch:', error);
      throw error;
    }
  }

  async getSwapData(params: SwapParams): Promise<any> {
    try {
      const { fromToken, toToken, amount, fromAddress, slippage } = params;
      
      const result = await this.makeRequest(ONE_INCH_ENDPOINTS.SWAP, {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amount,
        fromAddress: fromAddress,
        slippage: slippage,
      });

      return result;
    } catch (error) {
      console.error('Failed to get swap data from 1inch:', error);
      throw error;
    }
  }

  async getTokens(): Promise<any[]> {
    try {
      // This would typically be a separate endpoint, but for now we'll use our static tokens
      return Object.values(TOKENS);
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return Object.values(TOKENS);
    }
  }

  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      // This would be a separate API call to get token prices
      // For now, we'll return mock prices based on token symbols
      const token = Object.values(TOKENS).find(t => t.address === tokenAddress);
      
      const mockPrices: Record<string, number> = {
        HBAR: 0.15,
        ETH: 2500,
        USDC: 1,
        USDT: 1,
      };

      return mockPrices[token?.symbol || ''] || 0;
    } catch (error) {
      console.error('Failed to get token price:', error);
      return 0;
    }
  }

  // Helper method to format token amounts
  formatTokenAmount(amount: string, decimals: number): string {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toFixed(6);
  }

  // Helper method to parse token amounts
  parseTokenAmount(amount: string, decimals: number): string {
    const num = parseFloat(amount) * Math.pow(10, decimals);
    return Math.floor(num).toString();
  }
}

// Export singleton instance
export const oneInchService = new OneInchService();
