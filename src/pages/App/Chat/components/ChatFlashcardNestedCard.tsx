import { ChevronRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatFlashcardNestedCardProps {
  setId: string;
  title?: string;
  description?: string | null;
  cardCount?: number | null;
}

export default function ChatFlashcardNestedCard({
  setId,
  title,
  description,
  cardCount,
}: ChatFlashcardNestedCardProps) {
  const navigate = useNavigate();

  const goToFlashcardSet = () => {
    navigate(`/app/flashcard/${setId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToFlashcardSet();
    }
  };

  return (
    <button
      type="button"
      className="chat-flashcard-nested"
      onClick={goToFlashcardSet}
      onKeyDown={handleKeyDown}
      aria-label="Mo bo flashcard"
    >
      <div className="chat-flashcard-nested__stack" aria-hidden>
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--back" />
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--mid" />
        <span className="chat-flashcard-nested__layer chat-flashcard-nested__layer--front" />
      </div>

      <div className="chat-flashcard-nested__body">
        <div className="chat-flashcard-nested__title-row">
          <div className="chat-flashcard-nested__icon-wrap">
            <Layers size={14} />
          </div>
          <span className="chat-flashcard-nested__title">
            {title || 'Bo flashcard moi'}
          </span>
        </div>

        {description && (
          <p className="chat-flashcard-nested__description">{description}</p>
        )}

        <div className="chat-flashcard-nested__footer">
          <span className="chat-flashcard-nested__meta">
            {cardCount ? `${cardCount} the` : 'San sang de hoc'}
          </span>
          <span className="chat-flashcard-nested__cta">
            Mo ngay <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}
