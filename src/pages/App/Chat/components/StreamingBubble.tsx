import { Bot } from 'lucide-react';
import clsx from 'clsx';
import type { ChatMessageWithReaction } from '@/redux/slices/ChatSlice';

interface StreamingBubbleProps {
  message: ChatMessageWithReaction;
}

export default function StreamingBubble({ message }: StreamingBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx('chat-message', {
        'chat-message--user': isUser,
        'chat-message--assistant': !isUser,
      })}
    >
      {!isUser && (
        <div className="chat-message__avatar chat-message__avatar--bot">
          <Bot size={18} />
        </div>
      )}

      <div
        className={clsx('chat-message__body', {
          'chat-message__body--user': isUser,
        })}
      >
        <div className="chat-message__content">
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          <span className="chat-message__streaming-cursor" />
        </div>
      </div>
    </div>
  );
}
