// Feature 2.10: Melhorias de Performance e UX - Lazy Image Component
// @feature: Performance Optimization
// @created: Feature 2.10

"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: LazyImage]';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  sizes,
  fill = false
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    logger.debug(`${FEATURE_NAME} Image loaded successfully`, { src, alt });
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    logger.warn(`${FEATURE_NAME} Image failed to load`, { src, alt });
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-sm",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        Imagem não encontrada
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={fill ? undefined : { width, height }}
        />
      )}
      
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || (fill ? "100vw" : undefined)}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoadingComplete}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}