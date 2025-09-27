import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

const config = getDefaultConfig({
  appName: 'ENSwap Identity',
  projectId: 'aea25227957bdbe6ba50b99b18e6a69c',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: false,
});

const queryClient = new QueryClient();

interface RainbowKitConfigProps {
  children: ReactNode;
}

export const RainbowKitConfig = ({ children }: RainbowKitConfigProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
