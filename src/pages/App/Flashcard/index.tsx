import ApiFlashcard from '@/api/ApiFlashcard';
import QUERY_KEY from '@/api/QueryKey';
import type {
  IFlashcardListApiQuery,
  IFlashcardSetListItem,
} from '@/types/flashcard';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Heart,
  LayoutGrid,
  Search,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ApiSubject from '@/api/ApiSubject';

const ITEMS_PER_PAGE = 12;
const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getSubjectColor = (colorHex: string | null, index: number): string => {
  if (colorHex) return colorHex;
  const DEFAULTS = [
    '#F97316',
    '#3B82F6',
    '#EC4899',
    '#8B5CF6',
    '#10B981',
    '#F59E0B',
  ];
  return DEFAULTS[index % DEFAULTS.length];
};

const getStatusBadge = (status: IFlashcardSetListItem['generationStatus']) => {
  switch (status) {
    case 'COMPLETED':
      return null;
    case 'PENDING':
      return {
        label: 'Đang xử lý',
        class: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      };
    case 'IN_PROGRESS':
      return {
        label: 'Đang tạo',
        class: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
      };
    case 'FAILED':
      return {
        label: 'Lỗi',
        class: 'bg-destructive/15 text-destructive',
      };
    default:
      return null;
  }
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const FlashcardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border bg-background p-5">
    <div className="mb-3 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1">
        <div className="mb-1 h-4 w-16 rounded bg-muted" />
        <div className="h-3 w-10 rounded bg-muted" />
      </div>
    </div>
    <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
    <div className="mb-1 h-4 w-full rounded bg-muted" />
    <div className="mb-5 h-4 w-2/3 rounded bg-muted" />
    <div className="flex gap-2">
      <div className="h-9 flex-1 rounded-xl bg-muted" />
    </div>
  </div>
);

// ─── Flashcard Card ──────────────────────────────────────────────────────────

const FlashcardCard = ({
  set,
  index,
  onClick,
}: {
  set: IFlashcardSetListItem;
  index: number;
  onClick: () => void;
}) => {
  const accentColor = getSubjectColor(set.subject?.colorHex ?? null, index);
  const statusBadge = getStatusBadge(set.generationStatus);

  return (
    <article
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col rounded-2xl border bg-background p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
    >
      <button
        onClick={(e) => e.stopPropagation()}
        className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>

      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          <BookOpen size={18} />
        </div>
        <div className="min-w-0 flex-1 pr-6">
          <div className="flex flex-wrap items-center gap-1.5">
            {set.subject && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {set.subject.subjectName}
              </span>
            )}
            {set.gradeLevel && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Lớp {set.gradeLevel}
              </span>
            )}
            {set.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Sparkles size={10} />
                Nổi bật
              </span>
            )}
            {statusBadge && (
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-xs font-semibold',
                  statusBadge.class
                )}
              >
                {statusBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <h3 className="line-clamp-2 min-h-14 text-base font-extrabold text-foreground">
        {set.title}
      </h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">
        {set.description || 'Bộ thẻ flashcard giúp bạn ôn tập hiệu quả.'}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 font-medium">
          <LayoutGrid size={13} />
          {set.cardCount} thẻ
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Eye size={13} />
          {set.viewCount}
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Heart size={13} />
          {set.likeCount}
        </span>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: set.cardCount > 0 ? '100%' : '0%',
            backgroundColor: accentColor,
            opacity: 0.6,
          }}
        />
      </div>

      {set.user && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {set.user.avatarUrl ? (
            <img
              src={set.user.avatarUrl}
              alt={set.user.fullName ?? 'avatar'}
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
              {(set.user.fullName ?? set.user.username ?? '?')[0].toUpperCase()}
            </span>
          )}
          {set.user.fullName ?? set.user.username ?? 'Người dùng'}
        </p>
      )}
    </article>
  );
};

// ─── Quick Create Card ────────────────────────────────────────────────────────

const QuickCreateCard = ({ onClick }: { onClick: () => void }) => (
  <article
    onClick={onClick}
    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted p-5 text-center transition hover:border-primary/40 hover:bg-background hover:shadow-md"
  >
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
      <Plus size={22} className="text-muted-foreground" />
    </div>
    <p className="text-sm font-bold text-foreground">Tạo bộ thẻ mới</p>
    <p className="mt-1 text-xs text-muted-foreground">
      Dùng AI để tạo flashcard từ ghi chú của bạn ngay lập tức.
    </p>
  </article>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const FlashcardListPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'viewCount' | 'likeCount'>(
    'createdAt'
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryParams: IFlashcardListApiQuery = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder: 'desc',
    isPublic: true,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(subjectId ? { subjectId } : {}),
    ...(gradeLevel ? { gradeLevel: Number(gradeLevel) } : {}),
  };

  const { data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEY.FLASHCARD.LIST_SETS, queryParams],
    queryFn: () => ApiFlashcard.getFlashcardSetList(queryParams),
    placeholderData: (prev) => prev,
  });

  const sets = useMemo(() => data?.data ?? [], [data?.data]);
  const metadata = data?.metadata;
  const totalPages = metadata?.totalPages ?? 1;

  const { data: subjectsData } = useQuery({
    queryKey: [QUERY_KEY.SUBJECT.LIST_SUBJECTS],
    queryFn: () => ApiSubject.getSubjects({}),
  });

  const resetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSubjectId('');
    setGradeLevel('');
    setSortBy('createdAt');
    setPage(1);
  };

  const onFilter = (setter: (v: any) => void) => (v: any) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 px-4 py-8 md:px-6 lg:px-8">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-7 shadow-xl md:px-8 md:py-9">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
              <LayoutGrid size={14} />
              Thư viện Flashcard
            </p>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-4xl">
              Bộ thẻ của bạn
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/50 md:text-base">
              Quản lý và ôn tập flashcard thông minh. Tạo bộ thẻ mới bằng AI chỉ
              trong vài giây.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/app/chat')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Sparkles size={15} />
              Tạo bằng AI
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="rounded-2xl border bg-background p-5">
        <div className="flex flex-col gap-4">
          <label className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tiêu đề bộ thẻ..."
              className="w-full rounded-xl border bg-muted py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary focus:bg-background"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Select
              value={subjectId || '_all'}
              onValueChange={onFilter((v) =>
                setSubjectId(v === '_all' ? '' : v)
              )}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="_all">Tất cả môn</SelectItem>
                  {subjectsData?.data.map((s) => (
                    <SelectItem key={s.subjectId} value={s.subjectId}>
                      {s.subjectName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={gradeLevel || '_all'}
              onValueChange={onFilter((v) =>
                setGradeLevel(v === '_all' ? '' : v)
              )}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Khối lớp" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="_all">Tất cả lớp</SelectItem>
                  {GRADE_OPTIONS.map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      Lớp {g}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onFilter(setSortBy)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="createdAt">Mới nhất</SelectItem>
                  <SelectItem value="viewCount">Xem nhiều nhất</SelectItem>
                  <SelectItem value="likeCount">Yêu thích nhất</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Filter size={16} />
              Xóa bộ lọc
            </button>
          </div>

          {(debouncedSearch || subjectId || gradeLevel) && (
            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Đang lọc:
              </span>
              {debouncedSearch && (
                <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  &quot;{debouncedSearch}&quot;
                </span>
              )}
              {subjectId &&
                subjectsData?.data.find((s) => s.subjectId === subjectId) && (
                  <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {
                      subjectsData.data.find((s) => s.subjectId === subjectId)
                        ?.subjectName
                    }
                  </span>
                )}
              {gradeLevel && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Lớp {gradeLevel}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Grid ── */}
      {isPending ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <FlashcardSkeleton key={i} />
          ))}
        </section>
      ) : sets.length === 0 ? (
        <section className="flex flex-col items-center rounded-3xl border bg-background px-6 py-14 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="text-muted-foreground" size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Không tìm thấy bộ thẻ nào
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thử đổi từ khóa hoặc đặt lại bộ lọc.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            <Filter size={16} />
            Đặt lại bộ lọc
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickCreateCard onClick={() => navigate('/app/chat')} />

          {sets.map((set, i) => (
            <FlashcardCard
              key={set.id}
              set={set}
              index={i}
              onClick={() => navigate(`/app/flashcards/${set.id}`)}
            />
          ))}
        </section>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background px-5 py-3">
          <p className="text-sm font-medium text-muted-foreground">
            Trang {metadata?.page ?? page} / {totalPages}
            {isFetching && !isPending ? ' • Đang cập nhật...' : ''}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={(metadata?.page ?? page) <= 1}
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={(metadata?.page ?? page) >= totalPages}
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default FlashcardListPage;
