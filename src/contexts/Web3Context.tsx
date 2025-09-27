import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { web3Service, UserIdentity, Receipt } from '@/services/web3Service';
import { useToast } from '@/hooks/use-toast';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  account: string | null;
  balance: string;
  
  // Identity state
  identity: UserIdentity | null;
  reputationScore: number;
  
  // Receipts
  receipts: Receipt[];
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createIdentity: (ensName: string, did: string) => Promise<void>;
  refreshIdentity: () => Promise<void>;
  refreshReceipts: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  isCreatingIdentity: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [reputationScore, setReputationScore] = useState(0);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(false);
  
  const { toast } = useToast();

  // Initialize connection state
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
      }
    };

    initWeb3();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    // Listen for chain changes
    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const address = await web3Service.connectWallet();
      setAccount(address);
      setIsConnected(true);
      
      // Load user data
      await Promise.all([
        refreshIdentity(),
        refreshReceipts(),
        refreshBalance(),
      ]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    web3Service.disconnect();
    setIsConnected(false);
    setAccount(null);
    setBalance('0');
    setIdentity(null);
    setReputationScore(0);
    setReceipts([]);
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet",
    });
  };

  const createIdentity = async (ensName: string, did: string) => {
    try {
      setIsCreatingIdentity(true);
      await web3Service.createIdentity(ensName, did);
      await refreshIdentity();
      
      toast({
        title: "Identity Created",
        description: "Your Web3 identity has been successfully registered",
      });
    } catch (error: any) {
      console.error('Failed to create identity:', error);
      toast({
        title: "Identity Creation Failed",
        description: error.message || "Failed to create identity",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreatingIdentity(false);
    }
  };

  const refreshIdentity = async () => {
    if (!isConnected || !account) return;
    
    try {
      const [identityData, score] = await Promise.all([
        web3Service.getIdentity(),
        web3Service.getReputationScore(),
      ]);
      
      setIdentity(identityData);
      setReputationScore(score);
    } catch (error) {
      console.error('Failed to refresh identity:', error);
    }
  };

  const refreshReceipts = async () => {
    if (!isConnected || !account) return;
    
    try {
      const receiptsData = await web3Service.getReceipts();
      setReceipts(receiptsData);
    } catch (error) {
      console.error('Failed to refresh receipts:', error);
    }
  };

  const refreshBalance = async () => {
    if (!isConnected || !account) return;
    
    try {
      const balanceData = await web3Service.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const value: Web3ContextType = {
    isConnected,
    account,
    balance,
    identity,
    reputationScore,
    receipts,
    connectWallet,
    disconnectWallet,
    createIdentity,
    refreshIdentity,
    refreshReceipts,
    refreshBalance,
    isLoading,
    isCreatingIdentity,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
