'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Image } from '@/store/imageStore';

interface ImageCardProps {
  image: Image;
}

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/image/${image.id}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
          {image.status === 'processing' ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : image.processedUrl ? (
            <img
              src={image.processedUrl}
              alt={image.originalFilename || 'Processed image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={image.originalUrl}
              alt={image.originalFilename || 'Original image'}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2">
            {image.status === 'processing' && (
              <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {image.status === 'completed' && (
              <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
            )}
            {image.status === 'failed' && (
              <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium truncate">
            {image.originalFilename || 'Untitled'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(image.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
