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
  Eye,
  Flag,
  Info,
  LoaderCircle,
  Send,
  TriangleAlert,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  useLocation,
  useNavigate,
  useParams,
  useBlocker,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import AnswerReviewModal from './AnswerReviewModal';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PendingSaveEntry = {
  questionId: string;
  selectedOptions: string[];
};

type MarkedQuestionMap = Record<string, true>;

type DoExamLocationState = {
  examTitle?: string;
};

const AUTOSAVE_DEBOUNCE_MS = 400;

const isMultipleChoice = (questionType: string) => {
  return questionType.toLowerCase().includes('multiple');
};

const formatTime = (seconds: number | null) => {
  if (seconds === null || Number.isNaN(seconds)) {
    return '--:--';
  }

  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const saveTimersRef = useRef<Record<string, number>>({});
  const pendingSavesRef = useRef<Record<string, PendingSaveEntry>>({});
  const isSubmitTriggeredRef = useRef(false);

  const blocker = useBlocker(
    useCallback(
      ({ nextLocation }) => {
        const isActiveExam = Boolean(attempt?.attemptId) && !submitResult;
        const shouldBlock = isActiveExam && !isSubmitTriggeredRef.current;

        if (shouldBlock) {
          setPendingNavigation(nextLocation.pathname);
          setShowLeaveDialog(true);
        }

        return shouldBlock;
      },
      [attempt?.attemptId, submitResult]
    )
  );

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

  const handleCancelExam = useCallback(async () => {
    if (!attempt?.attemptId) {
      setShowLeaveDialog(false);
      navigate('/app/quizz');
      return;
    }

    try {
      await flushPendingSaves();
      const result = await ApiExam.submitExam({
        attemptId: attempt.attemptId,
      });

      setSubmitResult(result);
      isSubmitTriggeredRef.current = true;

      toast.success('Đã nộp bài và thoát khỏi bài thi.');

      setShowLeaveDialog(false);

      if (blocker?.state === 'blocked') {
        blocker.proceed();
      } else {
        setTimeout(() => {
          if (pendingNavigation) {
            navigate(pendingNavigation);
          } else {
            navigate('/app/quizz');
          }
        }, 100);
      }
    } catch {
      toast.error('Không thể nộp bài. Vui lòng thử lại.');
    }
  }, [
    attempt?.attemptId,
    flushPendingSaves,
    pendingNavigation,
    navigate,
    blocker,
  ]);

  const handleAttemptLeave = useCallback(() => {
    setShowLeaveDialog(true);
  }, []);

  const startExam = useCallback(async () => {
    if (!quizId) {
      toast.error('Không tìm thấy mã đề thi');
      navigate('/app/quizz');
      return;
    }

    setIsLoadingExam(true);

    try {
      const startData = await ApiExam.startExam({ quizId });

      if (startData.resumed) {
        toast.warning(
          'Bạn có bài thi chưa hoàn thành từ trước. Thời gian vẫn tiếp tục đếm.'
        );
      }

      setAttempt(startData);
      setAnswers(startData.answers);
      setMarkedQuestions({});
      setTimeLeftSeconds(startData.timeLeftSeconds);
    } catch {
      toast.error('Không thể bắt đầu bài thi. Vui lòng thử lại.');
      navigate('/app/quizz');
    } finally {
      setIsLoadingExam(false);
    }
  }, [quizId, navigate]);

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

        return nextMarkedQuestions;
      });
    },
    [attempt?.attemptId, submitResult, isSubmitting]
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
    [attempt?.attemptId, isSubmitting, flushPendingSaves]
  );

  useEffect(() => {
    void startExam();
  }, [startExam]);

  useEffect(() => {
    setShowLeaveDialog(false);
    setPendingNavigation(null);
    setSubmitResult(null);
    setCurrentQuestionIndex(0);
    isSubmitTriggeredRef.current = false;
  }, [quizId]);

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
      event.returnValue =
        'Bạn đang làm bài thi. Nếu rời đi, hệ thống sẽ tự động nộp bài với các câu trả lời hiện tại.';
      return event.returnValue;
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

      if (
        attempt?.attemptId &&
        !submitResult &&
        !isSubmitTriggeredRef.current
      ) {
        isSubmitTriggeredRef.current = true;
        ApiExam.submitExam({
          attemptId: attempt.attemptId,
        }).catch(() => {});
      }
    };
  }, [attempt?.attemptId, submitResult]);

  if (isLoadingExam) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-2xl border bg-background px-6 py-4 shadow-sm">
          <LoaderCircle
            className="animate-spin text-muted-foreground"
            size={20}
          />
          <span className="font-semibold text-muted-foreground">
            Đang tải bài thi...
          </span>
        </div>
      </div>
    );
  }

  if (!attempt || totalQuestions === 0 || !currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border bg-background p-6 text-center">
          <h2 className="text-xl font-bold text-foreground">
            Không có dữ liệu bài thi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Không thể tải câu hỏi cho đề thi này. Vui lòng quay lại danh sách
            đề.
          </p>
          <button
            onClick={handleAttemptLeave}
            className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] space-y-6 px-4 py-6 md:px-6">
      {/* ── Header ── */}
      <header className="rounded-2xl border bg-background px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={handleAttemptLeave}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Quay lại danh sách
            </button>
            <h1 className="text-xl font-black text-foreground md:text-2xl">
              {examTitle}
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-md border bg-muted px-4 py-2">
              <AlarmClock size={18} className="text-foreground" />
              <span className="text-lg font-bold tabular-nums text-foreground">
                {formatTime(timeLeftSeconds)}
              </span>
            </div>

            <button
              onClick={() => void handleSubmit(false)}
              disabled={isSubmitting || submitResult !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
        {/* ── Question Area ── */}
        <section className="rounded-2xl border bg-background p-5">
          <div className="flex justify-between">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-sm font-semibold text-background">
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
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                    : 'border bg-background text-muted-foreground hover:bg-muted'
                )}
              >
                <Flag size={15} />
                {markedQuestions[currentQuestion.id]
                  ? 'Bỏ đánh dấu xem sau'
                  : 'Đánh dấu xem sau'}
              </button>
            </div>
          </div>

          <h2 className="mb-2 text-lg font-extrabold text-foreground md:text-xl">
            {currentQuestion.questionTitle}
          </h2>
          <p className="mb-5 whitespace-pre-line text-sm leading-6 text-muted-foreground md:text-base">
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
                      ? 'border-primary/40 bg-primary/10 ring-1 ring-primary/20'
                      : 'border bg-background hover:bg-muted'
                  )}
                >
                  <div className="mt-0.5 text-primary">
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
                    <p className="text-sm font-bold text-foreground md:text-base">
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
              className="rounded-xl border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Câu sau
            </button>
          </div>
        </section>

        {/* ── Sidebar ── */}
        <aside className="rounded-2xl border bg-background p-4">
          <div className="flex justify-between">
            <h3 className="mb-3 text-base font-bold text-foreground">
              Tiến độ làm bài
            </h3>
            <p className="mt-1 rounded-md bg-muted p-2 text-sm font-bold text-foreground">
              {answeredCount}/{totalQuestions}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-4 grid max-h-[600px] grid-cols-5 gap-2 overflow-y-auto scrollbar-thin">
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
                      ? 'bg-primary text-primary-foreground'
                      : isMarked
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : isAnswered
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border bg-background text-muted-foreground hover:bg-muted'
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <p className="mt-1">
              Đánh dấu xem sau:{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {markedCount}
              </span>
            </p>
            <p className="mt-1">
              Cơ chế lưu tự động đang hoạt động mỗi khi bạn chọn đáp án.
            </p>

            <div className="mt-3 space-y-1.5 border-t pt-3 text-[11px] font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] bg-primary" />
                Đang xem
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border border-emerald-500/40 bg-emerald-500/10" />
                Đã hoàn thành
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border bg-background" />
                Chưa làm
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-[3px] border border-amber-500/40 bg-amber-500/10" />
                Đã đánh dấu
              </div>
            </div>
          </div>
        </aside>

        {/* Warning */}
        <div className="rounded-2xl border bg-background p-4">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground leading-tight">
              Mọi hành vi gian lận sẽ bị hệ thống tự động ghi lại và báo cáo.
            </p>
          </div>
        </div>
      </div>

      {/* ── Result ── */}
      {submitResult && (
        <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h3 className="text-lg font-black text-foreground">
            Kết quả bài thi
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Điểm số
              </p>
              <p className="mt-1 text-xl font-black text-primary">
                {submitResult.score.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Điểm thô
              </p>
              <p className="mt-1 text-xl font-black text-foreground">
                {submitResult.rawPoints}/{submitResult.maxScore}
              </p>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Kết quả
              </p>
              <p
                className={clsx(
                  'mt-1 text-xl font-black',
                  submitResult.isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-destructive'
                )}
              >
                {submitResult.isPassed ? 'Đạt' : 'Chưa đạt'}
              </p>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Điểm thưởng
              </p>
              <p className="mt-1 text-xl font-black text-amber-600 dark:text-amber-400">
                {submitResult.pointsEarned || 0}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/app/quizz')}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Về danh sách đề
            </button>
            <button
              onClick={() =>
                navigate(`/app/quizz/${quizId}/leaderboard`, {
                  state: { examTitle, from: 'do_exam' },
                })
              }
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Xem bảng xếp hạng
            </button>
            <button
              onClick={() => {
                setSubmitResult(null);
                isSubmitTriggeredRef.current = false;
                void startExam();
              }}
              className="rounded-xl border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
            >
              Làm lại đề này
            </button>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Eye size={16} />
              Xem đáp án
            </button>
          </div>
        </section>
      )}

      <AnswerReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        attemptId={attempt?.attemptId ?? ''}
      />

      {/* ── Leave Dialog ── */}
      <Dialog
        open={showLeaveDialog}
        onOpenChange={(open) => setShowLeaveDialog(open)}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
          <DialogHeader>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15">
                <TriangleAlert
                  className="text-amber-600 dark:text-amber-400"
                  size={20}
                />
              </div>
              <DialogTitle className="text-xl">
                Cảnh báo thoát bài thi
              </DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed">
              Nếu bạn rời khỏi bài thi bây giờ, hệ thống sẽ{' '}
              <span className="font-bold text-destructive">
                tự động nộp bài
              </span>{' '}
              với các câu trả lời hiện tại. Bạn sẽ không thể tiếp tục làm bài.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">
              Tiến độ hiện tại của bạn:
            </p>
            <p className="mt-2">
              ✓ Đã trả lời:{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {answeredCount}/{totalQuestions}
              </span>
            </p>
            <p className="mt-1">
              ⚑ Đánh dấu xem sau:{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {markedCount}
              </span>
            </p>
            {timeLeftSeconds && (
              <p className="mt-1">
                ⏱ Thời gian còn lại:{' '}
                <span className="font-bold text-primary">
                  {formatTime(timeLeftSeconds)}
                </span>
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowLeaveDialog(false)}
              className="rounded-xl border bg-background px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
            >
              Tiếp tục làm bài
            </button>
            <button
              onClick={handleCancelExam}
              className="rounded-xl bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground transition hover:opacity-90"
            >
              Thoát và nộp bài
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoExamPage;
