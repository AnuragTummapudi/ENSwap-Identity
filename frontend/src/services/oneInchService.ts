import { ONE_INCH_API_KEY, ONE_INCH_ENDPOINTS, TOKENS, SUPPORTED_CHAINS } from '@/config/constants';

// Interfaces based on 1inch API documentation
export interface SwapQuote {
  fromToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
  toToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
  toAmount: string;
  fromAmount: string;
  estimatedGas: string;
  protocols: any[][];
  tx?: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: string;
  };
}

export interface SwapData {
  fromToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
  toToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
  toAmount: string;
  fromAmount: string;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: string;
  };
  protocols: any[][];
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  fromAddress: string;
  slippage?: number;
  chainId?: number;
  protocols?: string;
  gasPrice?: string;
  includeTokensInfo?: boolean;
  includeProtocols?: boolean;
  includeGas?: boolean;
}

class OneInchService {
  private apiKey: string;
  private defaultChainId: number;

  constructor() {
    this.apiKey = ONE_INCH_API_KEY;
    this.defaultChainId = SUPPORTED_CHAINS.ETHEREUM; // Default to Ethereum
  }

  /**
   * Make authenticated request to 1inch API
   * Following official documentation: https://portal.1inch.dev/documentation/apis/swap/classic-swap/quick-start
   */
  private async makeRequest(
    endpoint: string, 
    chainId: number, 
    params: Record<string, any> = {}
  ): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}/${chainId}?${queryString}`;
    
    // Try local proxy first, then CORS proxy, then direct API
    const localProxyUrl = `http://localhost:3001/api${endpoint.includes('quote') ? '/quote' : '/swap'}?chain=${chainId}&${queryString}`;
    const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    console.log('1inch API Request:', {
      endpoint: url,
      params,
      apiKey: this.apiKey ? 'Present' : 'Missing'
    });
    
    // Try local proxy first
    try {
      const response = await fetch(localProxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ Successfully fetched data via local proxy');
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
          console.log('✅ Successfully fetched data via CORS proxy');
          return data;
        }
        
        throw new Error(`CORS proxy error: ${response.status}`);
      } catch (corsProxyError) {
        console.warn('CORS proxy failed, trying direct API:', corsProxyError);
        
        // Try direct API call
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('1inch API Error:', errorText);
            throw new Error(`1inch API error: ${response.status} ${response.statusText} - ${errorText}`);
          }

          console.log('✅ Successfully fetched data via direct API');
          return response.json();
        } catch (directError) {
          console.error('All API methods failed:', directError);
          throw directError;
        }
      }
    }
  }

  /**
   * Get swap quote from 1inch API
   * Documentation: https://portal.1inch.dev/documentation/apis/swap/classic-swap/quote
   */
  async getQuote(params: SwapParams): Promise<SwapQuote> {
    try {
      const {
        fromToken,
        toToken,
        amount,
        fromAddress,
        slippage = 1,
        chainId = this.defaultChainId,
        includeTokensInfo = true,
        includeProtocols = true,
        includeGas = true
      } = params;
      
      const quoteParams = {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amount,
        fromAddress: fromAddress,
        slippage: slippage,
        includeTokensInfo: includeTokensInfo,
        includeProtocols: includeProtocols,
        includeGas: includeGas
      };

      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/quote`,
        chainId,
        quoteParams
      );

      return {
        fromToken: {
          symbol: result.fromToken.symbol,
          name: result.fromToken.name,
          address: result.fromToken.address,
          decimals: result.fromToken.decimals,
          logoURI: result.fromToken.logoURI,
        },
        toToken: {
          symbol: result.toToken.symbol,
          name: result.toToken.name,
          address: result.toToken.address,
          decimals: result.toToken.decimals,
          logoURI: result.toToken.logoURI,
        },
        toAmount: result.toAmount,
        fromAmount: result.fromAmount,
        estimatedGas: result.estimatedGas,
        protocols: result.protocols || [],
        tx: result.tx,
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
        
        // Apply slippage to make it realistic
        const slippageFactor = 1 - (params.slippage || 1) / 100;
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

  /**
   * Get swap transaction data from 1inch API
   * Documentation: https://portal.1inch.dev/documentation/apis/swap/classic-swap/swap
   */
  async getSwapData(params: SwapParams): Promise<SwapData> {
    try {
      const {
        fromToken,
        toToken,
        amount,
        fromAddress,
        slippage = 1,
        chainId = this.defaultChainId,
        protocols,
        gasPrice,
        includeTokensInfo = true,
        includeProtocols = true,
        includeGas = true
      } = params;
      
      const swapParams: Record<string, any> = {
        src: fromToken,
        dst: toToken,
        amount: amount,
        from: fromAddress,
        slippage: slippage,
        includeTokensInfo: includeTokensInfo,
        includeProtocols: includeProtocols,
        includeGas: includeGas
      };

      // Add optional parameters
      if (protocols) swapParams.protocols = protocols;
      if (gasPrice) swapParams.gasPrice = gasPrice;

      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.SWAP}/swap`,
        chainId,
        swapParams
      );

      return {
        fromToken: {
          symbol: result.fromToken.symbol,
          name: result.fromToken.name,
          address: result.fromToken.address,
          decimals: result.fromToken.decimals,
          logoURI: result.fromToken.logoURI,
        },
        toToken: {
          symbol: result.toToken.symbol,
          name: result.toToken.name,
          address: result.toToken.address,
          decimals: result.toToken.decimals,
          logoURI: result.toToken.logoURI,
        },
        toAmount: result.toAmount,
        fromAmount: result.fromAmount,
        tx: {
          from: result.tx.from,
          to: result.tx.to,
          data: result.tx.data,
          value: result.tx.value,
          gasPrice: result.tx.gasPrice,
          gas: result.tx.gas,
        },
        protocols: result.protocols || [],
      };
    } catch (error) {
      console.error('Failed to get swap data from 1inch:', error);
      throw error;
    }
  }

  /**
   * Check token balance for a given address
   */
  async checkTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      // For ETH balance (0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee)
      if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        // This would require an RPC call to get ETH balance
        // For demo purposes, return a mock balance
        return '1000000000000000000'; // 1 ETH in wei
      }
      
      // For ERC20 tokens, this would require calling the balanceOf function
      // For demo purposes, return mock balances
      const token = Object.values(TOKENS).find(t => t.address === tokenAddress);
      
      if (!token) {
        return "0";
      }

      // Mock balances for demo
      const mockBalances: Record<string, string> = {
        ETH: "1000000000000000000", // 1 ETH
        USDC: "500000000", // 500 USDC (6 decimals)
        USDT: "200000000", // 200 USDT (6 decimals)
      };

      return mockBalances[token.symbol] || "0";
    } catch (error) {
      console.error('Failed to check token balance:', error);
      return "0";
    }
  }

  /**
   * Get supported tokens for a chain
   */
  async getTokens(chainId: number = this.defaultChainId): Promise<any[]> {
    try {
      // This would typically call the tokens endpoint
      // For now, we'll use our static tokens
      return Object.values(TOKENS);
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return Object.values(TOKENS);
    }
  }

  /**
   * Get token price using 1inch Price Feed API
   */
  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      const priceParams = {
        fromTokenAddress: tokenAddress,
        toTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH
        amount: '1000000' // 1 token with 6 decimals
      };

      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/price`,
        this.defaultChainId,
        priceParams
      );

      return parseFloat(result.toAmount) / Math.pow(10, 18); // Convert from wei to ETH
    } catch (error) {
      console.error('Failed to get token price from 1inch:', error);
      
      // Fallback to mock prices
      const token = Object.values(TOKENS).find(t => t.address === tokenAddress);
      const mockPrices: Record<string, number> = {
        ETH: 2500,
        USDC: 1,
        USDT: 1,
      };

      return mockPrices[token?.symbol || ''] || 0;
    }
  }

  /**
   * Get wallet balances using 1inch Wallet Balances API
   */
  async getWalletBalances(walletAddress: string): Promise<Record<string, string>> {
    try {
      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/wallet/balances`,
        this.defaultChainId,
        { address: walletAddress }
      );

      return result.balances || {};
    } catch (error) {
      console.error('Failed to get wallet balances from 1inch:', error);
      return {};
    }
  }

  /**
   * Get token metadata using 1inch API
   */
  async getTokenMetadata(tokenAddress: string): Promise<any> {
    try {
      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/tokens/${tokenAddress}`,
        this.defaultChainId,
        {}
      );

      return result;
    } catch (error) {
      console.error('Failed to get token metadata from 1inch:', error);
      return null;
    }
  }

  /**
   * Get supported tokens using 1inch Tokens API
   */
  async getSupportedTokens(): Promise<Record<string, any>> {
    try {
      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/tokens`,
        this.defaultChainId,
        {}
      );

      return result.tokens || {};
    } catch (error) {
      console.error('Failed to get supported tokens from 1inch:', error);
      return {};
    }
  }

  /**
   * Get protocols information using 1inch API
   */
  async getProtocols(): Promise<any> {
    try {
      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/protocols`,
        this.defaultChainId,
        {}
      );

      return result.protocols || {};
    } catch (error) {
      console.error('Failed to get protocols from 1inch:', error);
      return {};
    }
  }

  /**
   * Get health check from 1inch API
   */
  async getHealthCheck(): Promise<boolean> {
    try {
      const result = await this.makeRequest(
        `${ONE_INCH_ENDPOINTS.QUOTE}/healthcheck`,
        this.defaultChainId,
        {}
      );

      return result.status === 'OK';
    } catch (error) {
      console.error('Failed to get health check from 1inch:', error);
      return false;
    }
  }

  /**
   * Format token amount from wei to human readable
   */
  formatTokenAmount(amount: string, decimals: number): string {
    try {
      const num = parseFloat(amount) / Math.pow(10, decimals);
      return num.toFixed(6);
    } catch (error) {
      console.error('Failed to format token amount:', error);
      return '0';
    }
  }

  /**
   * Parse token amount from human readable to wei
   */
  parseTokenAmount(amount: string, decimals: number): string {
    try {
      const num = parseFloat(amount) * Math.pow(10, decimals);
      return Math.floor(num).toString();
    } catch (error) {
      console.error('Failed to parse token amount:', error);
      return '0';
    }
  }

  /**
   * Set default chain ID
   */
  setDefaultChainId(chainId: number): void {
    this.defaultChainId = chainId;
  }

  /**
   * Get default chain ID
   */
  getDefaultChainId(): number {
    return this.defaultChainId;
  }
}

export const oneInchService = new OneInchService();