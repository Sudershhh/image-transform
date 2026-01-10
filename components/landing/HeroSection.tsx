"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import FloatingLines from "@/components/FloatingLines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function HeroSection() {
  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <FloatingLines
          linesGradient={["#3d2d14", "#8b6d4a", "#8b2f1f", "#4a4a4a"]}
          animationSpeed={1}
          interactive={false}
          bendRadius={5}
          bendStrength={-0.5}
          mouseDamping={0.05}
          parallax
          parallaxStrength={0.2}
        />
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/polaroid.png"
                alt="FlipShot"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-foreground drop-shadow-lg">
              FlipShot
            </span>
          </motion.div>

          <div className="space-y-4">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <TextGenerateEffect
                words="Transform images with AI precision"
                className="text-foreground"
                filter={true}
                duration={0.5}
              />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              Remove backgrounds, flip images, and enhance photos instantly.
              Professional results in seconds.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base group min-h-[44px]"
              asChild
            >
              <Link href="/home">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base min-h-[44px]"
              onClick={handleLearnMore}
            >
              Learn More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
