"use client";

import { ImageCard } from "./ImageCard";
import { ImageIcon } from "lucide-react";
import type { Image } from "@/store/imageStore";

interface ImageListProps {
  images: Image[];
}

export function ImageList({ images }: ImageListProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <ImageIcon className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          No images yet
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Upload your first image above to start transforming
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
