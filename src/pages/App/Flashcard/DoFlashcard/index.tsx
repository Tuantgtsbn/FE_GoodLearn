import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Lightbulb,
  GraduationCap,
  Star,
  PenOff,
  Check,
  Trophy,
  Home,
} from 'lucide-react';

import clsx from 'clsx';
import ApiFlashcard from '@/api/ApiFlashcard';
import QUERY_KEY from '@/api/QueryKey';
import type { IFlashcardItem } from '@/types/flashcard';
import { useFlashcardSession } from './useFlashcardSession';

// ─── Flashcard Component ───────────────────────────────────────────────────

interface FlashcardCardProps {
  card: IFlashcardItem;
  subjectName: string;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  subjectName,
  isFlipped,
  onFlip,
}) => {
  const renderFront = () => {
    return (
      <div className="flex h-full flex-col p-8 sm:p-12">
        <div className="flex w-full items-start justify-between">
          <span className="rounded-md border px-3 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            {subjectName}
          </span>
          <Lightbulb size={24} className="text-foreground" strokeWidth={1.5} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-center text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {card.frontContent}
          </h2>

          {(card.type === 'MULTIPLE_CHOICE' || card.type === 'TRUE_FALSE') &&
            card.options &&
            card.options.length > 0 && (
              <div className="mt-8 grid w-full max-w-lg gap-3">
                {card.options.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className="flex items-center rounded-xl border bg-background px-5 py-4 text-left font-bold text-muted-foreground shadow-sm"
                  >
                    <span className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="mt-4 flex w-full justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFlip();
            }}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
          >
            <span className="text-lg">👆</span> Click to flip
          </button>
        </div>
      </div>
    );
  };

  const renderBack = () => {
    return (
      <div className="flex h-full flex-col p-8 sm:p-12">
        <div className="flex w-full items-start justify-between">
          <span className="rounded-md bg-muted px-3 py-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Answer
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          {card.type === 'BASIC' ? (
            <div className="text-center text-2xl font-bold leading-relaxed text-foreground md:text-3xl">
              {card.backContent}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center">
              <h3 className="mb-6 text-center text-xl font-bold text-foreground md:text-2xl">
                {card.frontContent}
              </h3>
              <div className="w-full max-w-2xl text-left">
                {card.options?.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className={clsx(
                      'mb-3 flex items-center gap-4 rounded-xl px-5 py-4 font-semibold transition',
                      opt.isCorrect
                        ? 'border-2 border-emerald-500/40 bg-emerald-500/10 text-foreground'
                        : 'border-2 border-transparent bg-muted opacity-50 text-muted-foreground'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        opt.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-border text-muted-foreground'
                      )}
                    >
                      {opt.isCorrect ? (
                        <Check size={14} strokeWidth={3} />
                      ) : null}
                    </div>
                    {opt.text}
                  </div>
                ))}
              </div>
              {card.explanation && (
                <div className="mt-6 w-full max-w-2xl rounded-2xl bg-muted p-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Giải thích
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                    {card.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-8 right-12 z-0 text-muted/50">
          <GraduationCap size={160} />
        </div>
      </div>
    );
  };

  return (
    <div
      className="perspective-1000 relative mx-auto h-[60vh] w-full max-w-4xl"
      onClick={onFlip}
    >
      <div
        className={clsx(
          'transform-style-preserve-3d absolute h-full w-full rounded-3xl bg-background shadow-2xl transition-all duration-500 ease-in-out',
          { 'rotate-y-180': isFlipped }
        )}
      >
        {/* Front Face */}
        <div
          className={clsx(
            'backface-hidden absolute inset-0 h-full w-full rounded-3xl border'
          )}
        >
          <div className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-border" />
          <div className="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-border" />
          <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-border" />
          <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rounded-full bg-border" />

          {renderFront()}
        </div>

        {/* Back Face */}
        <div
          className={clsx(
            'backface-hidden rotate-y-180 absolute inset-0 h-full w-full overflow-hidden rounded-3xl border bg-background'
          )}
        >
          <div className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-border z-20" />
          <div className="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-border z-20" />
          <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-border z-20" />
          <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rounded-full bg-border z-20" />

          {renderBack()}
        </div>
      </div>
    </div>
  );
};

// ─── Main Player Page ──────────────────────────────────────────────────────

const DoFlashcardPlayer = () => {
  const { setId } = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEY.FLASHCARD.GET_SET, setId],
    queryFn: () => ApiFlashcard.getFlashcardSetDetail(setId!),
    enabled: !!setId,
  });

  const setDetail = data;
  const allCards = setDetail?.flashcards || [];

  const {
    state: { currentIndex, isFlipped, isFinished, sessionTimeStr, studyMode },
    cards,
    currentCard,
    totalCards,
    progressPercent,
    notUnderstoodCount,
    understoodCount,
    handleNext,
    handlePrev,
    handleFlip,
    handleReviewNotUnderstood,
    handleNotUnderstood,
    handleUnderstood,
    resetProgressAndSession,
    switchToAllMode,
  } = useFlashcardSession({
    setId,
    allCards,
  });

  const subjectName = setDetail?.subject?.subjectName || 'FLASHCARD';

  const handleExitToLibrary = useCallback(() => {
    resetProgressAndSession();
    navigate('/app/flashcards');
  }, [navigate, resetProgressAndSession]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' && !isFlipped && !isFinished) {
        handleNext();
      } else if (e.code === 'ArrowLeft' && !isFlipped && !isFinished) {
        handlePrev();
      } else if (isFlipped && !isFinished) {
        if (e.code === 'Digit1') {
          handleNotUnderstood();
        } else if (e.code === 'Digit2') {
          handleUnderstood();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleFlip,
    isFlipped,
    handleNext,
    handlePrev,
    handleNotUnderstood,
    handleUnderstood,
    isFinished,
  ]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg font-bold text-muted-foreground">
          Đang tải flashcard...
        </div>
      </div>
    );
  }

  if (!setDetail) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-foreground">
          Không tìm thấy thẻ
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bộ thẻ chưa có nội dung hoặc tất cả đều đã được hiểu.
        </p>
        <button
          onClick={() => {
            if (studyMode === 'REVIEW') {
              switchToAllMode();
            } else {
              handleExitToLibrary();
            }
          }}
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:opacity-90"
        >
          {studyMode === 'REVIEW' ? 'Quay lại học tất cả' : 'Quay lại thư viện'}
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="flex max-w-lg flex-col items-center text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border bg-muted">
            <Trophy size={48} className="text-foreground" strokeWidth={1.5} />
            <Star
              size={16}
              className="absolute -right-1 top-2 text-muted-foreground"
            />
            <div className="absolute -left-2 top-8 text-xl">🎉</div>
          </div>

          <h1 className="mb-2 text-3xl font-black text-foreground md:text-4xl">
            Thống kê
          </h1>
          <p className="mb-10 font-medium text-muted-foreground">
            Bạn đã hoàn thành bộ thẻ này trong{' '}
            <span className="font-bold text-foreground">{sessionTimeStr}</span>.
          </p>

          <div className="mb-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border bg-background p-5 text-left">
              <span className="text-sm font-bold text-foreground">Đã hiểu</span>
              <div className="mt-2 text-4xl font-black text-foreground">
                {understoodCount}{' '}
                <span className="text-sm font-medium text-muted-foreground">
                  thẻ
                </span>
              </div>
              <Check
                size={90}
                className="absolute -bottom-4 -right-4 text-emerald-500/10"
                strokeWidth={3}
              />
            </div>

            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border bg-background p-5 text-left">
              <span className="text-sm font-bold text-foreground">
                Chưa hiểu
              </span>
              <div className="mt-2 text-4xl font-black text-foreground">
                {notUnderstoodCount}{' '}
                <span className="text-sm font-medium text-muted-foreground">
                  thẻ
                </span>
              </div>
              <X
                size={90}
                className="absolute -bottom-4 -right-4 text-destructive/10"
                strokeWidth={3}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            {notUnderstoodCount > 0 ? (
              <>
                <button
                  onClick={handleReviewNotUnderstood}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <RotateCcw size={18} />
                  Ôn lại {notUnderstoodCount} câu chưa hiểu
                </button>
                <button
                  onClick={resetProgressAndSession}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background py-4 font-bold text-muted-foreground transition hover:bg-muted"
                >
                  <RotateCcw size={18} />
                  Học lại từ đầu
                </button>
              </>
            ) : (
              <button
                onClick={resetProgressAndSession}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition hover:opacity-90"
              >
                <RotateCcw size={18} />
                Học lại từ đầu
              </button>
            )}

            <button
              onClick={handleExitToLibrary}
              className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background py-4 font-bold text-muted-foreground transition hover:bg-muted"
            >
              <Home size={18} />
              Về màn hình chính
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-foreground">
          Không tìm thấy thẻ
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bộ thẻ chưa có nội dung hoặc tất cả đều đã được hiểu.
        </p>
        <button
          onClick={() => {
            if (studyMode === 'REVIEW') {
              switchToAllMode();
            } else {
              handleExitToLibrary();
            }
          }}
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:opacity-90"
        >
          {studyMode === 'REVIEW' ? 'Quay lại học tất cả' : 'Quay lại thư viện'}
        </button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg font-bold text-muted-foreground">
          Đang tải flashcard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-12">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header className="flex w-full flex-col border-b bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <GraduationCap size={22} />
            </span>
            <h1 className="text-xl font-extrabold text-foreground">
              {setDetail.title}
            </h1>
          </div>
          <button
            onClick={handleExitToLibrary}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative h-1.5 w-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Tiến độ</span>
          <span>
            Thẻ {currentIndex + 1} / {totalCards}
          </span>
        </div>
      </header>

      {/* ─── Cards ────────────────────────────────────────────────────── */}
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8">
        <FlashcardCard
          card={currentCard}
          subjectName={subjectName}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        {/* ─── Controls ─────────────────────────────────────────────────── */}
        <div className="mt-10 flex h-24 items-center">
          {isFlipped ? (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in">
              <button
                onClick={handleNotUnderstood}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-3 rounded-full border bg-background px-8 py-4 font-bold text-muted-foreground shadow-sm transition hover:bg-muted">
                  <PenOff size={18} className="text-muted-foreground" />
                  Chưa hiểu
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Phím 1
                </span>
              </button>

              <button
                onClick={handleUnderstood}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg transition hover:opacity-90">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  Đã hiểu
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Phím 2
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center rounded-2xl border bg-background p-2 shadow-sm animate-in fade-in zoom-in-95">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 text-muted-foreground transition hover:text-foreground disabled:opacity-20"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <div className="mx-2 h-8 w-px bg-border" />
              <button
                onClick={handleFlip}
                className="p-3 text-muted-foreground transition hover:text-primary"
              >
                <RotateCcw size={22} strokeWidth={2.5} />
              </button>
              <div className="mx-2 h-8 w-px bg-border" />
              <button
                onClick={handleNext}
                disabled={currentIndex === totalCards - 1}
                className="p-3 text-muted-foreground transition hover:text-foreground disabled:opacity-20"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default DoFlashcardPlayer;
