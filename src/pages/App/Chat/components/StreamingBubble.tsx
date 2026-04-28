import { Bot } from 'lucide-react';
import clsx from 'clsx';
import type { ChatMessageWithReaction } from '@/redux/slices/ChatSlice';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface StreamingBubbleProps {
  message: ChatMessageWithReaction;
}

const MARKDOWN_REMARK_PLUGINS = [remarkGfm];
const MARKDOWN_REHYPE_PLUGINS = [rehypeHighlight];

function StreamingBubble({ message }: StreamingBubbleProps) {
  const isUser = message.role === 'user';
  const hasContent = message.content.length > 0;

  // Memoize content for ReactMarkdown to avoid unnecessary re-parses
  // on unrelated re-renders
  const markdownContent = useMemo(() => message.content, [message.content]);

  return (
    <div
      className={clsx('chat-message', {
        'chat-message--user': isUser,
        'chat-message--assistant': !isUser,
        'chat-message--streaming': !isUser,
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
          {hasContent ? (
            <div className="chat-message__streaming-markdown">
              <ReactMarkdown
                remarkPlugins={MARKDOWN_REMARK_PLUGINS}
                rehypePlugins={MARKDOWN_REHYPE_PLUGINS}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="chat-message__thinking-indicator">
              <span className="chat-message__thinking-dot" />
              <span className="chat-message__thinking-dot" />
              <span className="chat-message__thinking-dot" />
            </div>
          )}
          <span className="chat-message__streaming-cursor" />
        </div>
      </div>
    </div>
  );
}

export default memo(StreamingBubble);
