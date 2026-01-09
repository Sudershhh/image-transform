'use client';

import { useEffect, useRef } from 'react';
import { useImageStore } from '@/store/imageStore';
import type { Image } from '@/store/imageStore';

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 60; // 2 minutes max

export function useImageProcessing(imageId: string | null) {
  const { currentImage, setCurrentImage, updateImage, setProcessing } = useImageStore();
  const pollCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!imageId) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${imageId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const image: Image = await response.json();
        setCurrentImage(image);
        updateImage(image.id, image);

        // Stop polling if processing is complete or failed
        if (image.status === 'completed' || image.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setProcessing(false);
          return;
        }

        // Continue polling if still processing
        setProcessing(true);
      } catch (error) {
        console.error('Error fetching image:', error);
        pollCountRef.current++;
        
        // Stop polling after max attempts
        if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setProcessing(false);
        }
      }
    };

    // Initial fetch
    fetchImage();

    // Set up polling
    intervalRef.current = setInterval(fetchImage, POLL_INTERVAL);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageId, setCurrentImage, updateImage, setProcessing]);

  return {
    image: currentImage,
    isProcessing: currentImage?.status === 'processing',
    isCompleted: currentImage?.status === 'completed',
    isFailed: currentImage?.status === 'failed',
  };
}
