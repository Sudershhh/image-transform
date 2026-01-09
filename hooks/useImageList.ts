'use client';

import { useEffect, useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import type { Image } from '@/store/imageStore';

export function useImageList() {
  const { images, setImages } = useImageStore();

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [setImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    refetch: fetchImages,
  };
}
