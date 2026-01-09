'use client';

import { useRouter } from 'next/navigation';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { ImageDetail } from './ImageDetail';
import { useImageStore } from '@/store/imageStore';
import { Header } from '@/components/layout/Header';
import { toast } from 'sonner';

interface ImageDetailContainerProps {
  imageId: string;
}

export function ImageDetailContainer({ imageId }: ImageDetailContainerProps) {
  const router = useRouter();
  const { image, isProcessing, isCompleted, isFailed } = useImageProcessing(imageId);
  const { deleteImage: deleteImageFromStore } = useImageStore();

  const handleBack = () => {
    router.push('/home');
  };

  const handleDelete = async () => {
    if (!imageId) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      deleteImageFromStore(imageId);
      toast.success('Image deleted successfully');
      router.push('/home');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Image downloaded');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <>
      <Header />
      <ImageDetail
        image={image}
        isProcessing={isProcessing}
        isCompleted={isCompleted}
        isFailed={isFailed}
        onBack={handleBack}
        onDelete={handleDelete}
        onCopyUrl={handleCopyUrl}
        onDownload={handleDownload}
      />
    </>
  );
}
