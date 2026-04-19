import ApiFlashcard from '@/api/ApiFlashcard';
import ApiVideo from '@/api/ApiVideo';
import QUERY_KEY from '@/api/QueryKey';
import Avatar from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { IRootState } from '@/redux/store';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenText,
  Clapperboard,
  Clock3,
  Eye,
  Globe,
  Heart,
  LayoutGrid,
  Layers3,
  Play,
  Search,
  Sparkles,
  Star,
  UserRound,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type {
  IFlashcardListApiQuery,
  IFlashcardSetListItem,
} from '@/types/flashcard';
import type { IVideoListApiQuery, IVideoListItem } from '@/types/video';

const ITEMS_PER_PAGE = 12;
const GRADE_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

type LibraryContentType = 'flashcard' | 'video';
type LibraryScope = 'mine' | 'public';
type LibrarySortBy = 'createdAt' | 'viewCount' | 'likeCount';
type LibraryGenerationStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED';

interface LibraryOwner {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

interface LibraryItem {
  id: string;
  type: LibraryContentType;
  title: string;
  description: string | null;
  subjectLabel: string | null;
  gradeLevel: number | null;
  generationStatus: LibraryGenerationStatus;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  owner: LibraryOwner | null;
  createdAt: string;
  accent: string;
  primaryMetricLabel: string;
  secondaryMetricLabel: string;
  tertiaryMetricLabel: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  actionLabel: string;
}

const CONTENT_OPTIONS: Array<{
  value: LibraryContentType;
  label: string;
  icon: ComponentType<{ size?: number }>;
}> = [
  { value: 'flashcard', label: 'Flashcard', icon: BookOpenText },
  { value: 'video', label: 'Video', icon: Video },
];

const SCOPE_OPTIONS: Array<{
  value: LibraryScope;
  label: string;
  icon: ComponentType<{ size?: number }>;
}> = [
  { value: 'mine', label: 'Của tôi', icon: UserRound },
  { value: 'public', label: 'Công khai', icon: Globe },
];

const SORT_OPTIONS: Array<{ value: LibrarySortBy; label: string }> = [
  { value: 'createdAt', label: 'Mới nhất' },
  { value: 'viewCount', label: 'Xem nhiều nhất' },
  { value: 'likeCount', label: 'Yêu thích nhất' },
];

const STATUS_STYLES: Record<LibraryGenerationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
};

const CONTENT_ACCENTS: Record<LibraryContentType, string[]> = {
  flashcard: ['#0F172A', '#2563EB', '#7C3AED', '#0F766E'],
  video: ['#111827', '#DC2626', '#EA580C', '#2563EB'],
};

const getStatusLabel = (status: LibraryGenerationStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Đang chờ';
    case 'IN_PROGRESS':
      return 'Đang xử lý';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'FAILED':
      return 'Thất bại';
    default:
      return status;
  }
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds <= 0) {
    return 'Chưa có thời lượng';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
};

const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const getAccent = (type: LibraryContentType, index: number) => {
  const palette = CONTENT_ACCENTS[type];
  return palette[index % palette.length];
};

const mapFlashcardToLibraryItem = (
  item: IFlashcardSetListItem,
  index: number,
  currentUserId?: string
): LibraryItem => {
  const owner: LibraryOwner | null = item.user
    ? {
        id: item.user.id,
        username: item.user.username,
        fullName: item.user.fullName,
        avatarUrl: item.user.avatarUrl,
      }
    : null;

  return {
    id: item.id,
    type: 'flashcard',
    title: item.title,
    description: item.description,
    subjectLabel: item.subject?.subjectName ?? null,
    gradeLevel: item.gradeLevel,
    generationStatus: item.generationStatus,
    isPublic: item.isPublic,
    isFeatured: item.isFeatured,
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    owner,
    createdAt: item.createdAt,
    accent: getAccent('flashcard', index),
    primaryMetricLabel: `${item.cardCount} thẻ`,
    secondaryMetricLabel: `${formatCompactNumber(item.viewCount)} lượt xem`,
    tertiaryMetricLabel: `${formatCompactNumber(item.likeCount)} lượt thích`,
    mediaUrl: null,
    thumbnailUrl: null,
    actionLabel: owner?.id === currentUserId ? 'Mở bộ thẻ của bạn' : 'Học ngay',
  };
};

const mapVideoToLibraryItem = (
  item: IVideoListItem,
  index: number,
  currentUserId?: string
): LibraryItem => {
  const owner: LibraryOwner | null = item.user
    ? {
        id: item.user.id,
        username: item.user.username,
        fullName: item.user.fullName,
        avatarUrl: item.user.avatarUrl,
      }
    : null;

  return {
    id: item.id,
    type: 'video',
    title: item.title,
    description: item.description,
    subjectLabel: item.subject,
    gradeLevel: item.gradeLevel,
    generationStatus: item.generationStatus,
    isPublic: item.isPublic,
    isFeatured: item.isFeatured,
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    owner,
    createdAt: item.createdAt,
    accent: getAccent('video', index),
    primaryMetricLabel: formatDuration(item.duration),
    secondaryMetricLabel: `${formatCompactNumber(item.viewCount)} lượt xem`,
    tertiaryMetricLabel: `${formatCompactNumber(item.likeCount)} lượt thích`,
    mediaUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl,
    actionLabel:
      owner?.id === currentUserId ? 'Xem video của bạn' : 'Phát video',
  };
};

const LoadingCard = () => (
  <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <Skeleton className="aspect-16/10 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </article>
);

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon: ComponentType<{ size?: number }>;
}) => (
  <div className="rounded-4xl border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center shadow-sm backdrop-blur">
    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
      <Icon size={28} />
    </div>
    <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
      {title}
    </h2>
    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
      {description}
    </p>
    <Button className="mt-6 rounded-2xl px-5" onClick={onAction}>
      <Sparkles data-icon="inline-start" />
      {actionLabel}
    </Button>
  </div>
);

const Library = () => {
  const navigate = useNavigate();
  const currentUserId = useSelector((state: IRootState) => state.auth.user?.id);

  const [contentType, setContentType] =
    useState<LibraryContentType>('flashcard');
  const [scope, setScope] = useState<LibraryScope>('mine');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<LibrarySortBy>('createdAt');
  const [gradeLevel, setGradeLevel] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const flashcardQueryParams = useMemo<IFlashcardListApiQuery>(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      sortBy,
      sortOrder: 'desc',
      scope,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(gradeLevel ? { gradeLevel: Number(gradeLevel) } : {}),
    }),
    [debouncedSearch, gradeLevel, page, scope, sortBy]
  );

  const videoQueryParams = useMemo<IVideoListApiQuery>(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      sortBy,
      sortOrder: 'desc',
      scope,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(gradeLevel ? { gradeLevel: Number(gradeLevel) } : {}),
    }),
    [debouncedSearch, gradeLevel, page, scope, sortBy]
  );

  const flashcardQuery = useQuery({
    queryKey: [QUERY_KEY.FLASHCARD.LIST_SETS, flashcardQueryParams],
    queryFn: () => ApiFlashcard.getFlashcardSetList(flashcardQueryParams),
    enabled: contentType === 'flashcard',
    placeholderData: (previousData) => previousData,
  });

  const videoQuery = useQuery({
    queryKey: [QUERY_KEY.VIDEO.LIST_VIDEOS, videoQueryParams],
    queryFn: () => ApiVideo.getVideoList(videoQueryParams),
    enabled: contentType === 'video',
    placeholderData: (previousData) => previousData,
  });

  const currentQuery =
    contentType === 'flashcard' ? flashcardQuery : videoQuery;

  const libraryItems = useMemo<LibraryItem[]>(() => {
    if (contentType === 'flashcard') {
      return (flashcardQuery.data?.data ?? []).map((item, index) =>
        mapFlashcardToLibraryItem(item, index, currentUserId)
      );
    }

    return (videoQuery.data?.data ?? []).map((item, index) =>
      mapVideoToLibraryItem(item, index, currentUserId)
    );
  }, [
    contentType,
    currentUserId,
    flashcardQuery.data?.data,
    videoQuery.data?.data,
  ]);

  const metadata = currentQuery.data?.metadata;
  const totalPages = metadata?.totalPages ?? 1;

  const isPending = currentQuery.isPending;
  const isFetching = currentQuery.isFetching;

  const resetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSortBy('createdAt');
    setGradeLevel('');
    setScope('mine');
    setPage(1);
  };

  const handleCardClick = (item: LibraryItem) => {
    if (item.type === 'flashcard') {
      navigate(`/app/flashcards/${item.id}`);
      return;
    }

    if (item.mediaUrl) {
      window.open(item.mediaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCount = metadata?.totalItems ?? 0;
  const activeScopeLabel = SCOPE_OPTIONS.find(
    (option) => option.value === scope
  )?.label;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] sm:px-8 sm:py-10">
        <div className="absolute inset-0 opacity-45">
          <div className="absolute -left-20 top-0 size-64 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute right-0 top-16 size-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 size-56 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              <Layers3 size={14} />
              Library
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Thư viện cá nhân và nội dung công khai
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Quản lý video và flashcard của riêng bạn, đồng thời khám phá nội
              dung public từ cộng đồng ngay trong cùng một màn hình.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <UserRound size={14} />
                {activeScopeLabel ?? 'Của tôi'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <LayoutGrid size={14} />
                {formatCompactNumber(activeCount)} mục
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                {contentType === 'video' ? (
                  <Clapperboard size={14} />
                ) : (
                  <BookOpenText size={14} />
                )}
                {contentType === 'video' ? 'Video' : 'Flashcard'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
            <button
              type="button"
              onClick={() => navigate('/app/chat')}
              className="group rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <div className="flex items-center justify-between">
                <Sparkles size={16} className="text-white/80" />
                <ArrowRight
                  size={15}
                  className="text-white/60 transition group-hover:translate-x-0.5"
                />
              </div>
              <p className="mt-5 text-sm font-semibold text-white">
                Tạo mới bằng AI
              </p>
              <p className="mt-1 text-xs text-white/65">
                Mở Chat để sinh nội dung
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/app/flashcards')}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <BookOpenText size={16} className="text-white/80" />
              <p className="mt-5 text-sm font-semibold text-white">Flashcard</p>
              <p className="mt-1 text-xs text-white/65">
                Mở thư viện flashcard
              </p>
            </button>

            <button
              type="button"
              onClick={() => setContentType('video')}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <Video size={16} className="text-white/80" />
              <p className="mt-5 text-sm font-semibold text-white">Video</p>
              <p className="mt-1 text-xs text-white/65">
                Chuyển sang tab video
              </p>
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <Sparkles size={16} className="text-white/80" />
              <p className="mt-5 text-sm font-semibold text-white">Đặt lại</p>
              <p className="mt-1 text-xs text-white/65">Xóa bộ lọc hiện tại</p>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {CONTENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = contentType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setContentType(option.value);
                    setPage(1);
                  }}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  <Icon size={14} />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.7fr,1fr,1fr,1fr]">
            <label className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={
                  contentType === 'video'
                    ? 'Tìm theo tiêu đề, mô tả hoặc chủ đề video...'
                    : 'Tìm theo tiêu đề hoặc mô tả flashcard...'
                }
                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
              />
            </label>

            <div className="flex gap-3.5 flex-wrap">
              <Select
                value={scope}
                onValueChange={(value) => {
                  setScope(value as LibraryScope);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Phạm vi" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {SCOPE_OPTIONS.map((option) => {
                      const Icon = option.icon;

                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="inline-flex items-center gap-2">
                            <Icon size={14} />
                            {option.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={gradeLevel || '_all'}
                onValueChange={(value) => {
                  setGradeLevel(value === '_all' ? '' : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Khối lớp" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItem value="_all">Tất cả lớp</SelectItem>
                    {GRADE_OPTIONS.map((grade) => (
                      <SelectItem key={grade} value={String(grade)}>
                        Lớp {grade}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value as LibrarySortBy);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-600">Đang lọc:</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {contentType === 'video' ? 'Video' : 'Flashcard'}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {activeScopeLabel ?? 'Của tôi'}
            </span>
            {debouncedSearch && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                &quot;{debouncedSearch}&quot;
              </span>
            )}
            {gradeLevel && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Lớp {gradeLevel}
              </span>
            )}
            {sortBy !== 'createdAt' && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
              </span>
            )}
            {(debouncedSearch ||
              gradeLevel ||
              sortBy !== 'createdAt' ||
              scope !== 'mine') && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </section>

      {isPending ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </section>
      ) : libraryItems.length === 0 ? (
        <EmptyState
          icon={contentType === 'video' ? Clapperboard : BookOpenText}
          title={
            contentType === 'video'
              ? 'Chưa có video nào trong thư viện'
              : 'Chưa có flashcard nào trong thư viện'
          }
          description={
            scope === 'mine'
              ? 'Bạn chưa có nội dung nào ở phạm vi này. Hãy tạo nội dung mới từ Chat hoặc chuyển sang Công khai để khám phá của người khác.'
              : 'Không có nội dung công khai phù hợp với bộ lọc hiện tại. Hãy đổi từ khóa hoặc reset bộ lọc để tiếp tục.'
          }
          actionLabel="Mở Chat AI"
          onAction={() => navigate('/app/chat')}
        />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {libraryItems.map((item) => {
              const isOwner = item.owner?.id === currentUserId;
              const canOpenVideo =
                item.type === 'video' ? Boolean(item.mediaUrl) : true;

              return (
                <article
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (item.type === 'video' && !canOpenVideo) {
                      return;
                    }
                    handleCardClick(item);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (item.type === 'video' && !canOpenVideo) {
                        return;
                      }
                      handleCardClick(item);
                    }
                  }}
                  className={clsx(
                    'group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl',
                    item.type === 'video' &&
                      !canOpenVideo &&
                      'cursor-not-allowed opacity-80',
                    item.type !== 'video' || canOpenVideo
                      ? 'cursor-pointer'
                      : ''
                  )}
                >
                  <div className="relative overflow-hidden">
                    {item.type === 'video' && item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="aspect-16/10 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="aspect-16/10 w-full"
                        style={{
                          background: `linear-gradient(135deg, ${item.accent}, ${item.accent}cc)`,
                        }}
                      >
                        <div className="flex h-full items-center justify-center text-white">
                          {item.type === 'video' ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex size-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                                {canOpenVideo ? (
                                  <Play size={26} />
                                ) : (
                                  <Clock3 size={26} />
                                )}
                              </div>
                              <p className="text-sm font-semibold text-white/90">
                                {item.primaryMetricLabel}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-center">
                              <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                <BookOpenText size={26} />
                              </div>
                              <p className="text-sm font-semibold text-white/90">
                                {item.primaryMetricLabel}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/10 to-transparent opacity-90" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur">
                        {item.type === 'video' ? 'Video' : 'Flashcard'}
                      </span>
                      {item.isPublic && (
                        <span className="rounded-full bg-sky-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          Public
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                          <Star size={12} />
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {getStatusLabel(item.generationStatus)}
                    </div>

                    {item.gradeLevel && (
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
                        Lớp {item.gradeLevel}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        {item.subjectLabel && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                            {item.subjectLabel}
                          </span>
                        )}
                        <span
                          className={clsx(
                            'rounded-full px-2.5 py-1 font-semibold',
                            STATUS_STYLES[item.generationStatus]
                          )}
                        >
                          {getStatusLabel(item.generationStatus)}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-lg font-black leading-tight text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {item.description || 'Không có mô tả cho nội dung này.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        {item.type === 'video' ? (
                          <Clock3 size={12} />
                        ) : (
                          <LayoutGrid size={12} />
                        )}
                        {item.primaryMetricLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        <Eye size={12} />
                        {item.secondaryMetricLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        <Heart size={12} />
                        {item.tertiaryMetricLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={
                            item.owner?.fullName ??
                            item.owner?.username ??
                            'Người dùng'
                          }
                          src={item.owner?.avatarUrl}
                          size="sm"
                          className="shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.owner?.fullName ??
                              item.owner?.username ??
                              'Người dùng'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {isOwner
                              ? 'Của bạn'
                              : `Tạo ngày ${formatDate(item.createdAt)}`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item.type === 'video' && !canOpenVideo) {
                            return;
                          }
                          handleCardClick(item);
                        }}
                        className={clsx(
                          'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                          item.type === 'video' && !canOpenVideo
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-slate-950 text-white hover:bg-slate-800'
                        )}
                      >
                        {item.actionLabel}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {totalPages > 1 && (
            <section className="flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row">
              <p className="text-sm text-slate-500">
                Đang hiển thị{' '}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    (page - 1) * ITEMS_PER_PAGE + 1,
                    metadata?.totalItems ?? 0
                  )}
                </span>{' '}
                đến{' '}
                <span className="font-semibold text-slate-900">
                  {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)}
                </span>{' '}
                trong{' '}
                <span className="font-semibold text-slate-900">
                  {formatCompactNumber(metadata?.totalItems ?? 0)}
                </span>{' '}
                mục
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={clsx(
                    'inline-flex size-10 items-center justify-center rounded-full border transition',
                    page === 1
                      ? 'border-slate-200 text-slate-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  )}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={clsx(
                        'inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold transition',
                        pageNumber === page
                          ? 'bg-slate-950 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  disabled={page === totalPages}
                  className={clsx(
                    'inline-flex size-10 items-center justify-center rounded-full border transition',
                    page === totalPages
                      ? 'border-slate-200 text-slate-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  )}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {isFetching && !isPending && (
        <div className="fixed bottom-6 right-6 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-lg">
          Đang cập nhật dữ liệu...
        </div>
      )}
    </div>
  );
};

export default Library;
