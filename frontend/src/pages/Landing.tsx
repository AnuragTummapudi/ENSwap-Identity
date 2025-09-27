import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Globe, 
  Shield, 
  ArrowRight, 
  Star,
  Trophy,
  Target,
  Layers,
  Code,
  Users
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Globe,
      title: "ENS Integration",
      description: "Creative ENS subnames for transactions, reputation-based naming, and identity management",
      badge: "Innovation",
      color: "text-cyan-400"
    },
    {
      icon: Zap,
      title: "Hedera Integration", 
      description: "HTS tokens, native HBAR swapping, and cross-chain compatibility",
      badge: "Advanced",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "1inch Integration",
      description: "7 APIs: Swap, Quote, Price Feed, Balances, Metadata, Protocols, Health Check",
      badge: "Comprehensive",
      color: "text-blue-400"
    }
  ];

  const stats = [
    { label: "Technologies", value: "5+", icon: Layers },
    { label: "APIs Integrated", value: "7", icon: Code },
    { label: "Smart Contracts", value: "3", icon: Target },
    { label: "Networks", value: "2", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-black text-white grid-bg scanlines">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
              </div>
              
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-futuristic text-white-glow mb-4 animate-fade-in">
                ENSwap
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 bg-black/50 px-4 py-2 text-lg font-code">
                  Identity & DeFi
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400/50 bg-black/50 px-4 py-2 text-lg font-code">
                  Web3 Future
                </Badge>
              </div>
              <p className="text-xl md:text-2xl text-white/80 font-mono-space max-w-4xl mx-auto leading-relaxed animate-slide-up">
                The first decentralized identity platform combining ENS creativity, Hedera innovation, and 1inch efficiency for a revolutionary Web3 experience.
              </p>
            </div>

            {/* Innovation Badge */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-4">
                <Star className="w-6 h-6 text-cyan-400" />
                <span className="text-2xl font-futuristic text-cyan-400">Innovation</span>
                <span className="text-white/80 font-code">Web3 Future</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <Button 
                    size="lg" 
                className="btn-primary text-lg px-8 py-6 font-futuristic"
                onClick={() => navigate('/dashboard')}
                  >
                <Shield className="w-6 h-6 mr-2" />
                Launch ENSwap
                <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                size="lg" 
                    variant="outline" 
                className="btn-secondary text-lg px-8 py-6 font-futuristic border-white/30 hover:bg-white/10"
                onClick={() => navigate('/identity')}
                  >
                <Globe className="w-6 h-6 mr-2" />
                Create Identity
                  </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-futuristic text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60 font-code">{stat.label}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-futuristic text-white-glow mb-6">
            Advanced Web3 Features
          </h2>
          <p className="text-xl text-white/60 font-mono-space max-w-3xl mx-auto">
            Revolutionary integration of cutting-edge Web3 technologies for the future of decentralized identity and finance
          </p>
        </div>
          
        <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
            <Card key={index} className="glass-card terminal-border hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-black/50 rounded-lg flex items-center justify-center border border-white/20">
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="outline" className={`${feature.color} border-current/50 bg-black/50 font-futuristic`}>
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-2xl font-futuristic text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 font-mono-space leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>

      {/* Innovation Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-futuristic text-white-glow mb-6">
              Revolutionary Web3 Platform
            </h2>
            <p className="text-xl text-white/70 font-mono-space mb-8 leading-relaxed">
              ENSwap represents the future of decentralized identity and DeFi integration. 
              Built with cutting-edge Web3 technologies for a revolutionary user experience.
            </p>
            
            <div className="space-y-4">
              {[
                "Transaction-specific ENS subnames",
                "Hedera HTS token integration", 
                "1inch comprehensive API suite",
                "Reputation-based identity system",
                "Cross-chain compatibility"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full neon-glow"></div>
                  <span className="text-white/80 font-code">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                className="btn-accent text-lg px-8 py-4 font-futuristic"
                onClick={() => navigate('/swap')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Swap Now
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card terminal-border p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-code">Connected to Hedera Testnet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-code">ENS Identity Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-code">1inch APIs Ready</span>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="text-sm text-white/60 font-code mb-2">Contract Address:</div>
                  <div className="text-xs text-cyan-400 font-code break-all">
                    0xEe58d185f59e01034527d95FDd85236fa245Ea9f
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="glass-card terminal-border p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-futuristic text-white-glow mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/70 font-mono-space mb-8">
            Experience the next generation of Web3 with ENSwap's innovative identity and DeFi platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary text-lg px-8 py-4 font-futuristic"
              onClick={() => navigate('/dashboard')}
            >
              <Star className="w-5 h-5 mr-2" />
              Launch Application
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="btn-secondary text-lg px-8 py-4 font-futuristic border-white/30"
              onClick={() => window.open('https://github.com/AnuragTummapudi/ENSwap-Identity', '_blank')}
            >
              <Code className="w-5 h-5 mr-2" />
              View Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;