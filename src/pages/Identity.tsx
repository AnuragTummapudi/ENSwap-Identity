import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { Shield, Wallet, CheckCircle, User, Globe, Key } from "lucide-react";

const Identity = () => {
  const [ensName, setEnsName] = useState("");
  const [didIdentity, setDidIdentity] = useState("");
  const { toast } = useToast();
  const { 
    isConnected, 
    account, 
    identity, 
    connectWallet, 
    createIdentity, 
    isLoading, 
    isCreatingIdentity 
  } = useWeb3();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleCreateIdentity = async () => {
    if (!ensName || !didIdentity) {
      toast({
        title: "Missing Information",
        description: "Please fill in both ENS name and DID identity",
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

    try {
      await createIdentity(ensName, didIdentity);
      // Reset form after successful creation
      setEnsName("");
      setDidIdentity("");
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-primary animate-float" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Create Your Web3 Identity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Register your ENS domain and DID to unlock the full power of decentralized identity
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Identity Creation Form */}
            <Card className="glass-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Identity Registration
                </CardTitle>
                <CardDescription>
                  Enter your ENS name and decentralized identifier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    ENS Name
                  </label>
                  <Input
                    placeholder="yourname.eth"
                    value={ensName}
                    onChange={(e) => setEnsName(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    DID Identity
                  </label>
                  <Input
                    placeholder="did:example:123456789abcdefg"
                    value={didIdentity}
                    onChange={(e) => setDidIdentity(e.target.value)}
                    className="input-glass"
                  />
                </div>

                {!isConnected ? (
                  <Button 
                    onClick={handleConnectWallet} 
                    className="w-full btn-primary hover:animate-glow-pulse"
                    size="lg"
                    disabled={isLoading}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : identity ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Identity Already Created</span>
                    </div>
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm text-success">
                        You already have an identity registered. Check your profile on the right.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Wallet Connected</span>
                    </div>
                    <Button 
                      onClick={handleCreateIdentity} 
                      className="w-full btn-primary hover:animate-glow-pulse"
                      size="lg"
                      disabled={isCreatingIdentity}
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      {isCreatingIdentity ? "Creating..." : "Create Identity"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Profile Display */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Identity Profile
                </CardTitle>
                <CardDescription>
                  Your registered Web3 identity information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {identity ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="font-medium">Identity Verified</span>
                      </div>
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-white/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">ENS Name</div>
                        <div className="font-medium text-primary">{identity.ensName}</div>
                      </div>

                      <div className="p-3 bg-white/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">DID Identity</div>
                        <div className="font-mono text-sm break-all">{identity.did}</div>
                      </div>

                      <div className="p-3 bg-white/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Wallet Address</div>
                        <div className="font-mono text-sm break-all">{identity.wallet}</div>
                      </div>

                      <div className="p-3 bg-white/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Reputation Score</div>
                        <div className="font-medium text-primary">{identity.reputationScore}</div>
                      </div>
                    </div>
                  </div>
                ) : isConnected ? (
                  <div className="text-center py-8">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      No identity registered yet. Create your identity to get started.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Connect your wallet to view your identity profile.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              {
                icon: Shield,
                title: "Secure Verification",
                description: "Your identity is cryptographically secured on-chain"
              },
              {
                icon: Globe,
                title: "Cross-Chain Support",
                description: "Works across multiple blockchain networks"
              },
              {
                icon: Key,
                title: "Self-Sovereign",
                description: "You own and control your identity data"
              }
            ].map((feature, index) => (
              <div key={feature.title} className="glass-card p-6 rounded-xl text-center">
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;