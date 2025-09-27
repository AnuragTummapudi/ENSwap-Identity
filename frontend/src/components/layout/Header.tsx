import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown,
  Copy,
  ExternalLink,
  Wallet,
  Settings,
  LogOut
} from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [networkName, setNetworkName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isConnected, account, balance, identity, disconnectWallet } = useWeb3();
  const { toast } = useToast();

  // Get network information
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

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.000';
    if (num < 0.001) return '<0.001';
    return num.toFixed(3);
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Empty for now */}
        <div className="flex items-center space-x-4">
          {/* Can add breadcrumbs or page title here later */}
        </div>

        {/* Right side - Wallet Details */}
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {!connected && (
                      <Button onClick={openConnectModal} className="btn-primary font-futuristic">
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Network Badge */}
              {networkName && (
                <Badge variant="outline" className="bg-black/50 text-cyan-400 border-cyan-400/50 font-code">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse neon-glow" />
                  {networkName}
                </Badge>
              )}

              {/* Balance */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-black/50 rounded-lg border border-white/20">
                <span className="text-sm font-medium text-white font-code">
                  {formatBalance(balance)} {networkName.includes('Hedera') ? 'HBAR' : 'ETH'}
                </span>
              </div>

              {/* Wallet Address Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-black/50 border-white/20 hover:bg-white/10 terminal-border"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center neon-white">
                      <span className="text-black text-xs font-bold font-code">
                        {account ? account.slice(2, 4).toUpperCase() : '?'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white font-code">
                      {formatAddress(account || '')}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* Identity Info */}
                    {identity && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {identity.ensName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Identity Verified
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Account Details */}
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Account</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAddress}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {account}
                      </p>
                    </div>

                    {/* Balance Details */}
                    <div className="px-4 py-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Balance</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatBalance(balance)} ETH
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => {
                            if (account) {
                              const explorerUrl = networkName.includes('Sepolia') 
                                ? `https://sepolia.etherscan.io/address/${account}`
                                : `https://etherscan.io/address/${account}`;
                              window.open(explorerUrl, '_blank');
                            }
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Explorer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs text-red-600 hover:text-red-700"
                          onClick={() => {
                            disconnectWallet();
                            setIsDropdownOpen(false);
                          }}
                        >
                          <LogOut className="w-3 h-3 mr-1" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
