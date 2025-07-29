// Feature 2.10: Melhorias de Performance e UX - Post List Skeleton
// @feature: Performance Optimization
// @created: Feature 2.10

import { PostSkeleton } from './post-skeleton';

interface PostListSkeletonProps {
  count?: number;
  className?: string;
}

export function PostListSkeleton({ count = 6, className }: PostListSkeletonProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}

// Export both components for convenience
export { PostSkeleton } from './post-skeleton';