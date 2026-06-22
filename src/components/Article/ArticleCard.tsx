import { type IArticle } from 'src/types';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: IArticle;
  className?: string;
  thumbnailClassName?: string;
  variant?: 'default' | 'compact' | 'featured';
  onClick?: () => void;
}

export function ArticleCard({
  article,
  className,
  thumbnailClassName,
  variant = 'default',
  onClick,
}: ArticleCardProps) {
  const { title, summary, createdAt, category, articleFiles } = article;
  const thumbnailUrl =
    articleFiles?.find((file) => file.usageType === 'thumbnail')?.file
      ?.fullUrl ||
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop';
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoryColor = (categoryName?: string) => {
    const colors: Record<string, string> = {
      default: 'bg-muted text-muted-foreground',
      'Kỹ năng': 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      'Công nghệ': 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
      'Học tập': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    };
    if (!categoryName) return colors.default;
    return (
      colors[categoryName] ||
      colors[
        Object.keys(colors).find((key) => categoryName.includes(key)) ||
          'default'
      ]
    );
  };

  if (variant === 'featured') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'group relative block cursor-pointer overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5',
          className
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div
            className={cn(
              'relative aspect-video md:w-1/2 overflow-hidden',
              thumbnailClassName
            )}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-2 text-sm font-semibold text-foreground">
                Đọc ngay
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-6 md:w-1/2">
            <div>
              {category && (
                <span
                  className={cn(
                    'inline-block rounded px-2 py-1 text-xs font-semibold',
                    getCategoryColor(category.name)
                  )}
                >
                  {category.name}
                </span>
              )}
              <h3 className="mt-3 text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 md:text-2xl">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 md:line-clamp-4">
                {summary}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                Đọc ngay
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default & Compact variants
  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative block cursor-pointer overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden',
          thumbnailClassName
        )}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded px-2 py-1 text-xs font-semibold',
              getCategoryColor(category.name)
            )}
          >
            {category.name}
          </span>
        )}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-2 text-sm font-semibold text-foreground">
            Đọc ngay
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {variant !== 'compact' && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {summary}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:translate-x-1 transition-transform">
            Đọc ngay
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// Props for article without full data (e.g., from API)
interface ArticleCardWithImageProps extends Omit<ArticleCardProps, 'article'> {
  article: IArticle;
}

export function ArticleCardWithImage({
  article,
  className,
  thumbnailClassName,
  onClick,
}: ArticleCardWithImageProps) {
  const { title, summary, createdAt, category, articleFiles } = article;

  const thumbnailUrl =
    articleFiles?.find((file) => file.usageType === 'thumbnail')?.file
      ?.fullUrl ||
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative block cursor-pointer overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden',
          thumbnailClassName
        )}
      >
        <img
          src={
            thumbnailUrl ||
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'
          }
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {category.name}
          </span>
        )}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-2 text-sm font-semibold text-foreground">
            Đọc ngay
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {summary}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:translate-x-1 transition-transform">
            Đọc ngay
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
