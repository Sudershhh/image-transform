'use client';

import { UploadContainer } from '@/components/upload/UploadContainer';
import { ImageListContainer } from '@/components/image/ImageListContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl pt-20">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            🖼️ Image Transformer
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload an image to remove its background and flip it horizontally
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* Upload Section */}
          <section>
            <UploadContainer />
          </section>

          {/* Recent Images Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Recent Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageListContainer />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
