import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import type { IExamQuestionResult } from '@/types/exam';
import {
  X,
  CheckCircle2,
  XCircle,
  Circle,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

interface AnswerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attemptId: string;
}

const AnswerReviewModal = ({
  isOpen,
  onClose,
  attemptId,
}: AnswerReviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.EXAM.ATTEMPT_RESULT, attemptId],
    queryFn: () => ApiExam.getAttemptResult(attemptId),
    enabled: isOpen && Boolean(attemptId),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const questions = data?.questions ?? [];
  const currentQuestion = questions[currentIndex] ?? null;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [attemptId, isOpen]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, questions.length]);

  const isQuestionCorrect = useMemo(() => {
    return currentQuestion?.isCorrect ?? false;
  }, [currentQuestion]);

  const correctCount = useMemo(
    () => questions.filter((q: IExamQuestionResult) => q.isCorrect).length,
    [questions]
  );

  if (!isOpen) return null;

  const totalQuestions = questions.length;

  const overlayClasses =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm';

  const containerClasses =
    'flex w-full max-w-4xl flex-col rounded-2xl border bg-background shadow-2xl';

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));

  // ── Loading ──
  if (isLoading) {
    return (
      <div className={overlayClasses} onClick={onClose}>
        <div
          className="flex h-52 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-2xl border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 size={36} className="animate-spin text-muted-foreground" />
          <p className="text-sm font-semibold text-muted-foreground">
            Đang tải đáp án...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !data) {
    return (
      <div className={overlayClasses} onClick={onClose}>
        <div
          className="flex w-full max-w-sm flex-col items-center rounded-2xl border bg-background px-6 py-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <XCircle size={24} className="text-destructive" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Không thể tải kết quả
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vui lòng thử lại sau.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (!currentQuestion) {
    return (
      <div className={overlayClasses} onClick={onClose}>
        <div
          className="flex w-full max-w-sm flex-col items-center rounded-2xl border bg-background px-6 py-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Info size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Không có dữ liệu đáp án
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Lượt làm bài này không có đáp án chi tiết.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // ── Main Content ──
  return (
    <div className={overlayClasses} onClick={onClose}>
      <div
        className={clsx(containerClasses, 'h-[90vh]')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Xem đáp án chi tiết
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Câu {currentIndex + 1} / {totalQuestions} &middot; Đúng{' '}
              {correctCount}/{totalQuestions}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Question Navigation */}
        <div className="shrink-0 border-b px-6 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
                isQuestionCorrect
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-destructive/15 text-destructive'
              )}
            >
              {isQuestionCorrect ? (
                <>
                  <CheckCircle2 size={14} />
                  Đúng
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  Sai
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((question, index) => (
              <button
                key={question.questionId}
                onClick={() => setCurrentIndex(index)}
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition',
                  index === currentIndex
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : question.isCorrect
                      ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:text-emerald-400'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="mb-6">
            {currentQuestion.questionTitle && (
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {currentQuestion.questionTitle}
              </h3>
            )}
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {currentQuestion.questionText}
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.answerOptions.map((option) => {
              const isCorrectOption = currentQuestion.correctAnswer.includes(
                option.optionLabel
              );
              const isUserOption = currentQuestion.selectedOptions.includes(
                option.optionLabel
              );

              const optionBg = isCorrectOption
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : isUserOption
                  ? 'border-destructive/40 bg-destructive/10'
                  : 'border bg-background';

              const optionText = isCorrectOption
                ? 'text-emerald-700 dark:text-emerald-400'
                : isUserOption
                  ? 'text-destructive'
                  : 'text-foreground';

              const optionIcon = isCorrectOption ? (
                <CheckCircle2
                  size={18}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              ) : isUserOption ? (
                <XCircle size={18} className="text-destructive" />
              ) : (
                <Circle size={18} className="text-muted-foreground" />
              );

              return (
                <div
                  key={option.id}
                  className={clsx(
                    'flex items-start gap-3 rounded-xl px-4 py-3',
                    optionBg
                  )}
                >
                  <div className="mt-0.5 shrink-0">{optionIcon}</div>

                  <div className="min-w-0 flex-1">
                    <p className={clsx('text-sm font-semibold', optionText)}>
                      {option.optionLabel}. {option.optionText}
                    </p>
                    {isCorrectOption && (
                      <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Đáp án đúng
                      </p>
                    )}
                    {isUserOption && !isCorrectOption && (
                      <p className="mt-1 text-xs font-semibold text-destructive">
                        Câu trả lời của bạn
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {currentQuestion.explanation && (
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/15">
                  <Info
                    size={13}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  Giải thích
                </h4>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-blue-700/80 dark:text-blue-400/80">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex shrink-0 items-center justify-between border-t px-6 py-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Câu trước
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Câu sau
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerReviewModal;
