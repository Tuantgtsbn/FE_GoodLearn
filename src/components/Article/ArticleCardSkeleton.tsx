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
          'group relative block overflow-hidden rounded-xl border bg-background',
          className
        )}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <Skeleton className="aspect-video w-full rounded-none" />
          </div>

          <div className="flex flex-1 flex-col justify-between p-6 md:w-1/2">
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative block overflow-hidden rounded-xl border bg-background',
        className
      )}
    >
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

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
