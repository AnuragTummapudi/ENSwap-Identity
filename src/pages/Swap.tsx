import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { oneInchService, SwapQuote } from "@/services/oneInchService";
import { web3Service } from "@/services/web3Service";
import { TOKENS } from "@/config/constants";
import { ArrowLeftRight, ArrowUpDown, Zap, Clock, CheckCircle, Shield, Loader2 } from "lucide-react";

interface SwapHistoryItem {
  id: string;
  from: string;
  to: string;
  amount: string;
  toAmount?: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  identityVerified: boolean;
  txHash?: string;
}

const Swap = () => {
  const [tokenFrom, setTokenFrom] = useState("");
  const [tokenTo, setTokenTo] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapHistory, setSwapHistory] = useState<SwapHistoryItem[]>([]);
  
  const { toast } = useToast();
  const { isConnected, account, identity, receipts, refreshReceipts } = useWeb3();

  // Load receipts as swap history on component mount
  useEffect(() => {
    if (receipts.length > 0) {
      const historyItems: SwapHistoryItem[] = receipts.map((receipt, index) => ({
        id: receipt.receiptHash,
        from: "Token",
        to: "Token",
        amount: "1",
        timestamp: new Date(receipt.timestamp * 1000),
        status: "completed" as const,
        identityVerified: true,
        txHash: receipt.receiptHash,
      }));
      setSwapHistory(historyItems);
    }
  }, [receipts]);

  // Get quote when amount or tokens change
  useEffect(() => {
    const getQuote = async () => {
      if (!tokenFrom || !tokenTo || !amount || !account || parseFloat(amount) <= 0) {
        setQuote(null);
        return;
      }

      try {
        setIsGettingQuote(true);
        const fromToken = Object.values(TOKENS).find(t => t.symbol === tokenFrom);
        const toToken = Object.values(TOKENS).find(t => t.symbol === tokenTo);
        
        if (!fromToken || !toToken) return;

        const quoteData = await oneInchService.getQuote({
          fromToken: fromToken.address,
          toToken: toToken.address,
          amount: oneInchService.parseTokenAmount(amount, fromToken.decimals),
          fromAddress: account,
          slippage: 1, // 1% slippage
        });

        setQuote(quoteData);
      } catch (error) {
        console.error('Failed to get quote:', error);
        setQuote(null);
      } finally {
        setIsGettingQuote(false);
      }
    };

    getQuote();
  }, [tokenFrom, tokenTo, amount, account]);

  const handleSwap = async () => {
    if (!tokenFrom || !tokenTo || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select tokens and enter an amount",
        variant: "destructive",
      });
      return;
    }

    if (tokenFrom === tokenTo) {
      toast({
        title: "Invalid Swap",
        description: "Cannot swap the same token",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!identity) {
      toast({
        title: "Identity Required",
        description: "Please create an identity first to perform swaps",
        variant: "destructive",
      });
      return;
    }

    if (!quote) {
      toast({
        title: "Quote Required",
        description: "Please wait for the quote to load",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSwapping(true);
      
      // Create a pending swap entry
      const newSwap: SwapHistoryItem = {
        id: Date.now().toString(),
        from: tokenFrom,
        to: tokenTo,
        amount,
        toAmount: oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals),
        timestamp: new Date(),
        status: "pending",
        identityVerified: true,
      };

      setSwapHistory(prev => [newSwap, ...prev]);

      toast({
        title: "Swap Initiated",
        description: "Your token swap is being processed",
      });

      // In a real implementation, you would execute the swap transaction here
      // For now, we'll simulate the swap and log it to the smart contract
      setTimeout(async () => {
        try {
          // Log the swap receipt to the smart contract
          const swapDetails = `Swapped ${amount} ${tokenFrom} for ${oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} ${tokenTo}`;
          await web3Service.logReceipt(
            account!,
            identity.ensName,
            swapDetails,
            Math.floor(Date.now() / 1000)
          );

          // Update swap status
          setSwapHistory(prev => 
            prev.map(swap => 
              swap.id === newSwap.id 
                ? { ...swap, status: "completed" as const }
                : swap
            )
          );

          // Refresh receipts
          await refreshReceipts();
          
          toast({
            title: "Swap Completed",
            description: swapDetails,
          });
        } catch (error) {
          console.error('Failed to complete swap:', error);
          setSwapHistory(prev => 
            prev.map(swap => 
              swap.id === newSwap.id 
                ? { ...swap, status: "failed" as const }
                : swap
            )
          );
          
          toast({
            title: "Swap Failed",
            description: "Failed to complete the swap transaction",
            variant: "destructive",
          });
        } finally {
          setIsSwapping(false);
          setAmount("");
          setQuote(null);
        }
      }, 3000);

    } catch (error) {
      console.error('Failed to initiate swap:', error);
      toast({
        title: "Swap Failed",
        description: "Failed to initiate the swap",
        variant: "destructive",
      });
      setIsSwapping(false);
    }
  };

  const handleFlipTokens = () => {
    const temp = tokenFrom;
    setTokenFrom(tokenTo);
    setTokenTo(temp);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/20 text-success border-success/30";
      case "pending": return "bg-warning/20 text-warning border-warning/30";
      case "failed": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <ArrowLeftRight className="w-12 h-12 text-primary animate-float" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Token Swap</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure, identity-verified token swaps across multiple networks
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="glass-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Swap Tokens
                  </CardTitle>
                  <CardDescription>
                    Exchange tokens with identity verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Token From */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-3">
                      <Select value={tokenFrom} onValueChange={setTokenFrom}>
                        <SelectTrigger className="input-glass flex-1">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(TOKENS).map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{token.symbol}</span>
                                <span className="text-sm text-muted-foreground">
                                  {token.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-glass flex-1"
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Flip Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFlipTokens}
                      className="rounded-full bg-white/50 hover:bg-white/70 transition-smooth hover:rotate-180"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Token To */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Select value={tokenTo} onValueChange={setTokenTo}>
                      <SelectTrigger className="input-glass">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TOKENS).map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{token.symbol}</span>
                              <span className="text-sm text-muted-foreground">
                                {token.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quote Display */}
                  {quote && !isGettingQuote && (
                    <div className="p-4 bg-white/30 border border-white/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Estimated Output</span>
                        <span className="text-lg font-bold text-primary">
                          {oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} {quote.toToken.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Gas: {quote.estimatedGas} | Rate: 1 {quote.fromToken.symbol} = {oneInchService.formatTokenAmount(quote.toAmount, quote.toToken.decimals)} {quote.toToken.symbol}
                      </div>
                    </div>
                  )}

                  {isGettingQuote && (
                    <div className="flex items-center justify-center p-4 bg-white/30 border border-white/20 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span className="text-sm">Getting quote...</span>
                    </div>
                  )}

                  {/* Identity Verification Status */}
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    identity 
                      ? "bg-success/10 border border-success/20" 
                      : "bg-warning/10 border border-warning/20"
                  }`}>
                    <Shield className={`w-5 h-5 ${identity ? "text-success" : "text-warning"}`} />
                    <span className={`font-medium ${identity ? "text-success" : "text-warning"}`}>
                      {identity ? "Identity Verified" : "Identity Required"}
                    </span>
                    <Badge variant="secondary" className={`ml-auto ${
                      identity 
                        ? "bg-success/20 text-success" 
                        : "bg-warning/20 text-warning"
                    }`}>
                      {identity ? "Active" : "Not Found"}
                    </Badge>
                  </div>

                  {/* Swap Button */}
                  <Button 
                    onClick={handleSwap}
                    className="w-full btn-primary hover:animate-glow-pulse"
                    size="lg"
                    disabled={!tokenFrom || !tokenTo || !amount || !isConnected || !identity || !quote || isSwapping}
                  >
                    {isSwapping ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Swapping...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="w-5 h-5 mr-2" />
                        Swap Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Swap History */}
            <div className="lg:col-span-1">
              <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Swaps</CardTitle>
                  <CardDescription>
                    Your identity-verified swap history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {swapHistory.length > 0 ? (
                    swapHistory.map((swap) => (
                      <div 
                        key={swap.id} 
                        className="p-3 bg-white/30 border border-white/20 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {swap.amount} {swap.from} → {swap.to}
                          </div>
                          <Badge className={`text-xs ${getStatusColor(swap.status)}`}>
                            {getStatusIcon(swap.status)}
                            <span className="ml-1 capitalize">{swap.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{swap.timestamp.toLocaleTimeString()}</span>
                          {swap.identityVerified && (
                            <div className="flex items-center gap-1 text-success">
                              <Shield className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No swaps yet. Make your first swap to see history.
                      </p>
                    </div>
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
                  className="glass-card p-4 rounded-xl text-center hover-lift"
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
    </div>
  );
};

export default Swap;