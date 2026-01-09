'use client';

import { useImageList } from '@/hooks/useImageList';
import { ImageList } from './ImageList';

export function ImageListContainer() {
  const { images } = useImageList();

  return <ImageList images={images} />;
}
