import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Shield, Activity, Eye, EyeOff, Copy, ExternalLink, Globe, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { oneInchService } from "@/services/oneInchService";
import { TOKENS } from "@/config/constants";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  network: string;
}

interface ActivityItem {
  id: string;
  type: "swap" | "identity" | "transfer";
  description: string;
  amount?: string;
  timestamp: Date;
  status: "completed" | "pending";
}

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState("$0.00");
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  const { toast } = useToast();
  const { 
    isConnected, 
    account, 
    balance, 
    identity, 
    receipts, 
    reputationScore,
    refreshBalance,
    refreshReceipts 
  } = useWeb3();

  // Load token balances and prices
  useEffect(() => {
    const loadTokenBalances = async () => {
      if (!account) {
        setTokenBalances([]);
        setTotalBalance("$0.00");
        return;
      }

      try {
        const balances: TokenBalance[] = [];
        let totalValue = 0;

        // For now, show a simple ETH balance since we're on Hedera Testnet
        // In a real implementation, you would fetch actual HBAR balance
        try {
          const ethBalance = parseFloat(balance || "0");
          const ethPrice = 2500; // Mock ETH price
          const ethValue = ethBalance * ethPrice;
          totalValue += ethValue;

          if (ethBalance > 0) {
            balances.push({
              symbol: "HBAR",
              name: "Hedera Hashgraph",
              balance: ethBalance.toFixed(6),
              value: `$${ethValue.toFixed(2)}`,
              change: "0.0%",
              network: "hedera"
            });
          }
        } catch (error) {
          console.error('Failed to load HBAR balance:', error);
        }

        setTokenBalances(balances);
        setTotalBalance(`$${totalValue.toFixed(2)}`);
      } catch (error) {
        console.error('Failed to load token balances:', error);
        setTokenBalances([]);
        setTotalBalance("$0.00");
      }
    };

    loadTokenBalances();
  }, [account, balance]);

  // Convert receipts to activity items
  useEffect(() => {
    if (receipts.length > 0) {
      const activities: ActivityItem[] = receipts.map((receipt, index) => ({
        id: receipt.receiptHash,
        type: "swap" as const,
        description: receipt.swapDetails,
        timestamp: new Date(receipt.timestamp * 1000),
        status: "completed" as const
      }));
      
      // Add identity creation activity if identity exists
      if (identity) {
        activities.unshift({
          id: "identity-creation",
          type: "identity",
          description: "Created ENS identity",
          timestamp: new Date(), // You might want to store this timestamp
          status: "completed"
        });
      }

      setRecentActivity(activities.slice(0, 5)); // Show only last 5 activities
    } else {
      setRecentActivity([]);
    }
  }, [receipts, identity]);

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "swap": return "🔄";
      case "identity": return "🛡️";
      case "transfer": return "💸";
      default: return "📝";
    }
  };

  const getChangeColor = (change: string) => {
    return change.startsWith("+") ? "text-success" : "text-destructive";
  };

  return (
    <div className="min-h-screen bg-black text-white grid-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-futuristic text-white-glow">
                Dashboard
              </h1>
              <p className="text-lg text-white/70 font-mono-space">
                Your Web3 portfolio overview
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="btn-secondary"
              >
                {balanceVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {balanceVisible ? "Hide" : "Show"}
              </Button>
            </div>
          </div>

          {/* Wallet Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl">
            <CardContent className="p-6">
              {isConnected && account ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                      <div className="text-3xl font-bold">
                        {balanceVisible ? totalBalance : "••••••"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ETH Balance: {balanceVisible ? `${parseFloat(balance).toFixed(4)} ETH` : "••••"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted/50 px-2 py-1 rounded">
                        {`${account.slice(0, 6)}...${account.slice(-4)}`}
                      </code>
                      <Button variant="ghost" size="icon" onClick={copyAddress}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Wallet Connected</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to view your portfolio and transaction history.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card terminal-border hover-lift animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                ENS Features
              </CardTitle>
              <CardDescription className="text-white/60 font-code">Creative ENS integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={identity ? "default" : "secondary"}>
                    {identity ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Transaction-specific ENS names, reputation-based subnames, and creative identity management
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.location.href = '/ens-features'}
                >
                  Explore ENS Features
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card terminal-border hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Hedera Integration
              </CardTitle>
              <CardDescription>Hedera network features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant="outline">Hedera Testnet</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  HTS tokens, native HBAR swapping, and enhanced reputation bonuses
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.location.href = '/hedera-features'}
                >
                  Explore Hedera Features
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card terminal-border hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                1inch Integration
              </CardTitle>
              <CardDescription>Advanced DEX aggregation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">APIs Used</span>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400/50">7 APIs</Badge>
                </div>
                <div className="text-sm text-white/70 font-mono-space">
                  Quote, Swap, Price Feed, Wallet Balances, Token Metadata, Protocols, Health Check
                </div>
                <Button 
                  size="sm" 
                  className="w-full btn-accent font-futuristic"
                  onClick={() => window.location.href = '/swap'}
                >
                  Try 1inch Swap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Token Balances */}
          <div className="lg:col-span-2">
            <Card className="glass-card terminal-border hover-lift animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Token Balances
                </CardTitle>
                <CardDescription>
                  Your token holdings across different networks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokenBalances.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      {isConnected ? "No token balances found" : "Connect your wallet to view balances"}
                    </p>
                    {!isConnected && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Your HBAR balance will appear here after connecting
                      </p>
                    )}
                  </div>
                ) : (
                  tokenBalances.map((token, index) => (
                    <div 
                      key={token.symbol}
                      className="flex items-center justify-between p-4 bg-white/30 border border-white/20 rounded-lg hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary text-sm">{token.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">
                          {balanceVisible ? token.balance : "••••"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {balanceVisible ? token.value : "••••"}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="secondary" className={`${getChangeColor(token.change)} bg-transparent border`}>
                          {balanceVisible ? token.change : "••••"}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{token.network}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Identity Status & Activity */}
          <div className="space-y-6">
            {/* Identity Status */}
            <Card className="glass-card terminal-border hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Identity Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {identity ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-sm font-medium">ENS Verified</span>
                      </div>
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">ENS Name</div>
                      <div className="font-medium text-primary">{identity.ensName}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">DID Identity</div>
                      <div className="text-xs font-mono bg-muted/50 p-2 rounded break-all">
                        {identity.did}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Reputation Score</div>
                      <div className="font-medium text-primary">{reputationScore}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      No identity registered yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create an identity to unlock full features.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-white/30 border border-white/20 rounded-lg"
                  >
                    <div className="text-xl mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={activity.status === "completed" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;   