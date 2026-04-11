import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import flashcardProgress from '@/utils/flashcardProgress';

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
  // Render based on type
  const renderFront = () => {
    return (
      <div className="flex h-full flex-col p-8 sm:p-12">
        <div className="flex w-full items-start justify-between">
          <span className="rounded-md border border-slate-800 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-800">
            {subjectName}
          </span>
          <Lightbulb size={24} className="text-slate-900" strokeWidth={1.5} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-center text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            {card.frontContent}
          </h2>

          {/* Render options if multiple choice */}
          {(card.type === 'MULTIPLE_CHOICE' || card.type === 'TRUE_FALSE') &&
            card.options &&
            card.options.length > 0 && (
              <div className="mt-8 grid w-full max-w-lg gap-3">
                {card.options.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className="flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-left font-bold text-slate-700 shadow-sm"
                  >
                    <span className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">
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
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-slate-700"
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
          <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Answer
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          {card.type === 'BASIC' ? (
            <div className="text-center text-2xl font-bold leading-relaxed text-slate-800 md:text-3xl">
              {card.backContent}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center">
              <h3 className="mb-6 text-center text-xl font-bold text-slate-900 md:text-2xl">
                {card.frontContent}
              </h3>
              <div className="w-full max-w-2xl text-left">
                {card.options?.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className={clsx(
                      'mb-3 flex items-center gap-4 rounded-xl px-5 py-4 font-semibold text-slate-800 transition',
                      opt.isCorrect
                        ? 'border-2 border-emerald-500 bg-emerald-50'
                        : 'border-2 border-transparent bg-slate-50 opacity-50'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        opt.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 text-slate-500'
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
                <div className="mt-6 w-full max-w-2xl rounded-2xl bg-slate-50 p-6 text-slate-700">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Giải thích
                  </p>
                  <p className="text-sm font-medium leading-relaxed sm:text-base">
                    {card.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Watermark icon backend */}
        <div className="pointer-events-none absolute bottom-8 right-12 z-0 text-slate-100/50">
          <GraduationCap size={160} />
        </div>
      </div>
    );
  };

  return (
    <div
      className="perspective-1000 relative mx-auto h-[60vh] min-h-[460px] w-full max-w-4xl"
      onClick={onFlip}
    >
      <div
        className={clsx(
          'transform-style-preserve-3d absolute h-full w-full rounded-3xl bg-white shadow-2xl transition-all duration-500 ease-in-out',
          { 'rotate-y-180': isFlipped }
        )}
      >
        {/* Front Face */}
        <div
          className={clsx(
            'backface-hidden absolute inset-0 h-full w-full rounded-3xl border border-slate-200'
          )}
        >
          {/* Decorative corners */}
          <div className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          <div className="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rounded-full bg-slate-200"></div>

          {renderFront()}
        </div>

        {/* Back Face */}
        <div
          className={clsx(
            'backface-hidden rotate-y-180 absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white'
          )}
        >
          {/* Decorative corners */}
          <div className="absolute left-6 top-6 h-1.5 w-1.5 rounded-full bg-slate-200 z-20"></div>
          <div className="absolute right-6 top-6 h-1.5 w-1.5 rounded-full bg-slate-200 z-20"></div>
          <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-slate-200 z-20"></div>
          <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rounded-full bg-slate-200 z-20"></div>

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Finish & Timer states
  const [isFinished, setIsFinished] = useState(false);
  const [sessionTimeStr, setSessionTimeStr] = useState('');
  const startTimeRef = useRef<number | null>(null);
  const [studyMode, setStudyMode] = useState<'ALL' | 'REVIEW'>('ALL');

  // Fetch set
  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEY.FLASHCARD.GET_SET, setId],
    queryFn: () => ApiFlashcard.getFlashcardSetDetail(setId!),
    enabled: !!setId,
  });

  const setDetail = data;
  const allCards = useMemo(
    () => setDetail?.flashcards || [],
    [setDetail?.flashcards]
  );

  // Filter cards based on mode
  const cards = useMemo(() => {
    if (studyMode === 'ALL') return allCards;
    const notUnderstoodIds = flashcardProgress.getNotUnderstoodCards(
      setId || ''
    );
    return allCards.filter((c) => notUnderstoodIds.includes(c.id));
  }, [allCards, studyMode, setId]);

  const subjectName = setDetail?.subject?.subjectName || 'FLASHCARD';

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((p) => p + 1), 150); // slight delay to unflipping before transition
    } else {
      // Reach end
      finishSession();
    }
  };

  const finishSession = () => {
    const elapsedMs = Date.now() - (startTimeRef?.current || 0);
    const elapsedSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(elapsedSecs / 60);
    const secs = elapsedSecs % 60;

    if (mins > 0) {
      setSessionTimeStr(`${mins} phút ${secs} giây`);
    } else {
      setSessionTimeStr(`${secs} giây`);
    }

    setIsFlipped(false);
    setIsFinished(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((p) => p - 1), 150);
    }
  };

  const handleFlip = () => {
    setIsFlipped((p) => !p);
  };

  const handleNotUnderstood = () => {
    if (currentCard && setId) {
      flashcardProgress.markCardAsNotUnderstood(setId, currentCard.id);
    }
    handleNext();
  };

  const handleUnderstood = () => {
    if (currentCard && setId) {
      flashcardProgress.markCardAsUnderstood(setId, currentCard.id);
    }
    handleNext();
  };

  // Reset metrics when starting
  useEffect(() => {
    if (!isFinished) {
      startTimeRef.current = Date.now();
    }
  }, [isFinished, studyMode]);

  // Listen to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((p) => !p);
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
    currentIndex,
    isFlipped,
    cards,
    handleNext,
    handlePrev,
    handleNotUnderstood,
    handleUnderstood,
    isFinished,
  ]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse text-lg font-bold text-slate-400">
          Loading flashcards...
        </div>
      </div>
    );
  }

  if (!setDetail || cards.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-800">
          Không tìm thấy thẻ
        </h1>
        <p className="mt-2 text-slate-500">
          Bộ thẻ chưa có nội dung hoặc tất cả đều đã được hiểu.
        </p>
        <button
          onClick={() => {
            if (studyMode === 'REVIEW') setStudyMode('ALL');
            else navigate('/app/flashcards');
          }}
          className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          {studyMode === 'REVIEW' ? 'Quay lại học tất cả' : 'Quay lại thư viện'}
        </button>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / totalCards) * 100;

  // Get live stats for summary
  const notUnderstoodIds = flashcardProgress.getNotUnderstoodCards(setId || '');
  const notUnderstoodCount = allCards.filter((c) =>
    notUnderstoodIds.includes(c.id)
  ).length;
  const understoodCount = allCards.length - notUnderstoodCount;

  // Render Summary Screen
  if (isFinished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] p-6">
        <div className="flex max-w-lg flex-col items-center text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border-2 border-slate-100 shadow-sm">
            <Trophy size={48} className="text-slate-800" strokeWidth={1.5} />
            <Star
              size={16}
              className="absolute -right-1 top-2 text-slate-700"
            />
            <div className="absolute -left-2 top-8 text-xl">🎉</div>
          </div>

          <h1 className="mb-2 text-3xl font-black text-slate-900 md:text-4xl">
            Thống kê
          </h1>
          <p className="mb-10 font-medium text-slate-500">
            Bạn đã hoàn thành bộ thẻ này trong{' '}
            <span className="font-bold text-slate-700">{sessionTimeStr}</span>.
          </p>

          <div className="mb-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
            {/* Đã hiểu Card */}
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <span className="text-sm font-bold text-slate-800">Đã hiểu</span>
              <div className="mt-2 text-4xl font-black text-slate-900">
                {understoodCount}{' '}
                <span className="text-sm font-medium text-slate-500">thẻ</span>
              </div>
              <Check
                size={90}
                className="absolute -bottom-4 -right-4 text-emerald-50 opacity-50"
                strokeWidth={3}
              />
            </div>

            {/* Chưa hiểu Card */}
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <span className="text-sm font-bold text-slate-800">
                Chưa hiểu
              </span>
              <div className="mt-2 text-4xl font-black text-slate-900">
                {notUnderstoodCount}{' '}
                <span className="text-sm font-medium text-slate-500">thẻ</span>
              </div>
              <X
                size={90}
                className="absolute -bottom-4 -right-4 text-rose-50 opacity-50"
                strokeWidth={3}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            {notUnderstoodCount > 0 ? (
              <button
                onClick={() => {
                  setStudyMode('REVIEW');
                  setCurrentIndex(0);
                  setIsFinished(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition hover:bg-slate-800 hover:shadow-lg"
              >
                <RotateCcw size={18} />
                Ôn lại {notUnderstoodCount} câu chưa hiểu
              </button>
            ) : (
              <button
                onClick={() => {
                  setStudyMode('ALL');
                  setCurrentIndex(0);
                  setIsFinished(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition hover:bg-slate-800 hover:shadow-lg"
              >
                <RotateCcw size={18} />
                Học lại từ đầu
              </button>
            )}

            <button
              onClick={() => navigate('/app/flashcards')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-4 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Home size={18} />
              Về màn hình chính
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] pb-12">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header className="flex w-full flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <GraduationCap size={22} />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">
              {setDetail.title}
            </h1>
          </div>
          <button
            onClick={() => navigate('/app/flashcards')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-100">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
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
                <div className="flex items-center gap-3 rounded-full border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  <PenOff size={18} className="text-slate-400" />
                  Chưa hiểu
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Phím 1
                </span>
              </button>

              <button
                onClick={handleUnderstood}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-black hover:shadow-xl">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  Đã hiểu
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Phím 2
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center rounded-2xl border bg-white p-2 shadow-sm ring-1 ring-slate-100 animate-in fade-in zoom-in-95">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 text-slate-400 transition hover:text-slate-800 disabled:opacity-20 disabled:hover:text-slate-400"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <div className="mx-2 h-8 w-px bg-slate-200" />
              <button
                onClick={handleFlip}
                className="p-3 text-slate-700 transition hover:text-blue-600"
              >
                <RotateCcw size={22} strokeWidth={2.5} />
              </button>
              <div className="mx-2 h-8 w-px bg-slate-200" />
              <button
                onClick={handleNext}
                disabled={currentIndex === totalCards - 1}
                className="p-3 text-slate-400 transition hover:text-slate-800 disabled:opacity-20 disabled:hover:text-slate-400"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Global CSS for 3D Flip */}
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
