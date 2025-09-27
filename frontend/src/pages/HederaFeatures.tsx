import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { hederaService, HederaUserProfile } from "@/services/hederaService";
import { 
  Zap, 
  Coins, 
  Star, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Globe
} from "lucide-react";

const HederaFeatures = () => {
  const [hederaProfile, setHederaProfile] = useState<HederaUserProfile | null>(null);
  const [hbarAmount, setHbarAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingSwap, setIsExecutingSwap] = useState(false);
  
  const { toast } = useToast();
  const { isConnected, account, identity } = useWeb3();

  const hederaTokens = [
    { address: "0x0000000000000000000000000000000000167B", symbol: "HBAR", name: "Hedera" },
    { address: "0x1234567890123456789012345678901234567890", symbol: "HTS1", name: "Hedera Token 1" },
    { address: "0x2345678901234567890123456789012345678901", symbol: "HTS2", name: "Hedera Token 2" },
  ];

  useEffect(() => {
    if (isConnected && account) {
      loadHederaData();
    }
  }, [isConnected, account]);

  const loadHederaData = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      // Mock data for demo - in real implementation, this would call the contracts
      const mockProfile: HederaUserProfile = {
        ensName: identity?.ensName || "demo.eth",
        hbarBalance: "1250.750",
        reputationScore: 175,
        associatedTokens: [
          "0x1234567890123456789012345678901234567890",
          "0x2345678901234567890123456789012345678901"
        ],
        totalHederaSwaps: 8,
        isHederaVerified: true,
      };

      setHederaProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load Hedera data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHBARSwap = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!hbarAmount || parseFloat(hbarAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid HBAR amount",
        variant: "destructive",
      });
      return;
    }

    if (!selectedToken) {
      toast({
        title: "Token Required",
        description: "Please select a token to receive",
        variant: "destructive",
      });
      return;
    }

    setIsExecutingSwap(true);
    try {
      // Mock HBAR swap - in real implementation, this would call the contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update profile with new balance and reputation
      const tokenData = hederaTokens.find(t => t.address === selectedToken);
      const reputationGain = hederaService.getHBARSwapBonus();
      
      setHederaProfile(prev => prev ? {
        ...prev,
        hbarBalance: (parseFloat(prev.hbarBalance) - parseFloat(hbarAmount)).toFixed(3),
        reputationScore: prev.reputationScore + reputationGain,
        totalHederaSwaps: prev.totalHederaSwaps + 1,
      } : null);
      
      toast({
        title: "HBAR Swap Successful",
        description: `Swapped ${hbarAmount} HBAR for ${tokenData?.symbol || 'tokens'}`,
      });
      
      setHbarAmount("");
      setSelectedToken("");
    } catch (error) {
      console.error('Failed to execute HBAR swap:', error);
      toast({
        title: "Swap Failed",
        description: "Failed to execute HBAR swap",
        variant: "destructive",
      });
    } finally {
      setIsExecutingSwap(false);
    }
  };

  const handleAssociateToken = async (tokenId: string) => {
    try {
      // Mock token association
      setHederaProfile(prev => prev ? {
        ...prev,
        associatedTokens: [...prev.associatedTokens, tokenId]
      } : null);
      
      const tokenData = hederaTokens.find(t => t.address === tokenId);
      toast({
        title: "Token Associated",
        description: `Successfully associated ${tokenData?.symbol || 'token'}`,
      });
    } catch (error) {
      console.error('Failed to associate token:', error);
      toast({
        title: "Association Failed",
        description: "Failed to associate HTS token",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-12 h-12 text-primary animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Hedera Integration Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of Hedera with HTS tokens, native HBAR swapping, and enhanced reputation systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hedera Profile */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Hedera Profile
              </CardTitle>
              <CardDescription>Your Hedera network identity and statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hederaProfile ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ENS Name</span>
                    <Badge variant="outline" className="text-primary">
                      {hederaProfile.ensName}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HBAR Balance</span>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{hederaProfile.hbarBalance} HBAR</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hedera Reputation</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{hederaProfile.reputationScore}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Hedera Swaps</span>
                    <span className="font-medium">{hederaProfile.totalHederaSwaps}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={hederaProfile.isHederaVerified ? "default" : "secondary"}>
                      {hederaProfile.isHederaVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>

                  {/* Associated Tokens */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Associated HTS Tokens ({hederaProfile.associatedTokens.length})</span>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {hederaProfile.associatedTokens.map((tokenId, index) => {
                        const tokenData = hederaTokens.find(t => t.address === tokenId);
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <Shield className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-mono">{tokenData?.symbol || tokenId.slice(0, 8)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {isConnected ? "Loading Hedera profile..." : "Connect wallet to view Hedera profile"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* HBAR Swap */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                HBAR Swap
              </CardTitle>
              <CardDescription>Swap HBAR for HTS tokens with reputation bonuses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">HBAR Amount</label>
                <Input
                  type="number"
                  placeholder="Enter HBAR amount"
                  value={hbarAmount}
                  onChange={(e) => setHbarAmount(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Receive Token</label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token to receive" />
                  </SelectTrigger>
                  <SelectContent>
                    {hederaTokens.filter(token => token.symbol !== "HBAR").map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.symbol} - {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleHBARSwap}
                disabled={!isConnected || isExecutingSwap || !hbarAmount || !selectedToken}
                className="w-full"
              >
                {isExecutingSwap ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Executing Swap...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Execute HBAR Swap
                  </>
                )}
              </Button>

              {/* Reputation Bonus Info */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Hedera Bonus</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  +{hederaService.getHBARSwapBonus()} reputation points for HBAR swaps
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HTS Token Management */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              HTS Token Management
            </CardTitle>
            <CardDescription>Associate and manage Hedera Token Service tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hederaTokens.filter(token => token.symbol !== "HBAR").map((token) => {
                const isAssociated = hederaProfile?.associatedTokens.includes(token.address);
                return (
                  <div 
                    key={token.address}
                    className="flex items-center justify-between p-4 bg-white/30 border border-white/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAssociated ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Associated
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleAssociateToken(token.address)}
                          disabled={!isConnected}
                        >
                          Associate
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Network Information */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Hedera Network Information
            </CardTitle>
            <CardDescription>Network details and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Network", value: "Hedera Testnet" },
                { label: "Chain ID", value: "296" },
                { label: "Native Currency", value: "HBAR" },
                { label: "Block Explorer", value: "Hashscan" },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                  <div className="font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HederaFeatures;
