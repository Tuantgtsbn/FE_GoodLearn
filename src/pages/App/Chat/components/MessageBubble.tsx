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
import { useState, useCallback, memo } from 'react';
import ChatFlashcardNestedCard from './ChatFlashcardNestedCard';
import VideoMessage from './VideoMessage';

interface MessageBubbleProps {
  message: ChatMessageWithReaction;
}

const MARKDOWN_REMARK_PLUGINS = [remarkGfm];
const MARKDOWN_REHYPE_PLUGINS = [rehypeHighlight];

function MessageBubble({ message }: MessageBubbleProps) {
  const dispatch = useDispatch<IAppDispatch>();
  const user = useSelector((state: IRootState) => state.auth.user);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const generationJob = message.generationJob;
  const metadata = message.metadata;
  const metadataTool =
    typeof metadata?.tool === 'string' ? metadata.tool : undefined;

  const isFlashcardFlow =
    metadataTool === 'create_flashcard' ||
    message.toolName === 'create_flashcard';

  const isVideoFlow =
    metadataTool === 'create_video' || message.toolName === 'create_video';

  const flashcardSetId =
    generationJob?.status === 'COMPLETED' &&
    generationJob?.resultType === 'flashcard_set' &&
    generationJob?.resultId
      ? generationJob.resultId
      : null;

  const shouldRenderFlashcardNested =
    isFlashcardFlow && Boolean(flashcardSetId);

  const videoId =
    generationJob?.status === 'COMPLETED' &&
    generationJob?.resultType === 'video' &&
    generationJob?.resultId
      ? generationJob.resultId
      : null;

  const shouldRenderVideoMessage =
    isVideoFlow &&
    Boolean(videoId || message.generationJobId || message.attachmentUrl);

  const flashcardTopic =
    typeof metadata?.args?.topic === 'string' ? metadata.args.topic : undefined;
  const flashcardTitle = flashcardTopic
    ? `Flashcard: ${flashcardTopic}`
    : 'Bo flashcard da tao xong';
  const flashcardCardCount =
    typeof metadata?.args?.num_cards === 'number'
      ? metadata.args.num_cards
      : undefined;

  const videoTitle =
    typeof metadata?.args?.topic === 'string'
      ? `Video: ${metadata.args.topic}`
      : 'Video da tao xong';

  const videoDescription =
    typeof metadata?.args?.style === 'string'
      ? `Style: ${metadata.args.style}`
      : null;

  const videoUrl =
    typeof message.attachmentUrl === 'string' &&
    message.attachmentUrl.length > 0
      ? message.attachmentUrl
      : typeof metadata?.videoUrl === 'string'
        ? metadata.videoUrl
        : typeof metadata?.resultUrl === 'string'
          ? metadata.resultUrl
          : null;

  const hideToolRawContent =
    message.role === 'tool' &&
    (shouldRenderFlashcardNested || shouldRenderVideoMessage);

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
        'chat-message--streaming': isAssistant && Boolean(message.isStreaming),
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
              {!hideToolRawContent &&
                (message.isStreaming ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={MARKDOWN_REMARK_PLUGINS}
                    rehypePlugins={MARKDOWN_REHYPE_PLUGINS}
                  >
                    {message.content}
                  </ReactMarkdown>
                ))}

              {shouldRenderFlashcardNested && flashcardSetId && (
                <ChatFlashcardNestedCard
                  setId={flashcardSetId}
                  title={flashcardTitle}
                  description={
                    typeof metadata?.args?.difficulty === 'string'
                      ? `Do kho: ${metadata.args.difficulty}`
                      : null
                  }
                  cardCount={flashcardCardCount}
                />
              )}

              {shouldRenderVideoMessage && (
                <VideoMessage
                  videoId={
                    videoId || message.generationJobId || message.messageId
                  }
                  title={videoTitle}
                  description={videoDescription}
                  progress={generationJob?.progress}
                  status={generationJob?.status}
                  videoUrl={videoUrl}
                />
              )}

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

export default memo(MessageBubble);
