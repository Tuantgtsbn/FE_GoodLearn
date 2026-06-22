import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnswerReviewModal from '@/pages/App/Quizz/DoExam/AnswerReviewModal';
import type { IExamHistoryApiQuery, IExamHistoryItem } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  LoaderCircle,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const formatDateTime = (isoDate: string | null) => {
  if (!isoDate) return '--';

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

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds <= 0) return '--';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}p ${secs}s`;
};

const StatusBadge = ({ attempt }: { attempt: IExamHistoryItem }) => {
  const isPassed = attempt.isPassed === true;
  const isInProgress = attempt.status === 'IN_PROGRESS';

  const baseClasses =
    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold';

  if (isInProgress) {
    return (
      <span
        className={clsx(
          baseClasses,
          'bg-amber-500/15 text-amber-600 dark:text-amber-400'
        )}
      >
        <Clock3 size={12} />
        Đang làm dở
      </span>
    );
  }

  if (isPassed) {
    return (
      <span
        className={clsx(
          baseClasses,
          'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
        )}
      >
        <CheckCircle2 size={12} />
        Đạt
      </span>
    );
  }

  return (
    <span className={clsx(baseClasses, 'bg-destructive/15 text-destructive')}>
      <XCircle size={12} />
      Chưa đạt
    </span>
  );
};

const ExamHistoryPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchQuizId, setSearchQuizId] = useState('');
  const [attemptFilter, setAttemptFilter] = useState<
    'all' | 'passed' | 'failed'
  >('all');
  const [selectedAttemptId, setSelectedAttemptId] = useState('');

  const queryParams: IExamHistoryApiQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isCompleted: true,
      ...(attemptFilter === 'passed' ? { isPassed: true } : {}),
      ...(attemptFilter === 'failed' ? { isPassed: false } : {}),
      ...(searchQuizId.trim() ? { quizId: searchQuizId.trim() } : {}),
    }),
    [attemptFilter, page, searchQuizId]
  );

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEY.EXAM.HISTORY, queryParams],
    queryFn: () => ApiExam.getMyExamHistory(queryParams),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const historyItems = data?.data || [];
  const metadata = data?.metadata;

  const totalPages = metadata?.totalPages || 1;

  const clearFilters = () => {
    setSearchQuizId('');
    setAttemptFilter('all');
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-6">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-7 shadow-xl md:px-8 md:py-9">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/8" />
        <div className="relative">
          <button
            onClick={() => navigate('/app/quizz')}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách đề thi
          </button>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white md:text-3xl">
                Lịch sử kết quả thi
              </h1>
              <p className="mt-2 max-w-lg text-sm text-white/50 md:text-base">
                Theo dõi toàn bộ lượt làm bài đã nộp và xem đáp án chi tiết.
              </p>
            </div>

            <button
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60"
            >
              <RotateCcw
                size={16}
                className={clsx(isFetching && 'animate-spin')}
              />
              {isFetching ? 'Đang đồng bộ...' : 'Làm mới'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="rounded-2xl border bg-background p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr,1fr,auto]">
          <label className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchQuizId}
              onChange={(event) => {
                setSearchQuizId(event.target.value);
                setPage(1);
              }}
              placeholder="Lọc theo mã đề (UUID)"
              className="w-full rounded-xl border bg-muted py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-primary focus:bg-background"
            />
          </label>

          <Select
            value={attemptFilter}
            onValueChange={(value) => {
              setAttemptFilter(value as 'all' | 'passed' | 'failed');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="passed">Bài đạt</SelectItem>
                <SelectItem value="failed">Bài chưa đạt</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={16} />
            Xóa lọc
          </button>
        </div>
      </section>

      {/* ── Content ── */}
      {isPending ? (
        <section className="flex items-center justify-center gap-3 rounded-2xl border bg-background px-6 py-12">
          <LoaderCircle
            className="animate-spin text-muted-foreground"
            size={20}
          />
          <span className="text-sm font-semibold text-muted-foreground">
            Đang tải lịch sử thi...
          </span>
        </section>
      ) : isError ? (
        <section className="flex flex-col items-center rounded-2xl border bg-background px-6 py-12 text-center">
          <XCircle size={36} className="mb-3 text-destructive" />
          <p className="text-base font-bold text-foreground">
            Không thể tải dữ liệu
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Thử lại
          </button>
        </section>
      ) : historyItems.length === 0 ? (
        <section className="flex flex-col items-center rounded-2xl border bg-background px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Clock3 size={22} className="text-muted-foreground" />
          </div>
          <p className="text-base font-bold text-foreground">
            Chưa có kết quả thi
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sau khi hoàn thành bài thi, kết quả sẽ được hiển thị tại đây.
          </p>
        </section>
      ) : (
        <section className="space-y-3">
          {historyItems.map((attempt) => (
            <article
              key={attempt.attemptId}
              className="rounded-2xl border bg-background p-5 transition hover:shadow-md hover:shadow-foreground/5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-extrabold text-foreground md:text-lg">
                    {attempt.quiz.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Mã đề: {attempt.quizId}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      <Clock3 size={12} />
                      Nộp: {formatDateTime(attempt.completedAt)}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      {formatDuration(attempt.timeSpentSeconds)}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      {attempt.answerCount} câu
                    </span>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-4 md:flex-col md:items-end">
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">
                      {attempt.score.toFixed(2)}
                      <span className="ml-1 text-sm font-semibold text-muted-foreground">
                        / 100
                      </span>
                    </p>
                  </div>

                  <StatusBadge attempt={attempt} />

                  <button
                    onClick={() => setSelectedAttemptId(attempt.attemptId)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    <Eye size={14} />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background px-5 py-3">
          <p className="text-sm font-medium text-muted-foreground">
            Trang {metadata?.page || page} / {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={(metadata?.page || page) <= 1}
              className="rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={(metadata?.page || page) >= totalPages}
              className="rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </section>
      )}

      <AnswerReviewModal
        isOpen={Boolean(selectedAttemptId)}
        attemptId={selectedAttemptId}
        onClose={() => setSelectedAttemptId('')}
      />
    </div>
  );
};

export default ExamHistoryPage;
