'use client';

import { useState } from 'react';
import { useImageStore } from '@/store/imageStore';
import { validateImageFile } from '@/lib/utils/validation';
import { useRouter } from 'next/navigation';

export function useImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setUploading, setError: setStoreError, addImage } = useImageStore();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setError(null);
    setStoreError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setError(null);
    setStoreError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Add to store
      addImage({
        id: data.imageId,
        sessionId: '',
        originalFilename: selectedFile.name,
        originalUrl: '',
        processedUrl: null,
        status: 'processing',
        errorMessage: null,
        createdAt: new Date().toISOString(),
      });

      // Navigate to image detail page
      router.push(`/image/${data.imageId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return {
    selectedFile,
    preview,
    error,
    handleFileSelect,
    uploadImage,
    clearSelection,
  };
}
