import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import type { IFlashcardItem } from '@/types/flashcard';
import flashcardProgress from '@/utils/flashcardProgress';

type StudyMode = 'ALL' | 'REVIEW';

interface FlashcardSessionState {
  currentIndex: number;
  isFlipped: boolean;
  isFinished: boolean;
  sessionTimeStr: string;
  studyMode: StudyMode;
  sessionNotUnderstood: Set<string>;
  allModeNotUnderstood: Set<string>;
  initialSessionSize: number;
}

type FlashcardSessionAction =
  | { type: 'HYDRATE_ALL_MODE'; ids: string[] }
  | { type: 'TOGGLE_FLIP' }
  | { type: 'UNFLIP_CARD' }
  | { type: 'PREV_CARD' }
  | { type: 'NEXT_CARD' }
  | { type: 'FINISH_SESSION'; sessionTimeStr: string }
  | { type: 'START_REVIEW'; ids: string[] }
  | { type: 'SWITCH_TO_ALL_MODE' }
  | { type: 'MARK_NOT_UNDERSTOOD_ALL'; cardId: string }
  | { type: 'MARK_UNDERSTOOD_ALL'; cardId: string }
  | { type: 'MARK_UNDERSTOOD_REVIEW'; cardId: string }
  | { type: 'RESET_PROGRESS_AND_SESSION' };

const initialState: FlashcardSessionState = {
  currentIndex: 0,
  isFlipped: false,
  isFinished: false,
  sessionTimeStr: '',
  studyMode: 'ALL',
  sessionNotUnderstood: new Set(),
  allModeNotUnderstood: new Set(),
  initialSessionSize: 0,
};

const flashcardSessionReducer = (
  state: FlashcardSessionState,
  action: FlashcardSessionAction
): FlashcardSessionState => {
  switch (action.type) {
    case 'HYDRATE_ALL_MODE': {
      return {
        ...state,
        allModeNotUnderstood: new Set(action.ids),
      };
    }

    case 'TOGGLE_FLIP': {
      return {
        ...state,
        isFlipped: !state.isFlipped,
      };
    }

    case 'UNFLIP_CARD': {
      return {
        ...state,
        isFlipped: false,
      };
    }

    case 'PREV_CARD': {
      if (state.currentIndex <= 0) return state;
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        isFlipped: false,
      };
    }

    case 'NEXT_CARD': {
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        isFlipped: false,
      };
    }

    case 'FINISH_SESSION': {
      return {
        ...state,
        isFlipped: false,
        isFinished: true,
        sessionTimeStr: action.sessionTimeStr,
      };
    }

    case 'START_REVIEW': {
      const reviewSet = new Set(action.ids);
      return {
        ...state,
        studyMode: 'REVIEW',
        sessionNotUnderstood: reviewSet,
        initialSessionSize: reviewSet.size,
        currentIndex: 0,
        isFlipped: false,
        isFinished: false,
        sessionTimeStr: '',
      };
    }

    case 'SWITCH_TO_ALL_MODE': {
      return {
        ...state,
        studyMode: 'ALL',
        currentIndex: 0,
        isFlipped: false,
        isFinished: false,
        sessionTimeStr: '',
        initialSessionSize: 0,
        sessionNotUnderstood: new Set(),
      };
    }

    case 'MARK_NOT_UNDERSTOOD_ALL': {
      const next = new Set(state.allModeNotUnderstood);
      next.add(action.cardId);
      return {
        ...state,
        allModeNotUnderstood: next,
      };
    }

    case 'MARK_UNDERSTOOD_ALL': {
      const next = new Set(state.allModeNotUnderstood);
      next.delete(action.cardId);
      return {
        ...state,
        allModeNotUnderstood: next,
      };
    }

    case 'MARK_UNDERSTOOD_REVIEW': {
      const nextReview = new Set(state.sessionNotUnderstood);
      nextReview.delete(action.cardId);

      const nextAll = new Set(state.allModeNotUnderstood);
      nextAll.delete(action.cardId);

      return {
        ...state,
        sessionNotUnderstood: nextReview,
        allModeNotUnderstood: nextAll,
      };
    }

    case 'RESET_PROGRESS_AND_SESSION': {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
};

interface UseFlashcardSessionParams {
  setId?: string;
  allCards: IFlashcardItem[];
}

export const useFlashcardSession = ({
  setId,
  allCards,
}: UseFlashcardSessionParams) => {
  const [state, dispatch] = useReducer(flashcardSessionReducer, initialState);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!setId) {
      dispatch({ type: 'HYDRATE_ALL_MODE', ids: [] });
      return;
    }

    const notUnderstoodIds = flashcardProgress.getNotUnderstoodCards(setId);
    dispatch({ type: 'HYDRATE_ALL_MODE', ids: notUnderstoodIds });
  }, [setId]);

  const cards = useMemo(() => {
    if (state.studyMode === 'ALL') return allCards;
    return allCards.filter((card) => state.sessionNotUnderstood.has(card.id));
  }, [allCards, state.studyMode, state.sessionNotUnderstood]);

  const totalCards = cards.length;
  const currentCard = cards[state.currentIndex];

  const progressPercent =
    totalCards > 0 ? ((state.currentIndex + 1) / totalCards) * 100 : 0;

  const { notUnderstoodCount, understoodCount } = useMemo(() => {
    if (state.studyMode === 'REVIEW') {
      const notUnderstood = state.sessionNotUnderstood.size;
      return {
        notUnderstoodCount: notUnderstood,
        understoodCount: Math.max(allCards.length - notUnderstood, 0),
      };
    }

    const notUnderstood = state.allModeNotUnderstood.size;
    return {
      notUnderstoodCount: notUnderstood,
      understoodCount: Math.max(allCards.length - notUnderstood, 0),
    };
  }, [
    allCards.length,
    state.allModeNotUnderstood,
    state.sessionNotUnderstood,
    state.studyMode,
  ]);

  useEffect(() => {
    if (!state.isFinished) {
      startTimeRef.current = Date.now();
    }
  }, [state.isFinished, state.studyMode]);

  const finishSession = useCallback(() => {
    const elapsedMs = Date.now() - startTimeRef.current;
    const elapsedSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(elapsedSecs / 60);
    const secs = elapsedSecs % 60;
    const sessionTimeStr =
      mins > 0 ? `${mins} phút ${secs} giây` : `${secs} giây`;

    dispatch({ type: 'FINISH_SESSION', sessionTimeStr });
  }, []);

  const handleNext = useCallback(() => {
    if (state.currentIndex < totalCards - 1) {
      dispatch({ type: 'NEXT_CARD' });
      return;
    }

    finishSession();
  }, [finishSession, state.currentIndex, totalCards]);

  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREV_CARD' });
  }, []);

  const handleFlip = useCallback(() => {
    dispatch({ type: 'TOGGLE_FLIP' });
  }, []);

  const handleReviewNotUnderstood = useCallback(() => {
    const reviewIds =
      state.allModeNotUnderstood.size > 0
        ? Array.from(state.allModeNotUnderstood)
        : flashcardProgress.getNotUnderstoodCards(setId || '');

    dispatch({ type: 'START_REVIEW', ids: reviewIds });
  }, [setId, state.allModeNotUnderstood]);

  const handleNotUnderstood = useCallback(() => {
    if (currentCard && setId && state.studyMode === 'ALL') {
      dispatch({ type: 'MARK_NOT_UNDERSTOOD_ALL', cardId: currentCard.id });
      flashcardProgress.markCardAsNotUnderstood(setId, currentCard.id);
    }

    handleNext();
  }, [currentCard, handleNext, setId, state.studyMode]);

  const handleUnderstood = useCallback(() => {
    if (currentCard && setId) {
      if (state.studyMode === 'REVIEW') {
        dispatch({ type: 'MARK_UNDERSTOOD_REVIEW', cardId: currentCard.id });
        flashcardProgress.markCardAsUnderstood(setId, currentCard.id);

        // REVIEW mode: after removing current card from filtered list,
        // keep the same index to avoid skipping the next card.
        if (totalCards <= 1 || state.currentIndex >= totalCards - 1) {
          finishSession();
        } else {
          dispatch({ type: 'UNFLIP_CARD' });
        }
        return;
      } else {
        dispatch({ type: 'MARK_UNDERSTOOD_ALL', cardId: currentCard.id });
        flashcardProgress.markCardAsUnderstood(setId, currentCard.id);
      }
    }

    handleNext();
  }, [
    currentCard,
    finishSession,
    handleNext,
    setId,
    state.currentIndex,
    state.studyMode,
    totalCards,
  ]);

  const resetProgressAndSession = useCallback(() => {
    if (setId) {
      flashcardProgress.resetSetProgress(setId);
    }

    dispatch({ type: 'RESET_PROGRESS_AND_SESSION' });
    startTimeRef.current = Date.now();
  }, [setId]);

  const switchToAllMode = useCallback(() => {
    dispatch({ type: 'SWITCH_TO_ALL_MODE' });
    startTimeRef.current = Date.now();
  }, []);

  return {
    state,
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
  };
};
