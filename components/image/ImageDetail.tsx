'use client';

import React from 'react';
import { ArrowLeft, Copy, Download, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="space-y-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isProcessing && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  Processing...
                </>
              )}
              {isCompleted && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Processing Complete
                </>
              )}
              {isFailed && (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Processing Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={image.originalUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : image.processedUrl ? (
                  <img
                    src={image.processedUrl}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No processed image available
                  </div>
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
              <CardTitle>Shareable URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={image.processedUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
                />
                <Button onClick={handleCopyUrl} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="flex-1"
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                onDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
