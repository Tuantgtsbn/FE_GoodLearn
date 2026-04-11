import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import { useSelector } from 'react-redux';
import type { IRootState } from '@/redux/store';
import './chat.scss';

export default function ChatPage() {
  const isSidebarOpen = useSelector(
    (state: IRootState) => state.chat.isSidebarOpen
  );

  return (
    <div className="chat-layout">
      <ChatSidebar isOpen={isSidebarOpen} />
      <ChatArea />
    </div>
  );
}
