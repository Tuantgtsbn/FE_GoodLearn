import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCcw,
  Trophy,
} from 'lucide-react';

import ApiSong, {
  type IUserSongHistoryQuery,
  type SongHistoryItem,
} from '@/api/ApiSong';
import QUERY_KEY from '@/api/QueryKey';
import { useDialog } from '@/context/DialogContext';
import SongHistoryDetailModal from './SongHistoryDetailModal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE = 10;

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '--';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const statusBadge = (status: SongHistoryItem['status']) => {
  if (status === 'COMPLETED') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }
  if (status === 'FAILED') {
    return 'bg-rose-50 text-rose-700 ring-rose-100';
  }
  return 'bg-amber-50 text-amber-700 ring-amber-100';
};

const statusLabel = (status: SongHistoryItem['status']) => {
  if (status === 'COMPLETED') return 'Hoàn tất';
  if (status === 'FAILED') return 'Thất bại';
  return 'Đang xử lý';
};

const formatScore = (score: number | null) => {
  if (score === null || score === undefined) return '--';
  return score.toFixed(1);
};

export default function SongHistoryPage() {
  const navigate = useNavigate();
  const { createDialog } = useDialog();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | SongHistoryItem['status']
  >('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalScore'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const queryParams: IUserSongHistoryQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sortBy,
      sortOrder,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    }),
    [page, sortBy, sortOrder, statusFilter]
  );

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEY.SONG.HISTORY, queryParams],
    queryFn: () => ApiSong.getUserSongHistory(queryParams),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const historyItems = data?.data ?? [];
  const metadata = data?.metadata;
  const totalPages = metadata?.totalPages || 1;

  const openDetail = (score: SongHistoryItem) => {
    createDialog(SongHistoryDetailModal, { score }, 'exclusive');
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <header className="mb-5 rounded-3xl border border-slate-100 bg-white px-5 py-5 shadow-sm md:px-6">
        <button
          onClick={() => navigate('/app/songs')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Quay lại Karaoke
        </button>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Lịch sử karaoke
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              Lịch sử hát karaoke
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Tổng hợp toàn bộ lần bạn đã hát và điểm AI chấm.
            </p>
          </div>

          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            {isFetching ? 'Dang dong bo...' : 'Lam moi'}
          </button>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1fr,1fr,auto]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as 'all' | SongHistoryItem['status']);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as 'createdAt' | 'totalScore');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="createdAt">Mới nhất</SelectItem>
                <SelectItem value="totalScore">Điểm cao nhất</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={sortOrder}
          onValueChange={(value) => {
            setSortOrder(value as 'asc' | 'desc');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full bg-white border-slate-300">
            <SelectValue placeholder="Thứ tự" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="desc">Giảm dần</SelectItem>
              <SelectItem value="asc">Tăng dần</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <button
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Đặt lại bộ lọc
        </button>
      </section>

      {isPending ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <LoaderCircle className="animate-spin" size={20} />
            <span className="text-sm font-semibold">Đang tải lịch sử...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">
            Không thể tải lịch sử hát
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Vui lòng thử lại hoặc kiểm tra kết nối.
          </p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">
            Chưa có lần hát nào
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Thử thử thách một bài karaoke và điểm sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          {historyItems.map((score) => (
            <article
              key={score.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 md:text-lg">
                    {score.song.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {score.song.artists?.join(', ') || 'Nghệ sĩ chưa cập nhật'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <Calendar size={12} />
                      {formatDateTime(score.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <Trophy size={12} />
                      Hạng: {score.grade || '--'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <p className="text-2xl font-black text-slate-900">
                    {formatScore(score.totalScore)}
                    <span className="ml-1 text-base font-bold text-slate-400">
                      / 100
                    </span>
                  </p>
                  <span
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1',
                      statusBadge(score.status),
                    ].join(' ')}
                  >
                    {statusLabel(score.status)}
                  </span>

                  <button
                    onClick={() => openDetail(score)}
                    className="mt-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-600">
            Trang {metadata?.page || page} / {totalPages}
            {isFetching && !isPending ? ' • Đang cập nhật...' : ''}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={(metadata?.page || page) <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={(metadata?.page || page) >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
