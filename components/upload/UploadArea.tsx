'use client';

import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  preview: string | null;
  error: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function UploadArea({
  preview,
  error,
  onFileSelect,
  onClear,
  disabled,
}: UploadAreaProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <div className="relative w-full h-48 sm:h-52 rounded-lg overflow-hidden border-2 border-dashed border-border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={onClear}
                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              'relative w-full h-48 sm:h-52 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
              isDragging && 'border-primary bg-primary/5',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Upload
              className={cn(
                'h-10 w-10 text-muted-foreground',
                isDragging && 'text-primary'
              )}
            />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Drag & drop an image here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Supported: JPG, PNG, GIF, BMP, TIFF (max 10MB)
              </p>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
