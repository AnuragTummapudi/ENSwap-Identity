import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/ui/feature-card";
import { Shield, Users, ArrowLeftRight, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "ENS Integration",
      description: "Connect your Ethereum Name Service domains with secure identity verification for seamless Web3 interactions.",
      gradient: "primary" as const,
    },
    {
      icon: Users,
      title: "DID Identity",
      description: "Decentralized Identity management that puts you in control of your digital identity across multiple blockchains.",
      gradient: "secondary" as const,
    },
    {
      icon: ArrowLeftRight,
      title: "Token Swaps",
      description: "Execute secure token swaps with identity verification on Hedera and other supported networks.",
      gradient: "accent" as const,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 hero-gradient overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary mr-3 animate-float" />
                <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  Next-Gen Web3 Identity
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Seamless Identity</span>
                <br />
                <span className="text-foreground">+ Token Swaps on</span>
                <br />
                <span className="text-primary">Hedera & Beyond</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Connect your ENS domains, manage decentralized identity, and execute secure token swaps 
                with the most elegant Web3 interface ever built.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/identity">
                  <Button 
                    size="lg" 
                    className="btn-primary text-lg px-8 py-4 rounded-xl group hover:animate-glow-pulse"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/swap">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="btn-secondary text-lg px-8 py-4 rounded-xl"
                  >
                    Explore Swaps
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern Web3 identity and token management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Web3 Experience?
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join the future of decentralized identity and seamless token swapping.
            </p>
            <Link to="/identity">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-12 py-4 rounded-xl hover:animate-glow-pulse"
              >
                Start Building Your Identity
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;