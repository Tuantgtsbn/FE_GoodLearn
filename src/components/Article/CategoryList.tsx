import { cn } from '@/lib/utils';
import { type ICategory } from 'src/types';

interface CategoryListProps {
  categories: ICategory[];
  selectedCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  className?: string;
  showAll?: boolean;
}

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className,
  showAll = true,
}: CategoryListProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* All categories button */}
      {showAll && (
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === null
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          )}
        >
          Tất cả
        </button>
      )}

      {/* Category buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === category.id
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

// Category with icon variant
interface CategoryWithIcon {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CategoryListWithIconsProps {
  categories: CategoryWithIcon[];
  selectedCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  className?: string;
  showAll?: boolean;
}

export function CategoryListWithIcons({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className,
  showAll = true,
}: CategoryListWithIconsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {showAll && (
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === null
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          )}
        >
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Tất cả
        </button>
      )}

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === category.id
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          )}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
}
