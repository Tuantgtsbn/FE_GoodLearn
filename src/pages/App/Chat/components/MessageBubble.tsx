import { useDispatch, useSelector } from 'react-redux';
import type { IRootState, IAppDispatch } from '@/redux/store';
import {
  setMessageReaction,
  regenerateMessage,
  type ChatMessageWithReaction,
} from '@/redux/slices/ChatSlice';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCcw,
  Bot,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import clsx from 'clsx';
import Avatar from '@/components/ui/Avatar';
import { useState, useCallback } from 'react';

interface MessageBubbleProps {
  message: ChatMessageWithReaction;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const dispatch = useDispatch<IAppDispatch>();
  const user = useSelector((state: IRootState) => state.auth.user);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const handleReaction = useCallback(
    (reaction: 'LIKE' | 'DISLIKE') => {
      dispatch(setMessageReaction({ messageId: message.messageId, reaction }));
    },
    [dispatch, message.messageId]
  );

  const handleRegenerate = useCallback(() => {
    dispatch(
      regenerateMessage(message.messageId) as unknown as Parameters<
        typeof dispatch
      >[0]
    );
  }, [dispatch, message.messageId]);

  return (
    <div
      className={clsx('chat-message', {
        'chat-message--user': isUser,
        'chat-message--assistant': isAssistant,
      })}
    >
      {/* Avatar */}
      {isAssistant && (
        <div className="chat-message__avatar chat-message__avatar--bot">
          <Bot size={18} />
        </div>
      )}

      <div
        className={clsx('chat-message__body', {
          'chat-message__body--user': isUser,
        })}
      >
        {/* Content */}
        <div className="chat-message__content">
          {isUser ? (
            message.content
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="chat-message__streaming-cursor" />
              )}
            </>
          )}
        </div>

        {/* Actions (only for assistant messages, visible on hover) */}
        {isAssistant && !message.isStreaming && message.content && (
          <div className="chat-message__actions">
            <button
              className="chat-message__action-btn"
              onClick={handleCopy}
              title={copied ? 'Đã sao chép' : 'Sao chép'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              className={clsx('chat-message__action-btn', {
                'chat-message__action-btn--active': message.reaction === 'LIKE',
              })}
              onClick={() => handleReaction('LIKE')}
              title="Thích"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              className={clsx('chat-message__action-btn', {
                'chat-message__action-btn--active':
                  message.reaction === 'DISLIKE',
              })}
              onClick={() => handleReaction('DISLIKE')}
              title="Không thích"
            >
              <ThumbsDown size={14} />
            </button>
            <button
              className="chat-message__action-btn"
              onClick={handleRegenerate}
              title="Tạo lại"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <Avatar
          name={user?.fullName || user?.username || 'U'}
          src={user?.avatarUrl}
          size="xs"
        />
      )}
    </div>
  );
}
