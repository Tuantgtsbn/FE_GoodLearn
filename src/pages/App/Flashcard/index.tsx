import ApiFlashcard from '@/api/ApiFlashcard';
import QUERY_KEY from '@/api/QueryKey';
import type { IFlashcardListApiQuery, IFlashcardSetListItem } from '@/types/flashcard';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
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

const ITEMS_PER_PAGE = 12;
const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getSubjectColor = (colorHex: string | null, index: number): string => {
  if (colorHex) return colorHex;
  const DEFAULTS = [
    '#F97316', // orange
    '#3B82F6', // blue
    '#EC4899', // pink
    '#8B5CF6', // purple
    '#10B981', // emerald
    '#F59E0B', // amber
  ];
  return DEFAULTS[index % DEFAULTS.length];
};

const getStatusBadge = (status: IFlashcardSetListItem['generationStatus']) => {
  switch (status) {
    case 'COMPLETED':
      return null; // không hiển thị khi hoàn thành
    case 'PENDING':
      return { label: 'Đang xử lý', class: 'bg-amber-100 text-amber-700' };
    case 'IN_PROGRESS':
      return { label: 'Đang tạo', class: 'bg-blue-100 text-blue-700' };
    case 'FAILED':
      return { label: 'Lỗi', class: 'bg-red-100 text-red-700' };
    default:
      return null;
  }
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const FlashcardSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-200">
    <div className="mb-3 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-slate-200" />
      <div className="flex-1">
        <div className="mb-1 h-4 w-16 rounded bg-slate-200" />
        <div className="h-3 w-10 rounded bg-slate-100" />
      </div>
    </div>
    <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
    <div className="mb-1 h-4 w-full rounded bg-slate-100" />
    <div className="mb-5 h-4 w-2/3 rounded bg-slate-100" />
    <div className="flex gap-2">
      <div className="h-9 flex-1 rounded-xl bg-slate-200" />
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
      className="group relative flex cursor-pointer flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Options button (placeholder) */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white"
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
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Lớp {set.gradeLevel}
              </span>
            )}
            {set.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <Sparkles size={10} />
                Nổi bật
              </span>
            )}
            {statusBadge && (
              <span className={clsx('rounded-full px-2 py-0.5 text-xs font-semibold', statusBadge.class)}>
                {statusBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Title & description */}
      <h3 className="line-clamp-2 min-h-14 text-base font-extrabold text-slate-900">
        {set.title}
      </h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">
        {set.description || 'Bộ thẻ flashcard giúp bạn ôn tập hiệu quả.'}
      </p>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
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

      {/* Progress bar (color from accent) */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: set.cardCount > 0 ? '100%' : '0%', backgroundColor: accentColor, opacity: 0.6 }}
        />
      </div>

      {/* Author */}
      {set.user && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          {set.user.avatarUrl ? (
            <img
              src={set.user.avatarUrl}
              alt={set.user.fullName ?? 'avatar'}
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-500">
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
    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-slate-400 hover:bg-white hover:shadow-md"
  >
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
      <Plus size={22} className="text-slate-600" />
    </div>
    <p className="text-sm font-bold text-slate-800">Tạo bộ thẻ mới</p>
    <p className="mt-1 text-xs text-slate-500">
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
  const [sortBy, setSortBy] = useState<'createdAt' | 'viewCount' | 'likeCount'>('createdAt');
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

  const subjectOptions = useMemo(() => {
    const seen = new Map<string, { id: string; name: string }>();
    sets.forEach((s) => {
      if (s.subject?.subjectId) {
        seen.set(s.subject.subjectId, {
          id: s.subject.subjectId,
          name: s.subject.subjectName,
        });
      }
    });
    return Array.from(seen.values());
  }, [sets]);

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
    <div className="mx-auto w-full max-w-300 px-4 py-8 md:px-6 lg:px-8">

      {/* ─── Hero Banner ──────────────────────────────────────────────── */}
      <section className="mb-6 rounded-3xl bg-black px-6 py-7 text-white shadow-xl md:px-8 md:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <LayoutGrid size={14} />
              Thư viện Flashcard
            </p>
            <h1 className="text-2xl font-black tracking-tight md:text-4xl">
              Bộ thẻ của bạn
            </h1>
            <p className="mt-2 text-sm text-blue-50 md:text-base">
              Quản lý và ôn tập flashcard thông minh. Tạo bộ thẻ mới bằng AI chỉ trong vài giây.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/app/flashcards/create')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Sparkles size={15} />
              Tạo bằng AI
            </button>
          </div>
        </div>
      </section>

      {/* ─── Filter bar ───────────────────────────────────────────────── */}
      <section className="sticky top-2 z-20 mb-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur md:p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr,1fr,1fr,1fr]">
          {/* Search */}
          <label className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="flashcard-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Tìm theo tiêu đề bộ thẻ...'
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          {/* Subject */}
          <Select value={subjectId || '_all'} onValueChange={onFilter((v) => setSubjectId(v === '_all' ? '' : v))}>
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Môn học" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="_all">Tất cả môn</SelectItem>
                {subjectOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Grade */}
          <Select value={gradeLevel || '_all'} onValueChange={onFilter((v) => setGradeLevel(v === '_all' ? '' : v))}>
            <SelectTrigger className="w-full bg-white border-slate-300">
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

          {/* Sort */}
          <Select value={sortBy} onValueChange={onFilter(setSortBy)}>
            <SelectTrigger className="w-full bg-white border-slate-300">
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
        </div>

        {/* Active filters summary */}
        {(debouncedSearch || subjectId || gradeLevel || sortBy !== 'createdAt') && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Đang lọc:</span>
            {debouncedSearch && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                "{debouncedSearch}"
              </span>
            )}
            {subjectId && subjectOptions.find((s) => s.id === subjectId) && (
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                {subjectOptions.find((s) => s.id === subjectId)?.name}
              </span>
            )}
            {gradeLevel && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Lớp {gradeLevel}
              </span>
            )}
            <button
              onClick={resetFilters}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Xóa bộ lọc ×
            </button>
          </div>
        )}
      </section>

      {/* ─── Grid ─────────────────────────────────────────────────────── */}
      {isPending ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <FlashcardSkeleton key={i} />
          ))}
        </section>
      ) : sets.length === 0 ? (
        <section className="rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
          <BookOpen className="mx-auto mb-4 text-slate-300" size={52} />
          <h2 className="text-xl font-bold text-slate-800">Không tìm thấy bộ thẻ nào</h2>
          <p className="mt-2 text-sm text-slate-500">
            Thử đổi từ khóa hoặc đặt lại bộ lọc.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Đặt lại bộ lọc
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Quick create card — luôn ở đầu */}
          <QuickCreateCard onClick={() => navigate('/app/flashcards/create')} />

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

      {/* ─── Pagination ───────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-600">
            Trang {metadata?.page ?? page} / {totalPages}
            {isFetching && !isPending ? ' • Đang cập nhật...' : ''}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={(metadata?.page ?? page) <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={(metadata?.page ?? page) >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default FlashcardListPage;
