import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import type { IExamQuestionResult } from '@/types/exam';
import { X, CheckCircle2, XCircle, Circle, Info, Loader2 } from 'lucide-react';
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

  if (!isOpen) return null;

  const totalQuestions = questions.length;

  // Loading state
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="flex h-48 w-full max-w-md items-center justify-center rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-slate-600" />
            <p className="text-sm font-semibold text-slate-600">
              Đang tải đáp án...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="flex h-48 w-full max-w-md items-center justify-center rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-3">
            <XCircle size={32} className="text-rose-500" />
            <p className="text-sm font-semibold text-slate-600">
              Không thể tải kết quả. Vui lòng thử lại.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="flex h-56 w-full max-w-md flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Info size={28} className="mb-3 text-slate-500" />
          <p className="text-sm font-semibold text-slate-700">
            Không có dữ liệu đáp án chi tiết cho lượt làm bài này.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">
            Xem đáp án chi tiết
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Question Navigation */}
        <div className="border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Câu {currentIndex + 1} / {totalQuestions}
            </span>
            <div
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
                isQuestionCorrect
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
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

          <div className="flex gap-1.5 overflow-x-auto">
            {questions.map((question, index) => {
              return (
                <button
                  key={question.questionId}
                  onClick={() => setCurrentIndex(index)}
                  className={clsx(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition',
                    index === currentIndex
                      ? 'bg-black text-white'
                      : question.isCorrect
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            {currentQuestion.questionTitle && (
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {currentQuestion.questionTitle}
              </h3>
            )}
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
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

              return (
                <div
                  key={option.id}
                  className={clsx(
                    'flex items-start gap-3 rounded-xl border px-4 py-3',
                    isCorrectOption
                      ? 'border-emerald-300 bg-emerald-50'
                      : isUserOption
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-slate-200 bg-white'
                  )}
                >
                  <div className="mt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : isUserOption ? (
                      <XCircle size={18} className="text-rose-600" />
                    ) : (
                      <Circle size={18} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={clsx(
                        'text-sm font-semibold',
                        isCorrectOption
                          ? 'text-emerald-900'
                          : isUserOption
                            ? 'text-rose-900'
                            : 'text-slate-700'
                      )}
                    >
                      {option.optionLabel}. {option.optionText}
                    </p>
                    {isCorrectOption && (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        ✓ Đáp án đúng
                      </p>
                    )}
                    {isUserOption && !isCorrectOption && (
                      <p className="mt-1 text-xs font-semibold text-rose-700">
                        ✗ Câu trả lời của bạn
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation section - if available */}
          {currentQuestion.explanation && (
            <div className="mt-6 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
              <div className="mb-2 flex items-center gap-2">
                <Info size={16} className="text-blue-600" />
                <h4 className="text-sm font-bold text-blue-900">Giải thích</h4>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-blue-800">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Câu trước
          </button>

          <span className="text-sm font-semibold text-slate-600">
            Đúng:{' '}
            {questions.filter((q: IExamQuestionResult) => q.isCorrect).length} /{' '}
            {totalQuestions}
          </span>

          <button
            onClick={() =>
              setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
            }
            disabled={currentIndex === totalQuestions - 1}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Câu sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerReviewModal;
