"use client"

import { ThemeToggle } from "@/components/theme/ThemeToggle"
import Link from "next/link"
import { Zap } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            FlipShot
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
