import { useSelector, useDispatch } from 'react-redux';
import type { IRootState, IAppDispatch } from '@/redux/store';
import {
  toggleSidebar,
  sendMessage,
  initializeChat,
} from '@/redux/slices/ChatSlice';
import { PanelLeftClose, PanelLeft, Settings2, Share2 } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import StreamingBubble from './StreamingBubble';
import ChatInput from './ChatInput';
import { useRef, useEffect, useMemo, useCallback } from 'react';

export default function ChatArea() {
  const dispatch = useDispatch<IAppDispatch>();
  const {
    activeConversationId,
    messages,
    isSidebarOpen,
    conversations,
    isStreaming,
  } = useSelector((state: IRootState) => state.chat);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.role !== 'tool'),
    [messages]
  );

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return true;
    }

    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceToBottom <= 120;
  }, []);

  const handleMessagesScroll = useCallback(() => {
    shouldStickToBottomRef.current = isNearBottom();
  }, [isNearBottom]);

  // Auto-scroll to bottom only when user is already near the bottom.
  useEffect(() => {
    if (!shouldStickToBottomRef.current && !isStreaming) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: isStreaming ? 'auto' : 'smooth',
    });
  }, [visibleMessages, isStreaming]);

  useEffect(() => {
    dispatch(initializeChat() as unknown as Parameters<typeof dispatch>[0]);
  }, [dispatch]);

  const handleSend = (content: string) => {
    dispatch(sendMessage(content) as unknown as Parameters<typeof dispatch>[0]);
  };

  const isWelcomeScreen = !activeConversationId;

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-area__header">
        <button
          className="chat-area__toggle-btn"
          onClick={() => dispatch(toggleSidebar())}
          title={isSidebarOpen ? 'Ẩn sidebar' : 'Hiện sidebar'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeft size={18} />
          )}
        </button>

        <div className="chat-area__title-group">
          <div className="chat-area__title">
            {activeConversation?.title || 'Cuộc trò chuyện mới'}
          </div>
          {activeConversation && (
            <div className="chat-area__subtitle">
              {activeConversation.subject || 'Trợ lý AI'} •{' '}
              {new Date(activeConversation.updatedAt).toLocaleDateString(
                'vi-VN'
              )}
            </div>
          )}
        </div>

        <div className="chat-area__actions">
          <button className="chat-area__action-btn" title="Chia sẻ">
            <Share2 size={16} />
          </button>
          <button className="chat-area__action-btn" title="Cài đặt">
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isWelcomeScreen && visibleMessages.length === 0 ? (
        <WelcomeScreen onSendStarter={handleSend} />
      ) : (
        <div
          className="chat-area__messages"
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
        >
          {visibleMessages.map((msg) =>
            msg.isStreaming ? (
              <StreamingBubble key={msg.messageId} message={msg} />
            ) : (
              <MessageBubble key={msg.messageId} message={msg} />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
