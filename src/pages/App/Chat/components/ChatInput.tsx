import {
  useRef,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { IRootState } from '@/redux/store';
import { setInputValue } from '@/redux/slices/ChatSlice';
import { ArrowUp, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const dispatch = useDispatch();
  const inputValue = useSelector((state: IRootState) => state.chat.inputValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setInputValue(e.target.value));
      adjustHeight();
    },
    [dispatch, adjustHeight]
  );

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = inputValue.trim().length > 0 && !disabled;

  return (
    <div className="chat-input">
      <div className="chat-input__wrapper">
        <button
          className="chat-input__attach-btn"
          title="Đính kèm tệp"
          type="button"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-input__textarea"
          placeholder="Nhập câu hỏi của bạn..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />

        <button
          className="chat-input__send-btn"
          onClick={handleSend}
          disabled={!canSend}
          title="Gửi tin nhắn"
          type="button"
        >
          <ArrowUp size={18} />
        </button>
      </div>

      <div className="chat-input__hint">
        StudyBot có thể mắc sai sót. Hãy kiểm tra các thông tin quan trọng.
      </div>
    </div>
  );
}
