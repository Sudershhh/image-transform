"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compare } from "@/components/ui/compare";
import { ArrowRight } from "lucide-react";
import { StatsCompact } from "@/components/landing/stats-compact";

export function HeroSection() {
  const beforeImage = "/beer.jpg";
  const afterImage = "/processed-beer.jpg";

  return (
    <section className="h-[calc(100vh-4rem)] md:h-screen flex items-center pt-24 md:pt-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-20 md:gap-32 lg:gap-40 items-center w-full h-full">
          {/* Left: Intro Content + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-6 md:space-y-8 flex flex-col justify-center h-full"
          >
            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-balance mb-4">
                Transform images with{" "}
                <span className="text-primary">AI precision</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Remove backgrounds, flip images, and enhance photos instantly.
                Professional results in seconds.
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="h-12 px-6 sm:px-8 text-base group min-h-[44px]"
                asChild
              >
                <Link href="/home">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Stats Dashboard */}
            <div className="pt-4">
              <StatsCompact />
            </div>
          </motion.div>

          {/* Right: Centered Compare Component */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="flex items-center justify-center h-full"
          >
            <div className="relative w-full max-w-lg px-4 sm:px-0">
              <div className="absolute -inset-3 rounded-2xl bg-linear-to-br from-primary/20 via-chart-2/20 to-chart-3/20 blur-2xl opacity-40" />
              <div className="relative rounded-xl border bg-card p-2 shadow-xl">
                <Compare
                  firstImage={beforeImage}
                  secondImage={afterImage}
                  slideMode="drag"
                  showHandlebar={true}
                  className="w-full aspect-[4/3] rounded-lg"
                  firstImageClassName="object-cover"
                  secondImageClassname="object-cover"
                />
                <div className="mt-3 flex justify-between px-2 pb-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    Original
                  </span>
                  <span className="flex items-center gap-2">
                    Transformed
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
