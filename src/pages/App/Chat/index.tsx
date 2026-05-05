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
  loadMessages,
  selectConversation,
} from '@/redux/slices/ChatSlice';
import ApiChat from '@/api/ApiChat';
import { useDialog } from '@/context/DialogContext';
import ModalWarningChat from '@/components/ModalWarningChat';
import { setCookie, getCookie } from '@/utils/cookie';
import './chat.scss';

export default function ChatPage() {
  const dispatch = useDispatch<IAppDispatch>();
  const isSidebarOpen = useSelector(
    (state: IRootState) => state.chat.isSidebarOpen
  );
  const activeConversationId = useSelector(
    (state: IRootState) => state.chat.activeConversationId
  );
  const messages = useSelector((state: IRootState) => state.chat.messages);
  const loadingMessages = useSelector(
    (state: IRootState) => state.chat.loadingMessages
  );
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { createDialog } = useDialog();

  useEffect(() => {
    const hasSeenWarning = getCookie('chat_warning_seen');
    if (!hasSeenWarning) {
      void createDialog(ModalWarningChat);
      setCookie('chat_warning_seen', 'true', 12);
    }
  }, [createDialog]);

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
        const isTerminalToolEvent =
          event.eventType === 'tool.job.completed' ||
          event.eventType === 'tool.job.failed' ||
          event.eventType === 'tool.job.canceled';

        if (isTerminalToolEvent) {
          dispatch(
            loadMessages(activeConversationId) as unknown as Parameters<
              typeof dispatch
            >[0]
          );
        }
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
        dispatch(
          loadMessages(activeConversationId) as unknown as Parameters<
            typeof dispatch
          >[0]
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

  useEffect(() => {
    if (
      !activeConversationId ||
      activeConversationId.startsWith('local-conv-')
    ) {
      return;
    }

    const hasPendingJob = messages.some((message) => {
      const status = message.generationJob?.status;
      return Boolean(
        status && !['COMPLETED', 'FAILED', 'CANCELED'].includes(status)
      );
    });

    if (!hasPendingJob) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (loadingMessages) {
        return;
      }

      dispatch(
        loadMessages(activeConversationId) as unknown as Parameters<
          typeof dispatch
        >[0]
      );
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeConversationId, messages, loadingMessages, dispatch]);

  return (
    <div className="chat-layout">
      <ChatSidebar isOpen={isSidebarOpen} />
      <ChatArea />
    </div>
  );
}
