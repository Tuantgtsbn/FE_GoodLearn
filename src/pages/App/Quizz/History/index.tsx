import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import AnswerReviewModal from '@/pages/App/Quizz/DoExam/AnswerReviewModal';
import type { IExamHistoryApiQuery, IExamHistoryItem } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
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

const statusClassName = (attempt: IExamHistoryItem) => {
  if (attempt.status === 'IN_PROGRESS') {
    return 'bg-amber-50 text-amber-700 ring-amber-100';
  }

  if (attempt.isPassed === true) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }

  return 'bg-rose-50 text-rose-700 ring-rose-100';
};

const statusLabel = (attempt: IExamHistoryItem) => {
  if (attempt.status === 'IN_PROGRESS') return 'Đang làm dở';
  if (attempt.isPassed === true) return 'Đạt';
  return 'Chưa đạt';
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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <header className="mb-5 rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 px-5 py-5 text-white shadow-xl md:px-6">
        <button
          onClick={() => navigate('/app/quizz')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách đề thi
        </button>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black md:text-3xl">
              Lịch sử kết quả thi
            </h1>
            <p className="mt-1 text-sm text-slate-200">
              Theo dõi toàn bộ lượt làm bài đã nộp và mở nhanh phần xem đáp án
              chi tiết.
            </p>
          </div>

          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isFetching ? 'Đang đồng bộ...' : 'Làm mới'}
          </button>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-[2fr,1fr,1fr]">
        <label className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={searchQuizId}
            onChange={(event) => {
              setSearchQuizId(event.target.value);
              setPage(1);
            }}
            placeholder="Lọc theo quizId (UUID)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </label>

        <select
          value={attemptFilter}
          onChange={(event) => {
            setAttemptFilter(event.target.value as 'all' | 'passed' | 'failed');
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="all">Tất cả kết quả</option>
          <option value="passed">Chỉ bài đạt</option>
          <option value="failed">Chỉ bài chưa đạt</option>
        </select>

        <button
          onClick={clearFilters}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Xóa lọc
        </button>
      </section>

      {isPending ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <LoaderCircle className="animate-spin" size={20} />
            <span className="text-sm font-semibold">
              Đang tải lịch sử thi...
            </span>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">
            Không thể tải dữ liệu
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.
          </p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">
            Chưa có kết quả thi
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Sau khi hoàn thành bài thi, kết quả sẽ được hiển thị tại đây.
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          {historyItems.map((attempt) => (
            <article
              key={attempt.attemptId}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 md:text-lg">
                    {attempt.quiz.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Quiz ID: {attempt.quizId}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                      <Clock3 size={13} />
                      Nộp bài: {formatDateTime(attempt.completedAt)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">
                      Thời gian làm: {formatDuration(attempt.timeSpentSeconds)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">
                      Trả lời: {attempt.answerCount} câu
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <p className="text-2xl font-black text-indigo-700">
                    {attempt.score.toFixed(2)}
                    <span className="ml-1 text-base font-bold text-slate-500">
                      / 100
                    </span>
                  </p>
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1',
                      statusClassName(attempt)
                    )}
                  >
                    {attempt.isPassed ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <XCircle size={13} />
                    )}
                    {statusLabel(attempt)}
                  </span>

                  <button
                    onClick={() => setSelectedAttemptId(attempt.attemptId)}
                    className="mt-1 rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-600">
          Trang {metadata?.page || page} / {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={(metadata?.page || page) <= 1}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={(metadata?.page || page) >= totalPages}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </section>

      <AnswerReviewModal
        isOpen={Boolean(selectedAttemptId)}
        attemptId={selectedAttemptId}
        onClose={() => setSelectedAttemptId('')}
      />
    </div>
  );
};

export default ExamHistoryPage;
