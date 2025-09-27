import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, ArrowLeftRight, BarChart3, Menu, X, User, Home } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isConnected, account, connectWallet, disconnectWallet } = useWeb3();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Identity", path: "/identity", icon: User },
    { name: "Swap", path: "/swap", icon: ArrowLeftRight },
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const ConnectWalletButton = () => {
    if (isConnected && account) {
      return (
        <Button 
          variant="outline" 
          className="btn-primary hover:animate-glow-pulse"
          onClick={disconnectWallet}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </Button>
      );
    }

    return (
      <Button 
        variant="outline" 
        className="btn-primary hover:animate-glow-pulse"
        onClick={connectWallet}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  };

  return (
    <nav className="glass-card border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-foreground font-cursive group-hover:animate-float" style={{ fontFamily: 'cursive' }}>
              ENSwap Identity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth hover:bg-white/10 ${
                  isActive(item.path) 
                    ? "text-primary bg-primary/10 border border-primary/20" 
                    : "text-foreground hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button - Desktop */}
          <div className="hidden md:block">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                    isActive(item.path) 
                      ? "text-primary bg-primary/10 border border-primary/20" 
                      : "text-foreground hover:text-primary hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-white/20">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;