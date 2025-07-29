// Feature 2.10: Melhorias de Performance e UX - Post Skeleton
// @feature: Performance Optimization
// @created: Feature 2.10

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PostSkeletonProps {
  className?: string;
}

export function PostSkeleton({ className }: PostSkeletonProps) {
  return (
    <Card className={`animate-pulse ${className || ''}`}>
      <CardHeader className="pb-4">
        {/* Cover image placeholder */}
        <div className="h-48 bg-muted rounded-lg mb-4" />
        
        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/2" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Excerpt placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
        
        {/* Meta info placeholder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
        </div>
        
        {/* Tags placeholder */}
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-muted rounded-full w-20" />
          <div className="h-6 bg-muted rounded-full w-24" />
          <div className="h-6 bg-muted rounded-full w-16" />
        </div>
      </CardContent>
    </Card>
  );
}