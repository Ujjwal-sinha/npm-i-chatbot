'use client'

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  midnightTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const DeFiChain = {
  id: 1131,
  name: 'Metachain',
  network: 'Metachain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'DeFiChain',
    symbol: 'DFI',
  },
  rpcUrls: {
    public: { http: ['https://dmc.mydefichain.com/testnet'] },
    default: { http: ['https://dmc.mydefichain.com/testnet'] },
  }
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, DeFiChain],
  [publicProvider()]
);

const projectId = 'b03d8037151435cdd2e2d20096d46628';

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      phantomWallet({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function EthereumProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={demoAppInfo}
        modalSize='compact'
        theme={darkTheme({ borderRadius: 'small', fontStack: 'system' })}
        coolMode
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
