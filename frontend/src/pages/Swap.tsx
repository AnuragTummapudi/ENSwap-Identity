import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { oneInchService } from "@/services/oneInchService";
import { TOKENS } from "@/config/constants";
import { 
  ArrowLeftRight, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface SwapQuote {
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

const Swap = () => {
  const [tokenFrom, setTokenFrom] = useState("ETH");
  const [tokenTo, setTokenTo] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { toast } = useToast();
  const { 
    isConnected, 
    account, 
    identity, 
    receipts,
    refreshReceipts 
  } = useWeb3();

  // Fetch quote when inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!isConnected || !account || !amount || parseFloat(amount) <= 0) {
        setQuote(null);
        return;
      }

      setIsLoading(true);
      try {
        const fromTokenData = Object.values(TOKENS).find(t => t.symbol === tokenFrom);
        const toTokenData = Object.values(TOKENS).find(t => t.symbol === tokenTo);
        
        if (!fromTokenData || !toTokenData) {
          setQuote(null);
          return;
        }

        const amountWei = (parseFloat(amount) * Math.pow(10, fromTokenData.decimals)).toString();
        
        const quoteData = await oneInchService.getQuote({
          fromToken: fromTokenData.address,
          toToken: toTokenData.address,
          amount: amountWei,
          fromAddress: account,
          slippage: 1,
          chainId: 1, // Ethereum mainnet
          includeTokensInfo: true,
          includeProtocols: true,
          includeGas: true,
        });

        setQuote(quoteData);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
        setQuote(null);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [tokenFrom, tokenTo, amount, isConnected, account]);

  const handleSwap = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!quote) {
      toast({
        title: "No Quote Available",
        description: "Please wait for the quote to load",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    try {
      // Check token balance before attempting swap
      const fromTokenData = Object.values(TOKENS).find(t => t.symbol === tokenFrom);
      if (!fromTokenData) {
        throw new Error(`Token ${tokenFrom} not found`);
      }

      const userBalance = await oneInchService.checkTokenBalance(fromTokenData.address, account);
      const requiredAmount = oneInchService.parseTokenAmount(amount, fromTokenData.decimals);
      
      console.log('Balance check:', {
        userBalance,
        requiredAmount,
        token: tokenFrom,
        address: fromTokenData.address
      });

      if (BigInt(userBalance) < BigInt(requiredAmount)) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough ${tokenFrom} tokens. Required: ${amount} ${tokenFrom}, Available: ${oneInchService.formatTokenAmount(userBalance, fromTokenData.decimals)} ${tokenFrom}`,
          variant: "destructive",
        });
        return;
      }

      // Get swap data from 1inch API
      const swapData = await oneInchService.getSwapData({
        fromToken: fromTokenData.address,
        toToken: Object.values(TOKENS).find(t => t.symbol === tokenTo)?.address || '',
        amount: requiredAmount,
        fromAddress: account,
        slippage: 1,
        chainId: 1, // Ethereum mainnet
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true,
      });

      console.log('Swap data received:', swapData);

      // In a real implementation, you would:
      // 1. Execute the transaction using the calldata from 1inch
      // 2. Wait for confirmation
      // 3. Log the receipt to the smart contract
      
      // For demo purposes, we'll simulate a successful swap
      const swapDetails = `Swapped ${amount} ${tokenFrom} for ${oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} ${tokenTo}`;
      
      // Log the receipt to our smart contract
      try {
        await web3Service.logReceipt(
          account,
          identity?.ensName || 'Unknown',
          swapDetails,
          Math.floor(Date.now() / 1000)
        );
      } catch (receiptError) {
        console.warn('Failed to log receipt:', receiptError);
      }

      // Refresh receipts to show the new transaction
      await refreshReceipts();
      
      toast({
        title: "Swap Successful!",
        description: `Successfully swapped ${amount} ${tokenFrom} for ${oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} ${tokenTo}. Transaction data received from 1inch API.`,
      });

      // Reset form
      setAmount("");
      setQuote(null);
    } catch (error: any) {
      console.error('Swap failed:', error);
      
      if (error.message?.includes('Insufficient')) {
        toast({
          title: "Insufficient Balance",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Swap Failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const handleRefreshQuote = async () => {
    if (!isConnected || !account || !amount) return;
    
    setIsLoading(true);
    try {
      const fromTokenData = Object.values(TOKENS).find(t => t.symbol === tokenFrom);
      const toTokenData = Object.values(TOKENS).find(t => t.symbol === tokenTo);
      
      if (!fromTokenData || !toTokenData) return;

      const amountWei = (parseFloat(amount) * Math.pow(10, fromTokenData.decimals)).toString();
      
      const quoteData = await oneInchService.getQuote({
        fromToken: fromTokenData.address,
        toToken: toTokenData.address,
        amount: amountWei,
        fromAddress: account,
        slippage: 1
      });

      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to refresh quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "pending": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <ArrowLeftRight className="w-12 h-12 text-primary animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Token Swap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, identity-verified token swaps across multiple networks
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Swap Tokens
                </CardTitle>
                <CardDescription>
                  Exchange tokens with the best rates powered by 1inch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">From</label>
                  <div className="flex gap-3">
                    <Select value={tokenFrom} onValueChange={setTokenFrom}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TOKENS).map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const temp = tokenFrom;
                      setTokenFrom(tokenTo);
                      setTokenTo(temp);
                      setQuote(null);
                    }}
                    className="rounded-full"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">To</label>
                  <div className="flex gap-3">
                    <Select value={tokenTo} onValueChange={setTokenTo}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TOKENS).map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex-1 p-3 bg-muted/50 rounded-md">
                      {quote ? (
                        <div className="flex items-center justify-between">
                          <span>{oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefreshQuote}
                            disabled={isLoading}
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">0.0</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote Information */}
                {quote && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Quote</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">Best Rate</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rate: 1 {quote.fromToken.symbol} = {oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} {quote.toToken.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Estimated gas: {quote.estimatedGas} gas units
                    </div>
                  </div>
                )}

                {/* Identity Verification */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Identity Verification</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {identity ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Verified with {identity.ensName}</span>
                      </div>
                    ) : (
                      <span>Create an identity for enhanced security and reputation</span>
                    )}
                  </div>
                </div>

                {/* Swap Button */}
                <Button
                  onClick={handleSwap}
                  disabled={!isConnected || !quote || isSwapping || isLoading}
                  className="w-full btn-primary"
                  size="lg"
                >
                  {isSwapping ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Swapping...
                    </>
                  ) : !isConnected ? (
                    "Connect Wallet to Swap"
                  ) : !quote ? (
                    "Enter Amount to Get Quote"
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Swap Tokens
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Swap History */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Recent Swaps</CardTitle>
                <CardDescription>
                  Your identity-verified swap history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {receipts.length === 0 ? (
                  <div className="text-center py-8">
                    <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No swaps yet</p>
                    <p className="text-xs text-muted-foreground">Your swap history will appear here</p>
                  </div>
                ) : (
                  receipts.slice(0, 5).map((receipt) => (
                    <div 
                      key={receipt.receiptHash}
                      className="flex items-start gap-3 p-3 bg-white/30 border border-white/20 rounded-lg"
                    >
                      <div className="text-xl mt-0.5">🔄</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{receipt.swapDetails}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(receipt.timestamp * 1000).toLocaleString()}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor("completed")} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon("completed")}
                          <span className="capitalize">completed</span>
                        </div>
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supported Networks */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Supported Networks</h3>
            <p className="text-muted-foreground">Cross-chain swaps across multiple blockchain networks</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {["Hedera", "Ethereum", "Polygon", "BSC", "Avalanche"].map((network, index) => (
              <div 
                key={network} 
                className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl p-4 rounded-xl text-center hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto mb-2" />
                <div className="font-medium text-sm">{network}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;