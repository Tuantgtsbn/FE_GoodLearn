import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import type { IRootState, IAppDispatch } from '@/redux/store';
import {
  applyConversationJobEvent,
  createNewConversation,
  initializeChat,
  selectConversation,
} from '@/redux/slices/ChatSlice';
import ApiChat from '@/api/ApiChat';
import './chat.scss';

export default function ChatPage() {
  const dispatch = useDispatch<IAppDispatch>();
  const isSidebarOpen = useSelector(
    (state: IRootState) => state.chat.isSidebarOpen
  );
  const activeConversationId = useSelector(
    (state: IRootState) => state.chat.activeConversationId
  );
  const { conversationId } = useParams<{ conversationId?: string }>();

  useEffect(() => {
    dispatch(initializeChat() as unknown as Parameters<typeof dispatch>[0]);
  }, [dispatch]);

  useEffect(() => {
    if (conversationId) {
      dispatch(
        selectConversation(conversationId) as unknown as Parameters<
          typeof dispatch
        >[0]
      );
    } else {
      dispatch(createNewConversation());
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (
      !activeConversationId ||
      activeConversationId.startsWith('local-conv-')
    ) {
      return;
    }

    const abortController = new AbortController();

    void ApiChat.streamConversationEventsWithReconnect(activeConversationId, {
      signal: abortController.signal,
      onEvent: (event) => {
        dispatch(applyConversationJobEvent(event));
      },
      onReconnectAttempt: (attempt, delayMs, reason) => {
        console.warn(
          `[conversation-events] reconnect attempt #${attempt} in ${delayMs}ms (${reason})`
        );
      },
      onReconnectSuccess: (recoveredAfterAttempts) => {
        console.info(
          `[conversation-events] reconnected after ${recoveredAfterAttempts} attempt(s)`
        );
      },
      onError: (error) => {
        console.warn('[conversation-events] stream stopped:', error.message);
      },
    }).catch((error: unknown) => {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.warn('[conversation-events] stream closed:', error);
    });

    return () => {
      abortController.abort();
    };
  }, [activeConversationId, dispatch]);

  return (
    <div className="chat-layout">
      <ChatSidebar isOpen={isSidebarOpen} />
      <ChatArea />
    </div>
  );
}
