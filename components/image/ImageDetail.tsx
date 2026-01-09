'use client';

import React from 'react';
import { ArrowLeft, Copy, Download, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Image } from '@/store/imageStore';
import { toast } from 'sonner';

interface ImageDetailProps {
  image: Image | null;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  onBack: () => void;
  onDelete: () => void;
  onCopyUrl: (url: string) => void;
  onDownload: (url: string, filename: string) => void;
}

export function ImageDetail({
  image,
  isProcessing,
  isCompleted,
  isFailed,
  onBack,
  onDelete,
  onCopyUrl,
  onDownload,
}: ImageDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  if (!image) {
    return (
      <div className="flex items-center justify-center min-h-[400px] pt-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      </div>
    );
  }

  const handleCopyUrl = () => {
    if (image.processedUrl) {
      onCopyUrl(image.processedUrl);
      toast.success('URL copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (image.processedUrl) {
      const filename = image.originalFilename
        ? `processed-${image.originalFilename}`
        : `processed-${image.id}.png`;
      onDownload(image.processedUrl, filename);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 min-h-[44px] min-w-[44px]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="space-y-6 sm:space-y-8">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={image.originalUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">Processed</CardTitle>
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Complete</span>
                  </div>
                )}
                {isFailed && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Failed</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
                {isProcessing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
                    <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Processing your image...</p>
                    <div className="mt-4 w-3/4 max-w-xs space-y-2">
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-5/6" />
                    </div>
                  </div>
                ) : null}
                {image.processedUrl ? (
                  <img
                    src={image.processedUrl}
                    alt="Processed"
                    className={cn(
                      "w-full h-full object-contain transition-opacity duration-300",
                      isProcessing && "opacity-50"
                    )}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    loading="lazy"
                  />
                ) : !isProcessing ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm sm:text-base">
                    No processed image available
                  </div>
                ) : (
                  <Skeleton className="w-full h-full" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {isFailed && image.errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{image.errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {isCompleted && image.processedUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Shareable URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={image.processedUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-md border bg-background text-sm min-h-[44px]"
                />
                <Button onClick={handleCopyUrl} variant="outline" className="min-h-[44px]">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleDownload} className="flex-1 min-h-[44px]">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="flex-1 min-h-[44px]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                onDelete();
              }}
              className="min-h-[44px]"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
