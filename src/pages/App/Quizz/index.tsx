import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import type { IExamListApiQuery, IExamListItem } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpenText,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Layers,
  Search,
  Sparkles,
  Target,
  Trophy,
  Users,
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

const ITEMS_PER_PAGE = 9;

type DifficultyFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';
type DurationFilter = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';

const formatMinutes = (seconds: number | null) => {
  if (!seconds || seconds <= 0) {
    return 'Không giới hạn';
  }

  return `${Math.ceil(seconds / 60)} phút`;
};

const getDifficulty = (exam: IExamListItem): DifficultyFilter => {
  const questionCount = exam.questionCount || 0;
  const duration = exam.timeLimit || 0;

  if (questionCount <= 20 && duration <= 900) {
    return 'EASY';
  }

  if (questionCount <= 35 && duration <= 1800) {
    return 'MEDIUM';
  }

  return 'HARD';
};

const getDifficultyLabel = (difficulty: DifficultyFilter) => {
  if (difficulty === 'EASY') return 'Dễ';
  if (difficulty === 'MEDIUM') return 'Trung bình';
  if (difficulty === 'HARD') return 'Khó';
  return 'Tất cả';
};

const getDurationBucket = (seconds: number | null): DurationFilter => {
  if (!seconds || seconds <= 900) {
    return 'SHORT';
  }

  if (seconds <= 1800) {
    return 'MEDIUM';
  }

  return 'LONG';
};

const getDurationLabel = (bucket: DurationFilter) => {
  if (bucket === 'SHORT') return '<= 15p';
  if (bucket === 'MEDIUM') return '15-30p';
  if (bucket === 'LONG') return '> 30p';
  return 'Tất cả';
};

const DifficultyBadge = ({ difficulty }: { difficulty: DifficultyFilter }) => {
  const colorClass =
    difficulty === 'EASY'
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : difficulty === 'MEDIUM'
        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400';

  return (
    <span
      className={clsx(
        'rounded-full px-2.5 py-1 text-xs font-semibold',
        colorClass
      )}
    >
      {getDifficultyLabel(difficulty)}
    </span>
  );
};

const QuizzListPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [isFeatured, setIsFeatured] = useState<string>('all');

  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('ALL');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('ALL');

  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const queryParams: IExamListApiQuery = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(subjectId ? { subjectId } : {}),
    ...(gradeLevel ? { gradeLevel: Number(gradeLevel) } : {}),
    ...(isFeatured === 'true' ? { isFeatured: true } : {}),
    ...(isFeatured === 'false' ? { isFeatured: false } : {}),
  };

  const { data, isPending, isFetching } = useQuery({
    queryKey: [QUERY_KEY.EXAM.LIST_EXAMS, queryParams],
    queryFn: () => ApiExam.getExamList(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const exams = useMemo(() => data?.data ?? [], [data?.data]);
  const metadata = data?.metadata;

  const { data: subjectsData } = useQuery({
    queryKey: [QUERY_KEY.SUBJECT.LIST_SUBJECTS],
    queryFn: () => ApiSubject.getSubjects({}),
  });

  const onFilter = (setter: (v: any) => void) => (v: any) => {
    setter(v);
    setPage(1);
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesDifficulty =
        difficultyFilter === 'ALL' || getDifficulty(exam) === difficultyFilter;
      const matchesDuration =
        durationFilter === 'ALL' ||
        getDurationBucket(exam.timeLimit) === durationFilter;

      return matchesDifficulty && matchesDuration;
    });
  }, [difficultyFilter, durationFilter, exams]);

  const stats = useMemo(() => {
    const total = metadata?.totalItems || filteredExams.length;
    const attemptedCount = filteredExams.filter(
      (exam) => exam.attemptCount > 0
    ).length;
    const avgScore = filteredExams.length
      ? filteredExams.reduce((sum, exam) => sum + exam.averageScore, 0) /
        filteredExams.length
      : 0;

    return {
      total,
      attemptedCount,
      avgScore,
    };
  }, [filteredExams, metadata?.totalItems]);

  const totalPages = metadata?.totalPages || 1;

  const resetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSubjectId('');
    setGradeLevel('');
    setIsFeatured('all');
    setDifficultyFilter('ALL');
    setDurationFilter('ALL');
    setPage(1);
  };

  const onSelectFilter = (setter: (value: any) => void) => (value: any) => {
    setter(value);
    setPage(1);
  };

  const goToDoExam = (exam: IExamListItem) => {
    navigate(`/app/quizz/${exam.id}/do`, {
      state: {
        examTitle: exam.title,
      },
    });
  };

  const goToLeaderboard = (exam: IExamListItem) => {
    navigate(`/app/quizz/${exam.id}/leaderboard`, {
      state: {
        examTitle: exam.title,
        from: 'quizz_list',
      },
    });
  };

  const onStartRandomExam = () => {
    if (filteredExams.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredExams.length);
    const selectedExam = filteredExams[randomIndex];
    goToDoExam(selectedExam);
  };

  const goToHistory = () => {
    navigate('/app/quizz/history');
  };

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 px-4 py-8 md:px-6 lg:px-8">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-8 shadow-xl md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
              <Sparkles size={14} />
              Không gian luyện đề
            </p>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-4xl">
              Danh sách bài thi trắc nghiệm
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/50 md:text-base">
              Kho đề đa môn, lọc nhanh theo mục tiêu học tập và bắt đầu luyện
              tập chỉ trong 1 chạm.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStartRandomExam}
              disabled={filteredExams.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={16} />
              Làm đề ngẫu nhiên
            </button>
            <button
              onClick={goToHistory}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Clock3 size={16} />
              Lịch sử làm bài
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
              placeholder="Tìm theo tên đề, môn học, từ khóa..."
              className="w-full rounded-xl border bg-muted py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary focus:bg-background"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              value={gradeLevel}
              onValueChange={onSelectFilter(setGradeLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lớp" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <SelectItem key={grade} value={grade + ''}>
                      Lớp {grade}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={isFeatured}
              onValueChange={onSelectFilter(setIsFeatured)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Loại đề" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="all">Tất cả đề</SelectItem>
                  <SelectItem value="true">Đề nổi bật</SelectItem>
                  <SelectItem value="false">Đề thường</SelectItem>
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

          <div className="flex flex-wrap items-center gap-2 border-t pt-4">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Độ khó
            </span>
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as DifficultyFilter[]).map(
              (option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDifficultyFilter(option);
                    setPage(1);
                  }}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    difficultyFilter === option
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-accent'
                  )}
                >
                  {getDifficultyLabel(option)}
                </button>
              )
            )}

            <span className="ml-3 mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Thời lượng
            </span>
            {(['ALL', 'SHORT', 'MEDIUM', 'LONG'] as DurationFilter[]).map(
              (option) => (
                <button
                  key={option}
                  onClick={() => {
                    setDurationFilter(option);
                    setPage(1);
                  }}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    durationFilter === option
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-accent'
                  )}
                >
                  {getDurationLabel(option)}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="flex flex-wrap divide-x divide-border overflow-hidden rounded-2xl border bg-background">
        <div className="flex flex-1 items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tổng đề
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {stats.total}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <Trophy size={20} className="text-destructive" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Đã có lượt làm
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {stats.attemptedCount}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
            <ChartNoAxesCombined size={20} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Điểm TB
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {stats.avgScore.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      {isPending ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-2xl border bg-background p-5"
            >
              <div className="mb-3 h-5 w-24 rounded bg-muted" />
              <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
              <div className="mb-1 h-4 w-full rounded bg-muted" />
              <div className="mb-5 h-4 w-2/3 rounded bg-muted" />
              <div className="mb-4 h-10 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
            </div>
          ))}
        </section>
      ) : filteredExams.length === 0 ? (
        <section className="flex flex-col items-center rounded-3xl border bg-background px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BookOpenText className="text-muted-foreground" size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Không tìm thấy đề phù hợp
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Hãy thử đổi từ khóa hoặc đặt lại bộ lọc để xem thêm đề thi.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Filter size={16} />
            Đặt lại bộ lọc
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredExams.map((exam) => {
            const difficulty = getDifficulty(exam);
            const completionProgress =
              exam.attemptCount > 0
                ? Math.min(100, Math.round(exam.averageScore))
                : 0;

            return (
              <article
                key={exam.id}
                className="group flex flex-col rounded-2xl border bg-background p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    {exam.subject?.subjectName || 'Đa môn'}
                  </span>
                  <DifficultyBadge difficulty={difficulty} />
                </div>

                <h3 className="line-clamp-2 min-h-13 text-lg font-extrabold text-foreground">
                  {exam.title}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10.5 text-sm text-muted-foreground">
                  {exam.description ||
                    'Bộ đề tổng hợp giúp bạn luyện tập nhanh và kiểm tra mức độ nắm vững kiến thức.'}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-1.5 font-medium">
                    <Target size={14} /> {exam.questionCount} câu
                  </p>
                  <p className="inline-flex items-center gap-1.5 font-medium">
                    <Clock3 size={14} /> {formatMinutes(exam.timeLimit)}
                  </p>
                  <p className="inline-flex items-center gap-1.5 font-medium">
                    <Users size={14} /> {exam.attemptCount} lượt làm
                  </p>
                  <p className="inline-flex items-center gap-1.5 font-medium">
                    <ChartNoAxesCombined size={14} />{' '}
                    {exam.averageScore.toFixed(1)}%
                  </p>
                </div>

                {exam.attemptCount > 0 && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>Tiến độ gần nhất</span>
                      <span>{completionProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${completionProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center gap-2 pt-5">
                  <button
                    onClick={() => goToDoExam(exam)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    <Sparkles size={16} />
                    Bắt đầu làm bài
                  </button>
                  <button
                    onClick={() => goToLeaderboard(exam)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    BXH
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ── Pagination ── */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background px-5 py-3">
        <p className="text-sm font-medium text-muted-foreground">
          Trang {metadata?.page || page} / {totalPages}
          {isFetching && !isPending ? (
            <span className="ml-1 text-muted-foreground/60">
              • Đang cập nhật...
            </span>
          ) : (
            ''
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={(metadata?.page || page) <= 1}
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Trước
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={(metadata?.page || page) >= totalPages}
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuizzListPage;
