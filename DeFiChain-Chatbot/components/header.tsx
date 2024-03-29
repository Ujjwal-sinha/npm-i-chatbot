'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@lib/utils'
import { Button, buttonVariants } from '@components/ui/button'
import { Sidebar } from '@components/sidebar'
// import { SidebarList } from '@components/sidebar-list'
import { SidebarFooter } from '@components/sidebar-footer'
import { ThemeToggle } from '@components/theme-toggle'
import { IconSeparator } from '@/components/ui/icons'

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Sidebar>
          <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
            {/* @ts-ignore */}
            {/* <SidebarList userId={session?.user?.id} /> */}
          </React.Suspense>
          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <div className="flex items-center">
          {/* <IconSeparator className="w-6 h-6 text-muted-foreground/50" /> */}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <ConnectButton/>
      </div>
    </header>
  )
}
