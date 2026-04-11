import { useSelector, useDispatch } from 'react-redux';
import type { IRootState, IAppDispatch } from '@/redux/store';
import { toggleSidebar, sendMessage } from '@/redux/slices/ChatSlice';
import { PanelLeftClose, PanelLeft, Settings2, Share2 } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useRef, useEffect } from 'react';

export default function ChatArea() {
  const dispatch = useDispatch<IAppDispatch>();
  const {
    activeConversationId,
    messages,
    isSidebarOpen,
    conversations,
    isStreaming,
  } = useSelector((state: IRootState) => state.chat);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      {isWelcomeScreen && messages.length === 0 ? (
        <WelcomeScreen onSendStarter={handleSend} />
      ) : (
        <div className="chat-area__messages">
          {messages.map((msg) => (
            <MessageBubble key={msg.messageId} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
