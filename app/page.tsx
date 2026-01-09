'use client';

import { UploadContainer } from '@/components/upload/UploadContainer';
import { ImageListContainer } from '@/components/image/ImageListContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          🖼️ Image Transformer
        </h1>
        <p className="text-muted-foreground">
          Upload an image to remove its background and flip it horizontally
        </p>
      </div>

      <div className="space-y-12">
        {/* Upload Section */}
        <section>
          <UploadContainer />
        </section>

        {/* Recent Images Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageListContainer />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
