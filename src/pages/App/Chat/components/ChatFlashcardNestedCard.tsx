import { ChevronRight, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FlashcardJobStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED';

interface ChatFlashcardNestedCardProps {
  setId?: string | null;
  title?: string;
  description?: string | null;
  cardCount?: number | null;
  progress?: number;
  status?: FlashcardJobStatus;
}

export default function ChatFlashcardNestedCard({
  setId,
  title,
  description,
  cardCount,
  progress,
  status,
}: ChatFlashcardNestedCardProps) {
  const navigate = useNavigate();

  const isCompleted = status === 'COMPLETED' && Boolean(setId);
  const isFailed = status === 'FAILED';
  const isInProgress = status === 'IN_PROGRESS' || status === 'PENDING';

  const goToFlashcardSet = () => {
    if (!isCompleted || !setId) return;
    navigate(`/app/flashcard/${setId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToFlashcardSet();
    }
  };

  const statusText = isFailed
    ? 'Tao flashcard that bai'
    : isInProgress
      ? `Dang tao flashcard... ${progress ?? 0}%`
      : isCompleted
        ? `${cardCount ? `${cardCount} the` : 'San sang de hoc'}`
        : 'Dang cho xu ly';

  return (
    <button
      type="button"
      className="chat-flashcard-nested"
      onClick={goToFlashcardSet}
      onKeyDown={handleKeyDown}
      disabled={!isCompleted}
      aria-label={isCompleted ? 'Mo bo flashcard' : statusText}
      style={{ cursor: isCompleted ? 'pointer' : 'default' }}
    >
      <div className="chat-flashcard-nested__stack" aria-hidden>
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--back" />
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--mid" />
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--front" />
      </div>

      <div className="chat-flashcard-nested__body">
        <div className="chat-flashcard-nested__title-row">
          <div className="chat-flashcard-nested__icon-wrap">
            {isInProgress ? (
              <Loader2 size={14} className="chat-flashcard-nested__spinner" />
            ) : (
              <Layers size={14} />
            )}
          </div>
          <span className="chat-flashcard-nested__title">
            {title || 'Bo flashcard moi'}
          </span>
        </div>

        {/* Progress bar khi đang xử lý */}
        {isInProgress && (
          <div className="chat-flashcard-nested__progress-wrap">
            <div
              className="chat-flashcard-nested__progress-bar"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        )}

        {description && (
          <p className="chat-flashcard-nested__description">{description}</p>
        )}

        <div className="chat-flashcard-nested__footer">
          <span
            className="chat-flashcard-nested__meta"
            style={{
              color: isFailed ? 'var(--color-error, #ef4444)' : undefined,
            }}
          >
            {statusText}
          </span>
          {isCompleted && (
            <span className="chat-flashcard-nested__cta">
              Mo ngay <ChevronRight size={14} />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
