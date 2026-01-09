"use client";

import { UploadContainer } from "@/components/upload/UploadContainer";
import { ImageListContainer } from "@/components/image/ImageListContainer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />

      <div className="relative">
        <Header />

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 pt-20 pb-10">
          <div className="space-y-12">
            {/* Upload Section */}
            <section className="max-w-xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                  Transform your images
                </h1>
                <p className="text-sm text-muted-foreground">
                  Upload an image to remove backgrounds, flip, and enhance
                  instantly
                </p>
              </div>
              <UploadContainer />
            </section>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
            </div>

            {/* Recent Images Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Images
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your transformed images appear here
                  </p>
                </div>
              </div>
              <ImageListContainer />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
