import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import type { IExamListApiQuery, IExamListItem } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpenText,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Filter,
  Flame,
  Search,
  Sparkles,
  Target,
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
type AccessFilter = 'ALL' | 'FREE' | 'PRO';

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

const getAccessType = (exam: IExamListItem): AccessFilter => {
  return exam.pointsToComplete > 0 ? 'PRO' : 'FREE';
};

const getAccessLabel = (access: AccessFilter) => {
  if (access === 'FREE') return 'Miễn phí';
  if (access === 'PRO') return 'Pro';
  return 'Tất cả';
};

const DifficultyBadge = ({ difficulty }: { difficulty: DifficultyFilter }) => {
  const colorClass =
    difficulty === 'EASY'
      ? 'bg-emerald-100 text-emerald-700'
      : difficulty === 'MEDIUM'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-rose-100 text-rose-700';

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
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('ALL');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('ALL');
  const [accessFilter, setAccessFilter] = useState<AccessFilter>('ALL');

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
      const matchesAccess =
        accessFilter === 'ALL' || getAccessType(exam) === accessFilter;

      return matchesDifficulty && matchesDuration && matchesAccess;
    });
  }, [accessFilter, difficultyFilter, durationFilter, exams]);

  const stats = useMemo(() => {
    const total = metadata?.totalItems || filteredExams.length;
    const freeCount = filteredExams.filter(
      (exam) => getAccessType(exam) === 'FREE'
    ).length;
    const attemptedCount = filteredExams.filter(
      (exam) => exam.attemptCount > 0
    ).length;
    const avgScore = filteredExams.length
      ? filteredExams.reduce((sum, exam) => sum + exam.averageScore, 0) /
        filteredExams.length
      : 0;

    return {
      total,
      freeCount,
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
    setAccessFilter('ALL');
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

  return (
    <div className="mx-auto w-full max-w-300 px-4 py-8 md:px-6 lg:px-8">
      <section className="mb-6 rounded-3xl bg-black px-6 py-7 text-white shadow-xl md:px-8 md:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles size={14} />
              Không gian luyện đề
            </p>
            <h1 className="text-2xl font-black tracking-tight md:text-4xl">
              Danh sách bài thi trắc nghiệm
            </h1>
            <p className="mt-2 text-sm text-blue-50 md:text-base">
              Kho đề đa môn, lọc nhanh theo mục tiêu học tập và bắt đầu luyện
              tập chỉ trong 1 chạm.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStartRandomExam}
              disabled={filteredExams.length === 0}
              className="rounded-2xl bg-white text-black px-5 py-2.5 text-sm font-bold text-back transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              Làm đề ngẫu nhiên
            </button>
            <button className="rounded-2xl border border-white/60 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
              Lịch sử làm bài
            </button>
          </div>
        </div>
      </section>

      <section className="sticky top-2 z-20 mb-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur md:p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr,1fr,1fr,1fr,1fr]">
          <label className="relative">
            <Search
              className={clsx(
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400',
                {
                  hidden: !isOpenFilter,
                }
              )}
              size={18}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên đề, môn học, từ khóa..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <div className={` ${isOpenFilter ? 'block' : 'hidden'}`}>
            <Select
              value={subjectId || '_all'}
              onValueChange={onFilter((v) =>
                setSubjectId(v === '_all' ? '' : v)
              )}
            >
              <SelectTrigger className="w-full bg-white border-slate-300">
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
          </div>

          <div className={` ${isOpenFilter ? 'block' : 'hidden'}`}>
            <Select
              value={gradeLevel}
              onValueChange={onSelectFilter(setGradeLevel)}
            >
              <SelectTrigger className="w-full bg-white border-slate-300">
                <SelectValue placeholder="Lớp" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-full">
                <SelectGroup>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(
                    (gradeLevel) => (
                      <SelectItem key={gradeLevel} value={gradeLevel + ''}>
                        Lớp {gradeLevel}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className={` ${isOpenFilter ? 'block' : 'hidden'}`}>
            <Select
              value={isFeatured}
              onValueChange={onSelectFilter(setIsFeatured)}
            >
              <SelectTrigger className="w-full bg-white border-slate-300">
                <SelectValue placeholder="Đề nổi bật" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-full">
                <SelectGroup>
                  <SelectItem value="all">Đề nổi bật</SelectItem>
                  <SelectItem value="true">Chỉ đề nổi bật</SelectItem>
                  <SelectItem value="false">Đề thường</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <button
              onClick={resetFilters}
              className={clsx(
                'inline-flex items-center w-full mt-[12px] justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50',
                {
                  hidden: !isOpenFilter,
                }
              )}
            >
              <Filter size={16} />
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {getDifficultyLabel(option)}
              </button>
            )
          )}

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
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {getDurationLabel(option)}
              </button>
            )
          )}

          {(['ALL', 'FREE', 'PRO'] as AccessFilter[]).map((option) => (
            <button
              key={option}
              onClick={() => {
                setAccessFilter(option);
                setPage(1);
              }}
              className={clsx(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                accessFilter === option
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {getAccessLabel(option)}
            </button>
          ))}
        </div>
        <div className="w-full flex justify-center mt-[30px]">
          <button onClick={() => setIsOpenFilter((prev) => !prev)} className="">
            {isOpenFilter ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border border-l-4 border-l-blue-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tổng đề
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border border-l-4 border-l-green-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Đề miễn phí
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">
            {stats.freeCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border border-l-4 border-l-red-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Đề đã có lượt làm
          </p>
          <p className="mt-2 text-2xl font-extrabold text-blue-700">
            {stats.attemptedCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border border-l-4 border-l-yellow-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Điểm TB
          </p>
          <p className="mt-2 text-2xl font-extrabold text-indigo-700">
            {stats.avgScore.toFixed(1)}%
          </p>
        </div>
      </section>

      {isPending ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-200"
            >
              <div className="mb-3 h-5 w-24 rounded bg-slate-200" />
              <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mb-1 h-4 w-full rounded bg-slate-100" />
              <div className="mb-5 h-4 w-2/3 rounded bg-slate-100" />
              <div className="mb-4 h-10 rounded bg-slate-100" />
              <div className="h-10 rounded bg-slate-200" />
            </div>
          ))}
        </section>
      ) : filteredExams.length === 0 ? (
        <section className="rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-slate-200">
          <BookOpenText className="mx-auto mb-4 text-slate-400" size={44} />
          <h2 className="text-xl font-bold text-slate-900">
            Không tìm thấy đề phù hợp
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Hãy thử đổi từ khóa hoặc đặt lại bộ lọc để xem thêm đề thi.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Đặt lại bộ lọc
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredExams.map((exam) => {
            const difficulty = getDifficulty(exam);
            const accessType = getAccessType(exam);
            const completionProgress =
              exam.attemptCount > 0
                ? Math.min(100, Math.round(exam.averageScore))
                : 0;

            return (
              <article
                key={exam.id}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {exam.subject?.subjectName || 'Đa môn'}
                  </span>
                  <DifficultyBadge difficulty={difficulty} />
                  {accessType === 'PRO' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      <Flame size={12} />
                      Pro
                    </span>
                  )}
                </div>

                <h3 className="line-clamp-2 min-h-13 text-lg font-extrabold text-slate-900">
                  {exam.title}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10.5 text-sm text-slate-600">
                  {exam.description ||
                    'Bộ đề tổng hợp giúp bạn luyện tập nhanh và kiểm tra mức độ nắm vững kiến thức.'}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
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
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Tiến độ gần nhất</span>
                      <span>{completionProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${completionProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => goToDoExam(exam)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <Sparkles size={16} />
                    Bắt đầu làm bài
                  </button>
                  <button
                    onClick={() => goToLeaderboard(exam)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-blue-50"
                  >
                    BXH
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
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
            Prev
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={(metadata?.page || page) >= totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuizzListPage;
