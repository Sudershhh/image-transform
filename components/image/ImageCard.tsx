"use client";

import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Image } from "@/store/imageStore";

interface ImageCardProps {
  image: Image;
}

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/image/${image.id}`);
  };

  const statusConfig = {
    processing: {
      icon: Loader2,
      className: "text-primary animate-spin",
      bgClassName: "bg-primary/10",
    },
    completed: {
      icon: CheckCircle2,
      className: "text-emerald-500",
      bgClassName: "bg-emerald-500/10",
    },
    failed: {
      icon: XCircle,
      className: "text-destructive",
      bgClassName: "bg-destructive/10",
    },
  };

  const StatusIcon = statusConfig[image.status].icon;

  return (
    <div className="group relative cursor-pointer" onClick={handleClick}>
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {image.status === "processing" ? (
            <div className="flex items-center justify-center h-full bg-muted">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Processing...
                </span>
              </div>
            </div>
          ) : image.processedUrl ? (
            <img
              src={image.processedUrl || "/placeholder.svg"}
              alt={image.originalFilename || "Processed image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (image.originalUrl && target.src !== image.originalUrl) {
                  target.src = image.originalUrl;
                } else {
                  target.style.display = "none";
                }
              }}
              loading="lazy"
            />
          ) : image.originalUrl ? (
            <img
              src={image.originalUrl || "/placeholder.svg"}
              alt={image.originalFilename || "Original image"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No image
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-md",
                statusConfig[image.status].bgClassName
              )}
            >
              <StatusIcon
                className={cn(
                  "h-3.5 w-3.5",
                  statusConfig[image.status].className
                )}
              />
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-3.5">
          <p className="text-sm font-medium text-foreground truncate leading-tight">
            {image.originalFilename || "Untitled"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(image.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
