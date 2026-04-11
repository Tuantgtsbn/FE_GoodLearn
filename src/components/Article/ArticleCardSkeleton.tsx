import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ArticleCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'featured';
}

export function ArticleCardSkeleton({
  className,
  variant = 'default',
}: ArticleCardSkeletonProps) {
  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'group relative block overflow-hidden rounded-xl border-2 border-black bg-white',
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail skeleton */}
          <div className="md:w-1/2">
            <Skeleton className="aspect-video w-full rounded-none" />
          </div>

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col justify-between p-6 md:w-1/2">
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" /> {/* Category badge */}
              <Skeleton className="h-7 w-full" /> {/* Title line 1 */}
              <Skeleton className="h-7 w-3/4" /> {/* Title line 2 */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" /> {/* Summary */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-20" /> {/* Date */}
              <Skeleton className="h-5 w-24" /> {/* Read more */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group relative block overflow-hidden rounded-xl border-2 border-black bg-white',
        className
      )}
    >
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-20" /> {/* Category badge */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" /> {/* Title line 1 */}
          <Skeleton className="h-5 w-3/4" /> {/* Title line 2 */}
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full" /> {/* Summary */}
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" /> {/* Date */}
          <Skeleton className="h-4 w-20" /> {/* Read more */}
        </div>
      </div>
    </div>
  );
}

// Grid skeleton for multiple cards
interface ArticleCardGridSkeletonProps {
  count?: number;
  className?: string;
  cardClassName?: string;
}

export function ArticleCardGridSkeleton({
  count = 6,
  className,
  cardClassName,
}: ArticleCardGridSkeletonProps) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} className={cardClassName} />
      ))}
    </div>
  );
}
