import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from "@/contexts/Web3Context";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isConnected, identity, reputationScore } = useWeb3();

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
      isCollapsed ? 'w-16' : 'w-64'
    } h-screen fixed left-0 top-0 z-50`}>
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

      {/* User Info */}
      {isConnected && !isCollapsed && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {identity ? identity.ensName : "Connected"}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Active
                </Badge>
                {reputationScore > 0 && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                    {reputationScore} pts
                  </Badge>
                )}
              </div>
            </div>
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
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Wallet Connection */}
      <div className="p-4 border-t border-slate-700">
        {isCollapsed ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-3">
            <ConnectButton />
            {isConnected && (
              <div className="text-xs text-slate-500 text-center">
                Secure • Decentralized • Trusted
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
