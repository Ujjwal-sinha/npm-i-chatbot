'use client'

import { ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { EthereumProvider } from "./ethereum";

export function Provider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider {...props}>
      <TooltipProvider>
        <EthereumProvider>
            {children}
        </EthereumProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
