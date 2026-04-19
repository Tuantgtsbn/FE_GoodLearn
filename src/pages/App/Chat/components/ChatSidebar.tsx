import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { IRootState } from '@/redux/store';
import {
  selectConversation,
  createNewConversation,
  toggleSidebar,
} from '@/redux/slices/ChatSlice';
import { Plus, MessageSquare, Settings } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import clsx from 'clsx';

interface ChatSidebarProps {
  isOpen: boolean;
}

export default function ChatSidebar({ isOpen }: ChatSidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, activeConversationId } = useSelector(
    (state: IRootState) => state.chat
  );
  const user = useSelector((state: IRootState) => state.auth.user);

  const handleSelectConversation = (id: string) => {
    dispatch(
      selectConversation(id) as unknown as Parameters<typeof dispatch>[0]
    );
    navigate(`/app/chat/${id}`);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      dispatch(toggleSidebar());
    }
  };

  const handleNewChat = () => {
    dispatch(createNewConversation());
    navigate('/app/chat');
    if (window.innerWidth < 768) {
      dispatch(toggleSidebar());
    }
  };

  // Group conversations by time
  const today = new Date();
  const todayConvs = conversations.filter((c) => {
    const d = new Date(c.updatedAt);
    return d.toDateString() === today.toDateString();
  });
  const olderConvs = conversations.filter((c) => {
    const d = new Date(c.updatedAt);
    return d.toDateString() !== today.toDateString();
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <aside
        className={clsx('chat-sidebar', {
          'chat-sidebar--closed': !isOpen,
        })}
      >
        {/* Header */}
        <div className="chat-sidebar__header">
          <button className="chat-sidebar__new-chat" onClick={handleNewChat}>
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="chat-sidebar__list">
          {todayConvs.length > 0 && (
            <>
              <div className="chat-sidebar__section-title">Hôm nay</div>
              {todayConvs.map((conv) => (
                <div
                  key={conv.id}
                  className={clsx('chat-sidebar__item', {
                    'chat-sidebar__item--active':
                      conv.id === activeConversationId,
                  })}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <MessageSquare
                    size={15}
                    className="chat-sidebar__item-icon"
                  />
                  <span className="chat-sidebar__item-title">{conv.title}</span>
                </div>
              ))}
            </>
          )}

          {olderConvs.length > 0 && (
            <>
              <div className="chat-sidebar__section-title">Trước đó</div>
              {olderConvs.map((conv) => (
                <div
                  key={conv.id}
                  className={clsx('chat-sidebar__item', {
                    'chat-sidebar__item--active':
                      conv.id === activeConversationId,
                  })}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <MessageSquare
                    size={15}
                    className="chat-sidebar__item-icon"
                  />
                  <span className="chat-sidebar__item-title">{conv.title}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="chat-sidebar__footer">
          <div className="chat-sidebar__footer-item">
            <Settings size={16} />
            <span>Cài đặt</span>
          </div>
          {user && (
            <div className="chat-sidebar__footer-item">
              <Avatar
                name={user.fullName || user.username || 'U'}
                src={user.avatarUrl}
                size="xs"
              />
              <span>{user.fullName || user.username || 'Người dùng'}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
