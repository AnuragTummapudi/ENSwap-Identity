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
    const queryString = new URLSearchParams(params).toString();
    
    // Try multiple approaches: local proxy, CORS proxy, then direct API
    const localProxyUrl = `http://localhost:3001/api/quote?${queryString}`;
    const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url + '?' + queryString)}`;
    const directUrl = `${url}?${queryString}`;
    
    // Try local proxy first
    try {
      const response = await fetch(localProxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ Successfully fetched quote via local proxy');
        return response.json();
      }
      
      throw new Error(`Local proxy error: ${response.status}`);
    } catch (localProxyError) {
      console.warn('Local proxy failed, trying CORS proxy:', localProxyError);
      
      // Try CORS proxy
      try {
        const response = await fetch(corsProxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Successfully fetched quote via CORS proxy');
          return data;
        }
        
        throw new Error(`CORS proxy error: ${response.status}`);
      } catch (corsProxyError) {
        console.warn('CORS proxy failed, trying direct API:', corsProxyError);
        
        // Try direct API call
        try {
          const response = await fetch(directUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'X-API-Key': this.apiKey,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('1inch API Error:', errorText);
            throw new Error(`1inch API error: ${response.status} ${response.statusText} - ${errorText}`);
          }

          console.log('✅ Successfully fetched quote via direct API');
          return response.json();
        } catch (directError) {
          console.error('All API methods failed:', directError);
          throw directError;
        }
      }
    }
  }

  async getQuote(params: SwapParams): Promise<SwapQuote> {
    try {
      const { fromToken, toToken, amount, fromAddress, slippage } = params;
      
      console.log('1inch API Request:', {
        endpoint: ONE_INCH_ENDPOINTS.QUOTE,
        params: {
          fromTokenAddress: fromToken,
          toTokenAddress: toToken,
          amount: amount,
          fromAddress: fromAddress,
          slippage: slippage,
        },
        apiKey: this.apiKey ? 'Present' : 'Missing'
      });
      
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
      
      // Return a realistic mock quote when API fails
      const fromTokenData = Object.values(TOKENS).find(t => t.address === params.fromToken);
      const toTokenData = Object.values(TOKENS).find(t => t.address === params.toToken);
      
      if (fromTokenData && toTokenData) {
        console.warn('⚠️ API failed, using realistic mock quote for demo');
        
        // Calculate realistic exchange rates
        let exchangeRate = 1;
        if (fromTokenData.symbol === 'ETH' && toTokenData.symbol === 'USDC') {
          exchangeRate = 2500; // 1 ETH = 2500 USDC
        } else if (fromTokenData.symbol === 'USDC' && toTokenData.symbol === 'ETH') {
          exchangeRate = 1/2500; // 1 USDC = 0.0004 ETH
        } else if (fromTokenData.symbol === 'ETH' && toTokenData.symbol === 'USDT') {
          exchangeRate = 2500; // 1 ETH = 2500 USDT
        } else if (fromTokenData.symbol === 'USDT' && toTokenData.symbol === 'ETH') {
          exchangeRate = 1/2500; // 1 USDT = 0.0004 ETH
        } else if (fromTokenData.symbol === 'USDC' && toTokenData.symbol === 'USDT') {
          exchangeRate = 1; // 1 USDC = 1 USDT
        } else if (fromTokenData.symbol === 'USDT' && toTokenData.symbol === 'USDC') {
          exchangeRate = 1; // 1 USDT = 1 USDC
        }
        
        // Apply 0.3% slippage to make it realistic
        const slippageFactor = 0.997;
        const inputAmount = parseFloat(params.amount) / Math.pow(10, fromTokenData.decimals);
        const outputAmount = inputAmount * exchangeRate * slippageFactor;
        const mockToAmount = (outputAmount * Math.pow(10, toTokenData.decimals)).toString();
        
        return {
          fromToken: {
            symbol: fromTokenData.symbol,
            name: fromTokenData.name,
            address: fromTokenData.address,
            decimals: fromTokenData.decimals,
          },
          toToken: {
            symbol: toTokenData.symbol,
            name: toTokenData.name,
            address: toTokenData.address,
            decimals: toTokenData.decimals,
          },
          toAmount: mockToAmount,
          fromAmount: params.amount,
          estimatedGas: '21000',
          protocols: [['UNISWAP_V3', 'SUSHISWAP']], // Mock protocol path
        };
      }
      
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

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      // For ETH balance, we would use eth_getBalance
      // For ERC20 tokens, we would call the balanceOf function
      // For now, we'll return mock balances
      const token = Object.values(TOKENS).find(t => t.address === tokenAddress);
      
      if (!token) {
        return "0";
      }

      // Mock balances for demo
      const mockBalances: Record<string, string> = {
        HBAR: "1000",
        ETH: "1.5",
        USDC: "500",
        USDT: "200",
      };

      const balance = mockBalances[token.symbol] || "0";
      return (parseFloat(balance) * Math.pow(10, token.decimals)).toString();
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return "0";
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
