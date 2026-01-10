"use client"

import { ThemeToggle } from "@/components/theme/ThemeToggle"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/polaroid.png"
              alt="FlipShot"
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
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
