"use client"

import { ThemeToggle } from "@/components/theme/ThemeToggle"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
          FlipShot
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
