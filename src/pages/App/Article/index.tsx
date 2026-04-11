import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import QUERY_KEY from '@/api/QueryKey';
import ApiArticle from '@/api/ApiArticle';
import ApiCategory from '@/api/ApiCategory';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ArticleCard,
  ArticleCardGridSkeleton,
  Pagination,
  CategoryList,
  SearchBar,
} from '@/components/Article';

const ITEMS_PER_PAGE = 6;

const ArticlePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Read directly from URL params (single source of truth) ─────────
  const searchQuery = searchParams.get('search') ?? '';
  const selectedCategoryId = searchParams.get('category') ?? null;
  const selectedSort = searchParams.get('sort') ?? 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state for search input (controlled, synced on submit)
  const [searchInput, setSearchInput] = useState(searchQuery);

  // ─── API Queries ─────────────────────────────────────────────────────
  const {
    data: articlesData,
    isPending: articlesPending,
    isFetching: articlesFetching,
  } = useQuery({
    queryKey: [
      QUERY_KEY.ARTICLE.LIST_ARTICLES,
      {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategoryId || undefined,
        search: searchQuery || undefined,
        sortBy:
          selectedSort === 'views'
            ? 'viewCount'
            : selectedSort === 'oldest'
              ? 'createdAt'
              : 'createdAt',
        sortOrder: selectedSort === 'oldest' ? 'asc' : 'desc',
      },
    ],
    queryFn: () =>
      ApiArticle.getArticles({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategoryId || undefined,
        search: searchQuery || undefined,
        sortBy:
          selectedSort === 'views'
            ? 'viewCount'
            : selectedSort === 'oldest'
              ? 'createdAt'
              : 'createdAt',
        sortOrder: selectedSort === 'oldest' ? 'asc' : 'desc',
      }),
    placeholderData: (prev) => prev,
  });

  const { data: categoriesData, isPending: categoriesPending } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY.LIST_CATEGORIES],
    queryFn: () =>
      ApiCategory.getCategories({
        page: '1',
        limit: '20',
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  console.log('Articles data:', articlesData);

  // fetcherWithMetadata returns { data, metadata }
  const articles = useMemo(() => articlesData?.data ?? [], [articlesData]);
  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData]
  );
  const totalPages = articlesData?.metadata?.totalPages ?? 1;

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/app/article/${slug}`);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  // ─── Sort options ────────────────────────────────────────────────────
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'views', label: 'Xem nhiều nhất' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <svg
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Goodlearn Blog
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          TIN TỨC & BÀI HỌC
        </h1>
        <p className="mt-2 text-gray-600">
          Khám phá những kiến thức mới nhất, kỹ năng học tập thông minh và xu
          hướng AI dành riêng cho học sinh, sinh viên.
        </p>
      </section>

      {/* ─── Search Bar ──────────────────────────────────────────────── */}
      <section className="mb-6">
        <SearchBar
          placeholder="Tìm kiếm bài viết..."
          onSearch={handleSearch}
          initialValue={searchInput}
          className="max-w-md"
        />
      </section>

      {/* ─── Category Filter & Sort ──────────────────────────────────── */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 overflow-x-auto">
          {categoriesPending ? (
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              showAll
            />
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Sắp xếp:
          </span>
          <Select
            value={selectedSort}
            onValueChange={(e) => handleSortChange(e)}
          >
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {sortOptions.map((option) => (
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* ─── Articles Grid ───────────────────────────────────────────── */}
      {articlesPending ? (
        <ArticleCardGridSkeleton count={ITEMS_PER_PAGE} />
      ) : articles.length === 0 ? (
        <section className="rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
          <svg
            className="mx-auto mb-4 h-14 w-14 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h2 className="text-xl font-bold text-slate-800">
            Không tìm thấy bài viết nào
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Thử đổi từ khóa hoặc đặt lại bộ lọc.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 rounded-xl border-2 border-black bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            Đặt lại bộ lọc
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured article (first item) */}
          {articles.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <ArticleCard
                article={articles[0]}
                variant="featured"
                onClick={() => handleArticleClick(articles[0].slug)}
              />
            </div>
          )}

          {/* Remaining articles */}
          {articles.slice(1).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="default"
              onClick={() => handleArticleClick(article.slug)}
            />
          ))}
        </section>
      )}

      {/* ─── Pagination ──────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <section className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      )}

      {/* ─── Fetching indicator ──────────────────────────────────────── */}
      {articlesFetching && !articlesPending && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Đang cập nhật...
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
