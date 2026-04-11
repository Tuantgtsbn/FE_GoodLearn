import ApiExam from '@/api/ApiExam';
import type {
  IExamAnswersMap,
  IExamQuestion,
  IStartExamResponse,
  ISubmitExamResponse,
} from '@/types/exam';
import {
  AlarmClock,
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock3,
  Flag,
  Info,
  LoaderCircle,
  Send,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type PendingSaveEntry = {
  questionId: string;
  selectedOptions: string[];
};

type MarkedQuestionMap = Record<string, true>;

type PersistedAttemptSnapshot = {
  attemptId: string;
  answers: IExamAnswersMap;
  markedQuestionIds?: string[];
  updatedAt: string;
};

type DoExamLocationState = {
  examTitle?: string;
};

const AUTOSAVE_DEBOUNCE_MS = 400;

const isMultipleChoice = (questionType: string) => {
  return questionType.toLowerCase().includes('multiple');
};

const STORAGE_KEY_PREFIX = 'goodlearn:exam:attempt:';

const formatTime = (seconds: number | null) => {
  if (seconds === null || Number.isNaN(seconds)) {
    return '--:--';
  }

  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const getPersistKey = (quizId: string) => `${STORAGE_KEY_PREFIX}${quizId}`;

const DoExamPage = () => {
  const navigate = useNavigate();
  const { quizId = '' } = useParams();
  const { state } = useLocation();
  const locationState = state as DoExamLocationState | null;

  const [attempt, setAttempt] = useState<IStartExamResponse | null>(null);
  const [answers, setAnswers] = useState<IExamAnswersMap>({});
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestionMap>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ISubmitExamResponse | null>(
    null
  );

  const saveTimersRef = useRef<Record<string, number>>({});
  const pendingSavesRef = useRef<Record<string, PendingSaveEntry>>({});
  const isSubmitTriggeredRef = useRef(false);

  const questions = attempt?.questions || [];
  const totalQuestions = questions.length;

  const currentQuestion = questions[currentQuestionIndex];

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((selected) => selected.length > 0)
      .length;
  }, [answers]);

  const markedCount = useMemo(() => {
    return Object.keys(markedQuestions).length;
  }, [markedQuestions]);

  const examTitle =
    locationState?.examTitle ||
    (quizId ? `Đề thi #${quizId.slice(0, 8).toUpperCase()}` : 'Bài thi');

  const progressPercent = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const persistSnapshot = useCallback(
    (
      attemptId: string,
      nextAnswers: IExamAnswersMap,
      nextMarkedQuestions: MarkedQuestionMap
    ) => {
      if (!quizId) {
        return;
      }

      const key = getPersistKey(quizId);
      const snapshot: PersistedAttemptSnapshot = {
        attemptId,
        answers: nextAnswers,
        markedQuestionIds: Object.keys(nextMarkedQuestions),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(snapshot));
    },
    [quizId]
  );

  const clearSnapshot = useCallback(() => {
    if (!quizId) {
      return;
    }

    localStorage.removeItem(getPersistKey(quizId));
  }, [quizId]);

  const saveAnswerNow = useCallback(
    async (questionId: string, selectedOptions: string[]) => {
      if (!attempt?.attemptId || submitResult) {
        return;
      }

      try {
        await ApiExam.saveExamAnswer({
          attemptId: attempt.attemptId,
          questionId,
          selectedOptions,
        });

        delete pendingSavesRef.current[questionId];
      } catch {
        pendingSavesRef.current[questionId] = {
          questionId,
          selectedOptions,
        };
      }
    },
    [attempt?.attemptId, submitResult]
  );

  const scheduleSave = useCallback(
    (questionId: string, selectedOptions: string[]) => {
      if (saveTimersRef.current[questionId]) {
        window.clearTimeout(saveTimersRef.current[questionId]);
      }

      pendingSavesRef.current[questionId] = { questionId, selectedOptions };

      saveTimersRef.current[questionId] = window.setTimeout(() => {
        void saveAnswerNow(questionId, selectedOptions);
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [saveAnswerNow]
  );

  const flushPendingSaves = useCallback(async () => {
    Object.values(saveTimersRef.current).forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    saveTimersRef.current = {};

    const pendingEntries = Object.values(pendingSavesRef.current);
    if (pendingEntries.length === 0) {
      return;
    }

    await Promise.all(
      pendingEntries.map((entry) =>
        saveAnswerNow(entry.questionId, entry.selectedOptions)
      )
    );
  }, [saveAnswerNow]);

  const startExam = useCallback(async () => {
    if (!quizId) {
      toast.error('Không tìm thấy mã đề thi');
      navigate('/app/quizz');
      return;
    }

    setIsLoadingExam(true);

    try {
      const startData = await ApiExam.startExam({ quizId });

      let mergedAnswers = startData.answers;
      let mergedMarkedQuestions: MarkedQuestionMap = {};
      const rawPersisted = localStorage.getItem(getPersistKey(quizId));

      if (rawPersisted) {
        try {
          const persisted = JSON.parse(
            rawPersisted
          ) as PersistedAttemptSnapshot;

          if (
            persisted.attemptId &&
            persisted.attemptId === startData.attemptId &&
            persisted.answers
          ) {
            mergedAnswers = {
              ...startData.answers,
              ...persisted.answers,
            };

            const questionIdSet = new Set(
              startData.questions.map((item) => item.id)
            );
            mergedMarkedQuestions = (
              persisted.markedQuestionIds || []
            ).reduce<MarkedQuestionMap>((acc, questionId) => {
              if (questionIdSet.has(questionId)) {
                acc[questionId] = true;
              }
              return acc;
            }, {});
          }
        } catch {
          localStorage.removeItem(getPersistKey(quizId));
        }
      }

      setAttempt(startData);
      setAnswers(mergedAnswers);
      setMarkedQuestions(mergedMarkedQuestions);
      setTimeLeftSeconds(startData.timeLeftSeconds);
      persistSnapshot(
        startData.attemptId,
        mergedAnswers,
        mergedMarkedQuestions
      );
    } catch {
      toast.error('Không thể bắt đầu bài thi. Vui lòng thử lại.');
      navigate('/app/quizz');
    } finally {
      setIsLoadingExam(false);
    }
  }, [quizId, navigate, persistSnapshot]);

  const handleSelectOption = (
    question: IExamQuestion,
    optionLabel: string,
    checked: boolean
  ) => {
    if (!attempt?.attemptId || submitResult || isSubmitting) {
      return;
    }

    const isMultiple = isMultipleChoice(question.questionType);

    setAnswers((prev) => {
      const current = prev[question.id] || [];
      let nextSelected: string[];

      if (isMultiple) {
        if (checked) {
          nextSelected = Array.from(new Set([...current, optionLabel]));
        } else {
          nextSelected = current.filter((item) => item !== optionLabel);
        }
      } else {
        nextSelected = checked ? [optionLabel] : [];
      }

      const nextAnswers = {
        ...prev,
        [question.id]: nextSelected,
      };

      persistSnapshot(attempt.attemptId, nextAnswers, markedQuestions);
      scheduleSave(question.id, nextSelected);

      return nextAnswers;
    });
  };

  const handleToggleMarkForReview = useCallback(
    (questionId: string) => {
      if (!attempt?.attemptId || submitResult || isSubmitting) {
        return;
      }

      setMarkedQuestions((prev) => {
        const nextMarkedQuestions = { ...prev };

        if (nextMarkedQuestions[questionId]) {
          delete nextMarkedQuestions[questionId];
        } else {
          nextMarkedQuestions[questionId] = true;
        }

        persistSnapshot(attempt.attemptId, answers, nextMarkedQuestions);
        return nextMarkedQuestions;
      });
    },
    [attempt?.attemptId, submitResult, isSubmitting, persistSnapshot, answers]
  );

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (!attempt?.attemptId || isSubmitting || isSubmitTriggeredRef.current) {
        return;
      }

      isSubmitTriggeredRef.current = true;
      setIsSubmitting(true);

      try {
        await flushPendingSaves();
        const result = await ApiExam.submitExam({
          attemptId: attempt.attemptId,
        });
        setSubmitResult(result);
        clearSnapshot();
        if (isAutoSubmit) {
          toast.info('Đã hết thời gian. Hệ thống đã tự động nộp bài.');
        } else {
          toast.success('Nộp bài thành công.');
        }
      } catch {
        toast.error('Nộp bài thất bại. Vui lòng thử lại.');
        isSubmitTriggeredRef.current = false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [attempt?.attemptId, isSubmitting, flushPendingSaves, clearSnapshot]
  );

  useEffect(() => {
    void startExam();
  }, [startExam]);

  useEffect(() => {
    if (submitResult || timeLeftSeconds === null || isSubmitting) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev === null) {
          return null;
        }

        if (prev <= 1) {
          window.clearInterval(timerId);
          void handleSubmit(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [submitResult, isSubmitting, timeLeftSeconds, handleSubmit]);

  useEffect(() => {
    if (!attempt?.attemptId || submitResult) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attempt?.attemptId, submitResult]);

  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  if (isLoadingExam) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-slate-700 shadow-sm ring-1 ring-slate-200">
          <LoaderCircle className="animate-spin" size={20} />
          <span className="font-semibold">Đang tải bài thi...</span>
        </div>
      </div>
    );
  }

  if (!attempt || totalQuestions === 0 || !currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Không có dữ liệu bài thi
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Không thể tải câu hỏi cho đề thi này. Vui lòng quay lại danh sách
            đề.
          </p>
          <button
            onClick={() => navigate('/app/quizz')}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] px-4 py-6 md:px-6">
      <header className="mb-5 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={() => navigate('/app/quizz')}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft size={16} />
              Quay lại danh sách
            </button>
            <h1 className="text-xl font-black text-slate-900 md:text-2xl">
              {examTitle}
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-md bg-gray-200 text-black px-4 py-2 border border-gray-500">
              <AlarmClock size={18} />
              <span className="text-lg font-bold tabular-nums">
                {formatTime(timeLeftSeconds)}
              </span>
            </div>

            <button
              onClick={() => void handleSubmit(false)}
              disabled={isSubmitting || submitResult !== null}
              className="inline-flex cursor-pointer hover:bg-gray-900 items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 text-sm font-bold transition  disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-[1fr_400px]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-background bg-foreground">
              <Clock3 size={14} />
              Câu {currentQuestionIndex + 1} / {totalQuestions}
            </p>

            <div className="mb-4">
              <button
                type="button"
                onClick={() => handleToggleMarkForReview(currentQuestion.id)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                  markedQuestions[currentQuestion.id]
                    ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <Flag size={15} />
                {markedQuestions[currentQuestion.id]
                  ? 'Bỏ đánh dấu xem sau'
                  : 'Đánh dấu xem sau'}
              </button>
            </div>
          </div>

          <h2 className="mb-2 text-lg font-extrabold text-slate-900 md:text-xl">
            {currentQuestion.questionTitle}
          </h2>
          <p className="mb-5 whitespace-pre-line text-sm leading-6 text-slate-700 md:text-base">
            {currentQuestion.questionText}
          </p>

          <div className="space-y-3">
            {currentQuestion.answerOptions.map((option) => {
              const selected = (answers[currentQuestion.id] || []).includes(
                option.optionLabel
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    handleSelectOption(
                      currentQuestion,
                      option.optionLabel,
                      !selected
                    )
                  }
                  className={clsx(
                    'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition',
                    selected
                      ? 'border-black-500 bg-black-50 ring-2 ring-black-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="mt-0.5 text-blue-600">
                    {isMultipleChoice(currentQuestion.questionType) ? (
                      selected ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Circle size={18} />
                      )
                    ) : selected ? (
                      <CircleDot size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 md:text-base">
                      {option.optionLabel}. {option.optionText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Câu trước
            </button>
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(totalQuestions - 1, prev + 1)
                )
              }
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-black text-white font-semibold hover:bg-gray-800 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Câu sau
            </button>
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between">
            <h3 className="mb-3 text-base font-bold text-slate-900">
              Tiến độ làm bài
            </h3>
            <p className="mt-1 rounded-[6px] text-sm text-foreground font-bold p-2 bg-[#ccc]">
              {answeredCount}/{totalQuestions}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r bg-black transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 mt-[14px] max-h-[600px] overflow-y-auto hidden-scrollbar">
            {questions.map((question, index) => {
              const isActive = index === currentQuestionIndex;
              const isAnswered = (answers[question.id] || []).length > 0;
              const isMarked = Boolean(markedQuestions[question.id]);

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={clsx(
                    'rounded-xl border px-2 py-2 text-sm font-bold transition',
                    isActive
                      ? 'bg-black text-white'
                      : isMarked
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : isAnswered
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="mt-1">
              Đánh dấu xem sau:{' '}
              <span className="font-bold text-amber-700">{markedCount}</span>
            </p>
            <p className="mt-1">
              Cơ chế lưu tự động đang hoạt động mỗi khi bạn chọn đáp án.
            </p>

            <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] bg-black" />
                Đang xem
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border border-emerald-300 bg-emerald-50" />
                Đã hoàn thành
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border border-slate-300 bg-white" />
                Chưa làm
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border border-amber-300 bg-amber-50" />
                Đã đánh dấu
              </div>
            </div>
          </div>
        </aside>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex gap-2 items-center">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            <Info size={24} />
          </span>
          <p className="text-[11px] text-slate-500 text-center leading-tight">
            Mọi hành vi gian lận sẽ bị hệ thống tự động ghi lại và báo cáo.
          </p>
        </div>
      </div>

      {submitResult && (
        <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="text-lg font-black text-slate-900">Kết quả bài thi</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
              <p className="text-xs font-semibold text-slate-500">Điểm số</p>
              <p className="mt-1 text-xl font-black text-blue-700">
                {submitResult.score.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
              <p className="text-xs font-semibold text-slate-500">Điểm thô</p>
              <p className="mt-1 text-xl font-black text-slate-900">
                {submitResult.rawPoints}/{submitResult.maxScore}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
              <p className="text-xs font-semibold text-slate-500">Kết quả</p>
              <p
                className={clsx(
                  'mt-1 text-xl font-black',
                  submitResult.isPassed ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {submitResult.isPassed ? 'Đạt' : 'Chưa đạt'}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-blue-100">
              <p className="text-xs font-semibold text-slate-500">
                Điểm thưởng
              </p>
              <p className="mt-1 text-xl font-black text-amber-600">
                {submitResult.pointsEarned || 0}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/app/quizz')}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Về danh sách đề
            </button>
            <button
              onClick={() =>
                navigate(`/app/quizz/${quizId}/leaderboard`, {
                  state: { examTitle },
                })
              }
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Xem bảng xếp hạng
            </button>
            <button
              onClick={() => {
                setSubmitResult(null);
                isSubmitTriggeredRef.current = false;
                void startExam();
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Làm lại đề này
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default DoExamPage;
