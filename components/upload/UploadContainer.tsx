'use client';

import { useImageUpload } from '@/hooks/useImageUpload';
import { UploadArea } from './UploadArea';
import { Button } from '@/components/ui/button';
import { useImageStore } from '@/store/imageStore';
import { Loader2 } from 'lucide-react';

export function UploadContainer() {
  const {
    preview,
    error,
    handleFileSelect,
    uploadImage,
    clearSelection,
  } = useImageUpload();
  const { uploading } = useImageStore();

  return (
    <div className="w-full space-y-4">
      <UploadArea
        preview={preview}
        error={error}
        onFileSelect={handleFileSelect}
        onClear={clearSelection}
        disabled={uploading}
      />
      {preview && (
        <Button
          onClick={uploadImage}
          disabled={uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload & Process'
          )}
        </Button>
      )}
    </div>
  );
}
