// Feature 2.8: Páginas Individuais de Posts - Reading Progress Component
// @feature: Individual Post Pages
// @created: Feature 2.8

"use client";

import { useEffect, useState } from "react";
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      
      const progressPercentage = (scrolled / scrollHeight) * 100;
      setProgress(Math.min(Math.max(progressPercentage, 0), 100));
    };

    // Initial calculation
    updateProgress();
    
    // Add scroll listener with throttling
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, []);

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 w-full h-1 bg-muted/30 z-50",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progresso de leitura: ${Math.round(progress)}%`}
    >
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}