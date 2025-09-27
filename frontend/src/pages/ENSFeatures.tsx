import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { ensService, ENSProfile, SwapRecord } from "@/services/ensService";
import { 
  Globe, 
  Zap, 
  Star, 
  Plus, 
  CheckCircle, 
  Clock,
  Hash,
  Sparkles
} from "lucide-react";

const ENSFeatures = () => {
  const [ensProfile, setEnsProfile] = useState<ENSProfile | null>(null);
  const [userSwaps, setUserSwaps] = useState<SwapRecord[]>([]);
  const [newSubname, setNewSubname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSwap, setIsCreatingSwap] = useState(false);
  
  const { toast } = useToast();
  const { isConnected, account, identity } = useWeb3();

  useEffect(() => {
    if (isConnected && account) {
      loadENSData();
    }
  }, [isConnected, account]);

  const loadENSData = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      // Mock data for demo - in real implementation, these would call the contracts
      const mockProfile: ENSProfile = {
        primaryName: identity?.ensName || "demo.eth",
        subnames: [
          "swap-abc123.enswap.eth",
          "swap-def456.enswap.eth",
          "reputation-alice.enswap.eth"
        ],
        reputationScore: 150,
        totalSwaps: 5,
        isVerified: true,
      };

      const mockSwaps: SwapRecord[] = [
        {
          swapHash: "0xabc123...",
          ensName: "demo.eth",
          amount: "1.0",
          tokenPair: "ETH-USDC",
          timestamp: Date.now() - 86400000,
          completed: true,
        },
        {
          swapHash: "0xdef456...",
          ensName: "demo.eth",
          amount: "0.5",
          tokenPair: "USDC-ETH",
          timestamp: Date.now() - 172800000,
          completed: true,
        }
      ];

      setEnsProfile(mockProfile);
      setUserSwaps(mockSwaps);
    } catch (error) {
      console.error('Failed to load ENS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSwapENS = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingSwap(true);
    try {
      // Mock swap creation - in real implementation, this would call the contract
      const swapHash = `0x${Math.random().toString(16).slice(2, 10)}...`;
      const newSwap: SwapRecord = {
        swapHash,
        ensName: identity?.ensName || "demo.eth",
        amount: "1.0",
        tokenPair: "ETH-USDC",
        timestamp: Date.now(),
        completed: false,
      };

      setUserSwaps(prev => [newSwap, ...prev]);
      
      toast({
        title: "Swap ENS Name Created",
        description: `Created unique ENS subname: swap-${swapHash.slice(2, 10)}.enswap.eth`,
      });
    } catch (error) {
      console.error('Failed to create swap ENS:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create swap ENS name",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSwap(false);
    }
  };

  const handleMintReputationSubname = async () => {
    if (!newSubname.trim()) {
      toast({
        title: "Invalid Subname",
        description: "Please enter a valid subname",
        variant: "destructive",
      });
      return;
    }

    if (!ensProfile || ensProfile.reputationScore < 100) {
      toast({
        title: "Insufficient Reputation",
        description: "You need at least 100 reputation points to mint subnames",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock subname minting
      const fullSubname = `${newSubname}.enswap.eth`;
      setEnsProfile(prev => prev ? {
        ...prev,
        subnames: [...prev.subnames, fullSubname]
      } : null);
      
      setNewSubname("");
      
      toast({
        title: "Subname Minted",
        description: `Successfully minted: ${fullSubname}`,
      });
    } catch (error) {
      console.error('Failed to mint subname:', error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint reputation subname",
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
            <Globe className="w-12 h-12 text-primary animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ENS Integration Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the power of ENS with transaction-specific names, reputation-based subnames, and creative identity management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ENS Profile */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                ENS Profile
              </CardTitle>
              <CardDescription>Your decentralized identity and reputation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ensProfile ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Primary Name</span>
                    <Badge variant="outline" className="text-primary">
                      {ensProfile.primaryName}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reputation Score</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{ensProfile.reputationScore}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Swaps</span>
                    <span className="font-medium">{ensProfile.totalSwaps}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={ensProfile.isVerified ? "default" : "secondary"}>
                      {ensProfile.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>

                  {/* Subnames */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Subnames ({ensProfile.subnames.length})</span>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {ensProfile.subnames.map((subname, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <Hash className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-mono">{subname}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {isConnected ? "Loading ENS profile..." : "Connect wallet to view ENS profile"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ENS Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                ENS Actions
              </CardTitle>
              <CardDescription>Create and manage your ENS identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create Swap ENS */}
              <div className="space-y-3">
                <h4 className="font-medium">Create Swap ENS Name</h4>
                <p className="text-sm text-muted-foreground">
                  Generate a unique ENS subname for your next swap transaction
                </p>
                <Button 
                  onClick={handleCreateSwapENS}
                  disabled={!isConnected || isCreatingSwap}
                  className="w-full"
                >
                  {isCreatingSwap ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Create Swap ENS Name
                    </>
                  )}
                </Button>
              </div>

              {/* Mint Reputation Subname */}
              <div className="space-y-3">
                <h4 className="font-medium">Mint Reputation Subname</h4>
                <p className="text-sm text-muted-foreground">
                  Create a custom subname based on your reputation (requires 100+ reputation)
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter subname"
                    value={newSubname}
                    onChange={(e) => setNewSubname(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleMintReputationSubname}
                    disabled={!isConnected || !newSubname.trim() || (ensProfile && ensProfile.reputationScore < 100)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {ensProfile && ensProfile.reputationScore < 100 && (
                  <p className="text-xs text-orange-600">
                    Need {100 - ensProfile.reputationScore} more reputation points
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Swap History */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-xl mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              ENS Swap History
            </CardTitle>
            <CardDescription>Your transaction history with ENS names</CardDescription>
          </CardHeader>
          <CardContent>
            {userSwaps.length > 0 ? (
              <div className="space-y-4">
                {userSwaps.map((swap, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/30 border border-white/20 rounded-lg hover-lift"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {swap.amount} {swap.tokenPair}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {swap.ensName} • {new Date(swap.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={swap.completed ? "default" : "secondary"}>
                        {swap.completed ? "Completed" : "Pending"}
                      </Badge>
                      {swap.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No ENS swaps yet. Create your first swap to see it here!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ENSFeatures;
