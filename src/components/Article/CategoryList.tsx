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
      {showAll && (
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          Tất cả
        </button>
      )}

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

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
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
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
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
            selectedCategoryId === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
}
