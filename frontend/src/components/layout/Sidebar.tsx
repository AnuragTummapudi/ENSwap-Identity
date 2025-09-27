import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  User, 
  ArrowLeftRight, 
  BarChart3, 
  Wallet,
  Settings,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from "@/contexts/Web3Context";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [networkName, setNetworkName] = useState<string>("");
  const location = useLocation();
  const { isConnected, identity, reputationScore } = useWeb3();

  useEffect(() => {
    const getNetworkName = async () => {
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          switch (chainId) {
            case '0x128': // Hedera Testnet (296)
              setNetworkName("Hedera Testnet");
              break;
            case '0xaa36a7': // Sepolia (11155111)
              setNetworkName("Sepolia Testnet");
              break;
            case '0x1': // Ethereum Mainnet
              setNetworkName("Ethereum Mainnet");
              break;
            default:
              setNetworkName("Unknown Network");
          }
        } catch (error) {
          console.error('Failed to get network:', error);
        }
      }
    };

    getNetworkName();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', getNetworkName);
      return () => {
        window.ethereum?.removeListener('chainChanged', getNetworkName);
      };
    }
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Identity", path: "/identity", icon: User },
    { name: "Swap", path: "/swap", icon: ArrowLeftRight },
    { name: "Activity", path: "/activity", icon: Activity },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-72'
    } h-screen fixed left-0 top-0 z-50 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-cursive">
                ENSwap
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Network Status */}
      {networkName && !isCollapsed && (
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-300">{networkName}</span>
          </div>
        </div>
      )}

      {/* Identity Status (Simplified) */}
      {isConnected && identity && !isCollapsed && (
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">
              {identity.ensName}
            </span>
            {reputationScore > 0 && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                {reputationScore}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center ${
                isCollapsed 
                  ? "justify-center px-2 py-3" 
                  : "space-x-3 px-3 py-2.5"
              } rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center leading-relaxed">
            Secure • Decentralized • Trusted
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
