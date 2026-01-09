'use client';

import { ImageCard } from './ImageCard';
import type { Image } from '@/store/imageStore';

interface ImageListProps {
  images: Image[];
}

export function ImageList({ images }: ImageListProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images yet. Upload your first image to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
