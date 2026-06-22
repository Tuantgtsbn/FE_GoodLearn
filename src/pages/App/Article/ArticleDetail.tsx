import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import QUERY_KEY from '@/api/QueryKey';
import ApiArticle from '@/api/ApiArticle';

import {
  ArticleCard,
  ArticleCardGridSkeleton,
  TableOfContent,
} from '@/components/Article';

const ArticleDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isPending } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLE_BY_SLUG, slug],
    queryFn: () => ApiArticle.getArticleBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedArticlesData, isPending: relatedArticlesPending } =
    useQuery({
      queryKey: [QUERY_KEY.ARTICLE.RELATED_ARTICLES, article?.id],
      queryFn: () =>
        ApiArticle.getRelatedArticles({
          articleId: article!.id,
          limit: 3,
        }),
      enabled: !!article?.id,
    });

  const relatedArticles = relatedArticlesData?.data ?? [];

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">
          Không tìm thấy bài viết
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => navigate('/app/article')}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <button
              onClick={() => navigate('/app/article')}
              className="transition-colors hover:text-foreground"
            >
              Bài viết
            </button>
          </li>
          <li>/</li>
          <li className="max-w-[200px] truncate text-foreground font-medium sm:max-w-md">
            {article.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,280px] xl:grid-cols-[1fr,320px]">
        {/* Main content */}
        <article className="min-w-0 overflow-hidden">
          {/* Header */}
          <header className="mb-8">
            {article.category && (
              <span className="mb-4 inline-block rounded-lg bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                {article.category.name}
              </span>
            )}

            <h1 className="text-3xl font-black mt-4 mb-4 leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {article.summary && (
              <p className="mt-4 mb-4 text-lg text-muted-foreground">
                {article.summary}
              </p>
            )}

            <TableOfContent toc={article.toc} />

            {/* Author & Date */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t pt-6">
              {article.author?.avatarFullUrl ? (
                <img
                  src={article.author.avatarFullUrl}
                  alt={article.author.fullName || 'avatar'}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                  {(article.author?.fullName || '?')[0].toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {article.author?.fullName || 'Tác giả'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(article.publishedAt || article.createdAt)}
                  {article.viewCount !== undefined && (
                    <span className="ml-3 inline-flex items-center gap-1">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {article.viewCount.toLocaleString('vi-VN')} lượt xem
                    </span>
                  )}
                </p>
              </div>

              {article.articleTags && article.articleTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.articleTags.map((at) => (
                    <span
                      key={at.tagId}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      #{at.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {article.articleFiles?.some((f) => f.usageType === 'thumbnail') && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={
                  article.articleFiles.find((f) => f.usageType === 'thumbnail')
                    ?.file?.fullUrl
                }
                alt={article.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="mx-auto my-8 bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-800
             prose dark:prose-invert max-w-none
             prose-indigo 
             prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Sidebar */}
        <aside className="hidden w-full lg:block">
          <div className="space-y-6">
            {relatedArticlesPending ? (
              <div className="rounded-xl border bg-background p-4">
                <h3 className="mb-3 text-2xl font-bold text-foreground">
                  Bài viết liên quan
                </h3>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              </div>
            ) : relatedArticles.length > 0 ? (
              <div className="rounded-xl border bg-background p-4">
                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Bài viết liên quan
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {relatedArticles.map((relatedArticle) => (
                    <ArticleCard
                      key={relatedArticle.id}
                      article={relatedArticle}
                      variant="compact"
                      className="text-sm"
                      onClick={() =>
                        navigate(`/app/article/${relatedArticle.slug}`)
                      }
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {/* Related articles for mobile/tablet */}
      <section className="mt-12 border-t pt-10 lg:hidden">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Bài viết liên quan
        </h2>

        {relatedArticlesPending ? (
          <ArticleCardGridSkeleton count={3} />
        ) : relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                article={relatedArticle}
                variant="default"
                onClick={() => navigate(`/app/article/${relatedArticle.slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Không có bài viết liên quan nào.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ArticleDetailPage;
