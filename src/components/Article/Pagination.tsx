import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate start and end of page range
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }

    // Add page numbers around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    // Limit to show max 5 numbers + ellipses
    return pages.slice(0, 7);
  };

  const pageNumbers = generatePageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={cn(
          'h-9 min-w-[80px] border-2 border-black bg-white text-sm font-medium text-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50',
          currentPage === 1 && 'cursor-not-allowed'
        )}
      >
        <svg
          className="mr-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Trước
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition-all',
                isActive
                  ? 'border-2 border-black bg-black text-white'
                  : 'border-2 border-black bg-white text-black hover:bg-black hover:text-white'
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          'h-9 min-w-[80px] border-2 border-black bg-white text-sm font-medium text-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50',
          currentPage === totalPages && 'cursor-not-allowed'
        )}
      >
        Sau
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </div>
  );
}
