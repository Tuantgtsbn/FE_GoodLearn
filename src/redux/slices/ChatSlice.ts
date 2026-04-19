import ApiChat, {
  type IChatConversationListItem,
  type IChatMessageItem,
  type IChatStreamToolResultEvent,
} from '@/api/ApiChat';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IChatConversation, IChatMessage } from '@/types';
import type { ChatSseEvent } from '@/types/chat-sse-events';

export type ReactionType = 'LIKE' | 'DISLIKE' | null;

interface ChatMessageGenerationJob {
  id: string;
  type: 'VIDEO' | 'FLASHCARD';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  progress: number;
  resultType: string | null;
  resultId: string | null;
  errorMessage: string | null;
}

interface ChatMessageMetadata {
  tool?: string;
  toolCallId?: string;
  args?: {
    topic?: string;
    num_cards?: number;
    difficulty?: string;
    style?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ChatMessageWithReaction extends IChatMessage {
  reaction?: ReactionType;
  isStreaming?: boolean;
  toolName?: string | null;
  toolCallId?: string | null;
  metadata?: ChatMessageMetadata | null;
  generationJobId?: string | null;
  generationJob?: ChatMessageGenerationJob | null;
  provider?: string | null;
  model?: string | null;
  finishReason?: string | null;
}

interface ChatState {
  conversations: IChatConversation[];
  activeConversationId: string | null;
  messages: ChatMessageWithReaction[];
  jobEventSequenceById: Record<string, number>;
  isSidebarOpen: boolean;
  isStreaming: boolean;
  inputValue: string;
  loadingConversations: boolean;
  loadingMessages: boolean;
}

const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const toReaction = (like: boolean | null | undefined): ReactionType => {
  if (like === true) return 'LIKE';
  if (like === false) return 'DISLIKE';
  return null;
};

const mapConversation = (
  item: IChatConversationListItem
): IChatConversation => {
  return {
    id: item.id,
    userId: '',
    title: item.title,
    subject: item.subject,
    gradeLevel: item.gradeLevel,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
};

const mapMessage = (item: IChatMessageItem): ChatMessageWithReaction => {
  return {
    messageId: item.messageId,
    conversationId: item.conversationId,
    attachmentFileId: item.attachmentFileId ?? null,
    role: item.role,
    contentType: item.type,
    content: item.content,
    hasAttachment: item.hasAttachment ?? Boolean(item.attachmentUrl),
    attachmentType: item.attachmentType ?? null,
    attachmentUrl: item.attachmentUrl ?? null,
    createdAt: new Date(item.createdAt),
    reaction: toReaction(item.like),
    toolName: item.toolName ?? null,
    toolCallId: item.toolCallId ?? null,
    metadata: (item.metadata as ChatMessageMetadata | null) ?? null,
    generationJobId: item.generationJobId ?? null,
    generationJob: item.generationJob ?? null,
    provider: item.provider ?? null,
    model: item.model ?? null,
    finishReason: item.finishReason ?? null,
    isStreaming: false,
  };
};

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  jobEventSequenceById: {},
  isSidebarOpen: true,
  isStreaming: false,
  inputValue: '',
  loadingConversations: false,
  loadingMessages: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      state.messages = [];
      state.jobEventSequenceById = {};
    },

    changeActiveConversationId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.activeConversationId = action.payload;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },

    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },

    createNewConversation: (state) => {
      state.activeConversationId = null;
      state.messages = [];
      state.jobEventSequenceById = {};
      state.inputValue = '';
      state.isStreaming = false;
    },

    setConversations: (state, action: PayloadAction<IChatConversation[]>) => {
      state.conversations = action.payload;
    },

    setMessages: (state, action: PayloadAction<ChatMessageWithReaction[]>) => {
      state.messages = action.payload;
    },

    applyConversationJobEvent: (state, action: PayloadAction<ChatSseEvent>) => {
      const event = action.payload;
      const previousSequence =
        state.jobEventSequenceById[event.generationJobId] ?? 0;

      if (event.sequence <= previousSequence) {
        return;
      }

      state.jobEventSequenceById[event.generationJobId] = event.sequence;

      const targetMessages = state.messages.filter((message) => {
        if (message.generationJobId === event.generationJobId) {
          return true;
        }

        if (message.toolCallId && message.toolCallId === event.toolCallId) {
          return true;
        }

        if (
          message.metadata &&
          typeof message.metadata.toolCallId === 'string' &&
          message.metadata.toolCallId === event.toolCallId
        ) {
          return true;
        }

        return false;
      });

      if (targetMessages.length === 0) {
        return;
      }

      for (const message of targetMessages) {
        if (!message.generationJob) {
          message.generationJob = {
            id: event.generationJobId,
            type: event.toolName === 'create_video' ? 'VIDEO' : 'FLASHCARD',
            status: 'PENDING',
            progress: 0,
            resultType: null,
            resultId: null,
            errorMessage: null,
          };
        }

        message.generationJobId = event.generationJobId;
        message.toolCallId = event.toolCallId;

        if (!message.metadata) {
          message.metadata = {};
        }

        message.metadata.tool = event.toolName;
        message.metadata.toolCallId = event.toolCallId;

        switch (event.eventType) {
          case 'tool.job.accepted':
          case 'tool.job.progress':
          case 'tool.job.heartbeat':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            break;
          case 'tool.job.stage_changed': {
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;

            const stage = event.payload.stage;
            const timeline = Array.isArray(message.metadata.timeline)
              ? [...message.metadata.timeline]
              : [];
            const existingIndex = timeline.findIndex(
              (item) =>
                typeof item === 'object' &&
                item !== null &&
                (item as { stageId?: string }).stageId === stage.stageId
            );

            if (existingIndex >= 0) {
              timeline[existingIndex] = stage;
            } else {
              timeline.push(stage);
            }

            message.metadata.timelineVersion = event.payload.timelineVersion;
            message.metadata.currentStage = stage;
            message.metadata.timeline = timeline;
            break;
          }
          case 'tool.job.completed':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            message.generationJob.resultType = event.payload.resultType;
            message.generationJob.resultId = event.payload.resultId;
            message.generationJob.errorMessage = null;

            message.metadata.resultId = event.payload.resultId;
            message.metadata.resultUrl = event.payload.resultUrl;
            if (
              event.payload.resultType === 'video' &&
              event.payload.resultUrl
            ) {
              message.attachmentType = 'video';
              message.attachmentUrl = event.payload.resultUrl;
              message.hasAttachment = true;
              message.metadata.videoUrl = event.payload.resultUrl;
            }
            break;
          case 'tool.job.failed':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            message.generationJob.errorMessage = event.payload.error.message;
            break;
          case 'tool.job.canceled':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            break;
          case 'conversation.snapshot':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            message.generationJob.resultType = event.payload.resultType;
            message.generationJob.resultId = event.payload.resultId;
            message.generationJob.errorMessage = event.payload.errorMessage;

            message.metadata.timelineVersion = event.payload.timelineVersion;
            message.metadata.timeline = event.payload.timeline;
            message.metadata.resultId = event.payload.resultId;
            message.metadata.resultUrl = event.payload.resultUrl;

            if (
              event.payload.resultType === 'video' &&
              event.payload.resultUrl
            ) {
              message.attachmentType = 'video';
              message.attachmentUrl = event.payload.resultUrl;
              message.hasAttachment = true;
              message.metadata.videoUrl = event.payload.resultUrl;
            }
            break;
          case 'tool.job.warning':
            message.generationJob.status = event.payload.status;
            message.generationJob.progress = event.payload.progress;
            message.metadata.warningCode = event.payload.warningCode;
            message.metadata.warningMessage = event.payload.warningMessage;
            break;
          default:
            break;
        }
      }
    },

    addUserMessage: (
      state,
      action: PayloadAction<{ content: string; conversationId: string }>
    ) => {
      const userMsg: ChatMessageWithReaction = {
        messageId: `local-user-${generateId()}`,
        conversationId: action.payload.conversationId,
        role: 'user',
        contentType: 'text',
        content: action.payload.content,
        hasAttachment: false,
        attachmentType: null,
        attachmentUrl: null,
        attachmentFileId: null,
        createdAt: new Date(),
      };

      state.messages.push(userMsg);
      state.inputValue = '';
      state.isStreaming = true;
    },

    addAssistantMessage: (
      state,
      action: PayloadAction<{ messageId: string; conversationId: string }>
    ) => {
      const assistantMsg: ChatMessageWithReaction = {
        messageId: action.payload.messageId,
        conversationId: action.payload.conversationId,
        role: 'assistant',
        contentType: 'text',
        content: '',
        hasAttachment: false,
        attachmentType: null,
        attachmentUrl: null,
        attachmentFileId: null,
        isStreaming: true,
        createdAt: new Date(),
      };
      state.messages.push(assistantMsg);
    },

    updateStreamingMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        content: string;
        done?: boolean;
      }>
    ) => {
      const msg = state.messages.find(
        (m) => m.messageId === action.payload.messageId
      );
      if (!msg) {
        return;
      }

      msg.content = action.payload.content;
      if (action.payload.done) {
        msg.isStreaming = false;
        state.isStreaming = false;
      }
    },

    bindStreamingMessageToolResult: (
      state,
      action: PayloadAction<{
        messageId: string;
        payload: IChatStreamToolResultEvent;
      }>
    ) => {
      const targetMessage = state.messages.find(
        (message) => message.messageId === action.payload.messageId
      );

      if (!targetMessage) {
        return;
      }

      const toolPayload = action.payload.payload;
      targetMessage.conversationId = toolPayload.conversationId;
      targetMessage.toolName = toolPayload.tool;
      targetMessage.toolCallId = toolPayload.toolCallId;
      targetMessage.generationJobId = toolPayload.jobId;

      if (!targetMessage.metadata) {
        targetMessage.metadata = {};
      }

      targetMessage.metadata.tool = toolPayload.tool;
      targetMessage.metadata.toolCallId = toolPayload.toolCallId;
      targetMessage.metadata.args = toolPayload.args;

      if (!targetMessage.generationJob) {
        targetMessage.generationJob = {
          id: toolPayload.jobId,
          type: toolPayload.tool === 'create_video' ? 'VIDEO' : 'FLASHCARD',
          status: 'PENDING',
          progress: 0,
          resultType: null,
          resultId: null,
          errorMessage: null,
        };
      }
    },

    setMessageReactionLocal: (
      state,
      action: PayloadAction<{ messageId: string; reaction: ReactionType }>
    ) => {
      const msg = state.messages.find(
        (m) => m.messageId === action.payload.messageId
      );
      if (!msg) {
        return;
      }

      msg.reaction = action.payload.reaction;
    },

    removeMessagesFrom: (state, action: PayloadAction<string>) => {
      const idx = state.messages.findIndex(
        (m) => m.messageId === action.payload
      );
      if (idx !== -1) {
        state.messages = state.messages.slice(0, idx);
      }
    },

    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },

    setLoadingConversations: (state, action: PayloadAction<boolean>) => {
      state.loadingConversations = action.payload;
    },

    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.loadingMessages = action.payload;
    },
  },
});

export const {
  setActiveConversation,
  changeActiveConversationId,
  setSidebarOpen,
  toggleSidebar,
  setInputValue,
  createNewConversation,
  setConversations,
  setMessages,
  applyConversationJobEvent,
  addUserMessage,
  addAssistantMessage,
  updateStreamingMessage,
  bindStreamingMessageToolResult,
  setMessageReactionLocal,
  removeMessagesFrom,
  setIsStreaming,
  setLoadingConversations,
  setLoadingMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

const isLocalConversationId = (conversationId: string | null) => {
  return Boolean(conversationId && conversationId.startsWith('local-conv-'));
};

const getActiveConversationForRequest = (conversationId: string | null) => {
  if (!conversationId || isLocalConversationId(conversationId)) {
    return undefined;
  }

  return conversationId;
};

export const loadConversations =
  () => async (dispatch: (action: unknown) => void) => {
    dispatch(setLoadingConversations(true));
    try {
      const result = await ApiChat.getChatConversations({
        page: 1,
        limit: 50,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });

      const mapped = result.data.map(mapConversation);
      dispatch(setConversations(mapped));
    } catch {
      dispatch(setConversations([]));
    } finally {
      dispatch(setLoadingConversations(false));
    }
  };

export const loadMessages =
  (conversationId: string) => async (dispatch: (action: unknown) => void) => {
    if (isLocalConversationId(conversationId)) {
      return;
    }

    dispatch(setLoadingMessages(true));
    try {
      const result = await ApiChat.getChatMessages(conversationId, {
        page: 1,
        limit: 100,
        sortOrder: 'asc',
        includeToolMessages: false,
      });

      dispatch(setMessages(result.data.map(mapMessage)));
    } catch {
      dispatch(setMessages([]));
    } finally {
      dispatch(setLoadingMessages(false));
    }
  };

export const initializeChat =
  () =>
  async (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    await dispatch(loadConversations() as unknown as never);

    const state = getState().chat;
    if (!state.activeConversationId && state.conversations.length > 0) {
      const firstId = state.conversations[0]!.id;
      dispatch(setActiveConversation(firstId));
      await dispatch(loadMessages(firstId) as unknown as never);
      return;
    }

    if (
      state.activeConversationId &&
      !isLocalConversationId(state.activeConversationId)
    ) {
      await dispatch(
        loadMessages(state.activeConversationId) as unknown as never
      );
    }
  };

export const selectConversation =
  (conversationId: string) => async (dispatch: (action: unknown) => void) => {
    dispatch(setActiveConversation(conversationId));
    await dispatch(loadMessages(conversationId) as unknown as never);
  };

export const sendMessage =
  (content: string) =>
  async (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    const currentState = getState().chat;

    let localConversationId = currentState.activeConversationId;
    if (!localConversationId) {
      localConversationId = `local-conv-${generateId()}`;

      const now = new Date();
      const localConversation: IChatConversation = {
        id: localConversationId,
        userId: '',
        title: content.slice(0, 60),
        subject: null,
        gradeLevel: null,
        createdAt: now,
        updatedAt: now,
      };

      dispatch(
        setConversations([localConversation, ...currentState.conversations])
      );
      dispatch(setActiveConversation(localConversationId));
    }

    dispatch(addUserMessage({ content, conversationId: localConversationId }));

    const localAssistantId = `local-assistant-${generateId()}`;
    dispatch(
      addAssistantMessage({
        messageId: localAssistantId,
        conversationId: localConversationId,
      })
    );

    let streamedContent = '';
    let pendingTokenChunk = '';
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    let doneConversationId: string | null = null;

    const flushBufferedTokens = () => {
      if (!pendingTokenChunk) {
        return;
      }

      streamedContent += pendingTokenChunk;
      pendingTokenChunk = '';

      dispatch(
        updateStreamingMessage({
          messageId: localAssistantId,
          content: streamedContent,
        })
      );
    };

    const scheduleFlush = () => {
      if (flushTimer) {
        return;
      }

      flushTimer = setTimeout(() => {
        flushTimer = null;
        flushBufferedTokens();
      }, 40);
    };

    const stopFlushTimer = () => {
      if (!flushTimer) {
        return;
      }

      clearTimeout(flushTimer);
      flushTimer = null;
    };

    // Tạo AbortController để có thể cancel stream nếu cần
    const streamAbortController = new AbortController();

    try {
      await ApiChat.streamChat(
        {
          conversationId: getActiveConversationForRequest(localConversationId),
          message: content,
        },
        {
          signal: streamAbortController.signal,
          onToken: (token) => {
            pendingTokenChunk += token;
            scheduleFlush();
          },
          onDone: (payload) => {
            doneConversationId = payload.conversationId;
          },
          onToolResult: (payload) => {
            dispatch(
              bindStreamingMessageToolResult({
                messageId: localAssistantId,
                payload,
              })
            );
          },
          onError: (event) => {
            console.warn('[sendMessage] Stream error:', event.message);
            stopFlushTimer();
            flushBufferedTokens();
            dispatch(
              updateStreamingMessage({
                messageId: localAssistantId,
                content: event.message,
                done: true,
              })
            );
          },
        }
      );

      stopFlushTimer();
      flushBufferedTokens();

      dispatch(
        updateStreamingMessage({
          messageId: localAssistantId,
          content:
            streamedContent ||
            'Da gui yeu cau. Dang dong bo ket qua tu server...',
          done: true,
        })
      );

      await dispatch(loadConversations() as unknown as never);

      const finalConversationId =
        doneConversationId || getState().chat.conversations[0]?.id || null;

      if (finalConversationId) {
        dispatch(changeActiveConversationId(finalConversationId));
        await dispatch(loadMessages(finalConversationId) as unknown as never);
      }
    } catch (error) {
      console.error('[sendMessage] Streaming error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Khong the ket noi den chat service';

      dispatch(
        updateStreamingMessage({
          messageId: localAssistantId,
          content: errorMessage,
          done: true,
        })
      );
      dispatch(setIsStreaming(false));
    } finally {
      stopFlushTimer();
    }
  };

export const setMessageReaction =
  ({ messageId, reaction }: { messageId: string; reaction: ReactionType }) =>
  async (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    const message = getState().chat.messages.find(
      (m) => m.messageId === messageId
    );
    if (!message) {
      return;
    }

    const current = message.reaction ?? null;
    const nextReaction = current === reaction ? null : reaction;

    dispatch(setMessageReactionLocal({ messageId, reaction: nextReaction }));

    try {
      const like = nextReaction === null ? null : nextReaction === 'LIKE';
      await ApiChat.updateChatMessageLike(messageId, { like });
    } catch {
      dispatch(setMessageReactionLocal({ messageId, reaction: current }));
    }
  };

export const regenerateMessage =
  (messageId: string) =>
  async (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    const state = getState().chat;
    const currentMessages = state.messages;
    const targetIndex = currentMessages.findIndex(
      (m) => m.messageId === messageId
    );
    if (targetIndex === -1) {
      return;
    }

    const previousUserMessage = [...currentMessages.slice(0, targetIndex)]
      .reverse()
      .find((m) => m.role === 'user');

    if (!previousUserMessage) {
      return;
    }

    await dispatch(
      sendMessage(previousUserMessage.content) as unknown as never
    );
  };
