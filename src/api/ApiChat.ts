import Config from '@/config';
import { getAccessToken } from '@/utils/auth';
import { fetcher, fetcherWithMetadata } from './Fetcher';
import { isChatSseEvent, type ChatSseEvent } from '@/types/chat-sse-events';

export interface IChatConversationListApiQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IChatMessageListApiQuery {
  page?: string | number;
  limit?: string | number;
  sortOrder?: 'asc' | 'desc';
  includeToolMessages?: boolean;
}

export interface IChatGenerationJobInMessage {
  id: string;
  type: 'VIDEO' | 'FLASHCARD';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  progress: number;
  resultType: string | null;
  resultId: string | null;
  errorMessage: string | null;
}

export interface IChatConversationListItem {
  id: string;
  title: string | null;
  subject: string | null;
  gradeLevel: number | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessageItem {
  messageId: string;
  conversationId: string;
  attachmentFileId?: string | null;
  role: 'user' | 'assistant' | 'system' | 'tool' | string;
  type: string;
  content: string;
  hasAttachment?: boolean;
  attachmentType?: string | null;
  attachmentUrl?: string | null;
  provider?: string | null;
  model?: string | null;
  finishReason?: string | null;
  toolName?: string | null;
  toolCallId?: string | null;
  toolArguments?: Record<string, unknown> | null;
  toolResult?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  generationJobId?: string | null;
  like?: boolean | null;
  createdAt: string;
  generationJob?: IChatGenerationJobInMessage | null;
}

export interface IUpdateChatMessageLikePayload {
  like: boolean | null;
}

export interface IUpdateChatMessageLikeResponse {
  messageId: string;
  like: boolean | null;
}

export interface IChatStreamRequestPayload {
  conversationId?: string;
  message: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export type IChatStreamConnectedEvent = {
  type: 'connected';
};

export type IChatStreamTokenEvent = {
  type: 'token';
  token: string;
};

export type IChatStreamToolResultEvent = {
  type: 'tool_result';
  tool: 'create_video' | 'create_flashcard';
  jobId: string;
  args: Record<string, unknown>;
  conversationId: string;
  toolCallId: string;
};

export type IChatStreamDoneEvent = {
  type: 'done';
  conversationId: string;
  assistantMessageId: string;
  finishReason: string | null;
};

export type IChatStreamErrorEvent = {
  type: 'error';
  message: string;
};

export type IChatStreamEvent =
  | IChatStreamConnectedEvent
  | IChatStreamTokenEvent
  | IChatStreamToolResultEvent
  | IChatStreamDoneEvent
  | IChatStreamErrorEvent;

export interface IChatStreamHandlers {
  signal?: AbortSignal;
  onConnected?: () => void;
  onToken?: (token: string) => void;
  onToolResult?: (event: IChatStreamToolResultEvent) => void;
  onDone?: (event: IChatStreamDoneEvent) => void;
  onError?: (event: IChatStreamErrorEvent) => void;
  onEvent?: (event: IChatStreamEvent) => void;
}

export interface IConversationEventsHandlers {
  signal?: AbortSignal;
  onConnected?: () => void;
  onEvent?: (event: ChatSseEvent) => void;
  onError?: (error: Error) => void;
}

export interface IConversationEventsReconnectOptions {
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitterRatio?: number;
  maxReconnectAttempts?: number;
}

export interface IConversationEventsReconnectHandlers extends IConversationEventsHandlers {
  reconnectOptions?: IConversationEventsReconnectOptions;
  onReconnectAttempt?: (
    attempt: number,
    delayMs: number,
    reason: string
  ) => void;
  onReconnectSuccess?: (recoveredAfterAttempts: number) => void;
}

const path = {
  conversations: '/chat/conversations',
  messages: (conversationId: string) =>
    `/chat/conversations/${conversationId}/messages`,
  conversationEvents: (conversationId: string) =>
    `/chat/conversations/${conversationId}/events`,
  likeMessage: (messageId: string) => `/chat/messages/${messageId}/like`,
  stream: '/chat/stream',
};

const CHAT_SSE_CONNECT_TIMEOUT_MS = Number(
  import.meta.env.VITE_CHAT_SSE_CONNECT_TIMEOUT_MS || 90000
);

const CONVERSATION_SSE_RECONNECT_BASE_DELAY_MS = Number(
  import.meta.env.VITE_CONVERSATION_SSE_RECONNECT_BASE_DELAY_MS || 1000
);

const CONVERSATION_SSE_RECONNECT_MAX_DELAY_MS = Number(
  import.meta.env.VITE_CONVERSATION_SSE_RECONNECT_MAX_DELAY_MS || 30000
);

const CONVERSATION_SSE_RECONNECT_JITTER_RATIO = Number(
  import.meta.env.VITE_CONVERSATION_SSE_RECONNECT_JITTER_RATIO || 0.2
);

const CONVERSATION_SSE_MAX_RECONNECT_ATTEMPTS = Number(
  import.meta.env.VITE_CONVERSATION_SSE_MAX_RECONNECT_ATTEMPTS || 0
);

type ErrorWithStatus = Error & { status?: number };

const createAbortError = () => new DOMException('Aborted', 'AbortError');

const isAbortError = (error: unknown) => {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' || /abort/i.test(error.message))
  );
};

const getErrorStatus = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number'
  ) {
    return (error as { status: number }).status;
  }

  return null;
};

const isRetriableConversationStreamError = (error: unknown) => {
  if (isAbortError(error)) {
    return false;
  }

  const status = getErrorStatus(error);
  if (status !== null && [400, 401, 403, 404, 422].includes(status)) {
    return false;
  }

  return true;
};

const waitWithAbort = async (delayMs: number, signal?: AbortSignal) => {
  if (!signal) {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    return;
  }

  if (signal.aborted) {
    throw createAbortError();
  }

  await new Promise<void>((resolve, reject) => {
    const timerId = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);

    const onAbort = () => {
      clearTimeout(timerId);
      signal.removeEventListener('abort', onAbort);
      reject(createAbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
};

const calculateBackoffDelayMs = (
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  jitterRatio: number
) => {
  const exponentialDelay = Math.min(
    maxDelayMs,
    baseDelayMs * Math.pow(2, Math.max(0, attempt - 1))
  );
  const safeJitterRatio = Math.max(0, Math.min(1, jitterRatio));
  const jitter = exponentialDelay * safeJitterRatio;
  const minDelay = Math.max(0, exponentialDelay - jitter);
  const maxDelay = exponentialDelay + jitter;

  return Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
};

const getChatConversations = (params: IChatConversationListApiQuery) => {
  return fetcherWithMetadata<IChatConversationListItem[]>(
    {
      url: path.conversations,
      method: 'GET',
      params,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const getChatMessages = (
  conversationId: string,
  params: IChatMessageListApiQuery
) => {
  return fetcherWithMetadata<IChatMessageItem[]>(
    {
      url: path.messages(conversationId),
      method: 'GET',
      params,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const updateChatMessageLike = (
  messageId: string,
  payload: IUpdateChatMessageLikePayload
) => {
  return fetcher<IUpdateChatMessageLikeResponse>(
    {
      url: path.likeMessage(messageId),
      method: 'PATCH',
      data: payload,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const parseSseEvent = <T>(rawEvent: string): T | null => {
  const lines = rawEvent
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (!line.startsWith('data:')) {
      continue;
    }

    const payloadText = line.slice(5).trim();
    if (!payloadText || payloadText === '[DONE]') {
      continue;
    }

    try {
      return JSON.parse(payloadText) as T;
    } catch {
      return null;
    }
  }

  return null;
};

const streamChat = async (
  payload: IChatStreamRequestPayload,
  handlers: IChatStreamHandlers = {}
) => {
  const token = getAccessToken();

  // Timeout này chỉ áp dụng cho giai đoạn chờ event SSE đầu tiên.
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(
      `[streamChat] Client connect timeout (${CHAT_SSE_CONNECT_TIMEOUT_MS}ms) - no SSE event from server`
    );
    timeoutController.abort();
  }, CHAT_SSE_CONNECT_TIMEOUT_MS);

  // Kết hợp signal từ handlers + timeout từ client
  let fetchSignal: AbortSignal | undefined;
  if (handlers.signal) {
    // Nếu handlers truyền signal, tạo AbortController để merge 2 signal
    const mergeController = new AbortController();
    handlers.signal.addEventListener('abort', () => {
      console.log('[streamChat] External signal aborted');
      mergeController.abort();
    });
    timeoutController.signal.addEventListener('abort', () => {
      console.log('[streamChat] Timeout signal aborted');
      mergeController.abort();
    });
    fetchSignal = mergeController.signal;
  } else {
    // Nếu không có signal từ handlers, chỉ dùng timeout
    fetchSignal = timeoutController.signal;
  }

  try {
    const response = await fetch(
      `${Config.NETWORK_CONFIG.API_BASE_URL}${path.stream}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: fetchSignal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Không thể mở chat stream');
    }

    if (!response.body) {
      throw new Error('Chat stream không có dữ liệu trả về');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let hasReceivedFirstEvent = false;

    const dispatchEvent = (event: IChatStreamEvent) => {
      if (!hasReceivedFirstEvent) {
        hasReceivedFirstEvent = true;
        clearTimeout(timeoutId);
      }

      handlers.onEvent?.(event);

      switch (event.type) {
        case 'connected':
          handlers.onConnected?.();
          break;
        case 'token':
          handlers.onToken?.(event.token);
          break;
        case 'tool_result':
          handlers.onToolResult?.(event);
          break;
        case 'done':
          handlers.onDone?.(event);
          break;
        case 'error':
          handlers.onError?.(event);
          break;
        default:
          break;
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || '';

      for (const rawEvent of events) {
        const event = parseSseEvent<IChatStreamEvent>(rawEvent);
        if (event) {
          dispatchEvent(event);
        }
      }
    }

    if (buffer.trim()) {
      const event = parseSseEvent<IChatStreamEvent>(buffer);
      if (event) {
        dispatchEvent(event);
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

const streamConversationEvents = async (
  conversationId: string,
  handlers: IConversationEventsHandlers = {}
) => {
  const token = getAccessToken();

  const response = await fetch(
    `${Config.NETWORK_CONFIG.API_BASE_URL}${path.conversationEvents(
      conversationId
    )}`,
    {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: handlers.signal,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      errorText || 'Khong the mo stream conversation'
    ) as ErrorWithStatus;
    error.status = response.status;
    handlers.onError?.(error);
    throw error;
  }

  handlers.onConnected?.();

  if (!response.body) {
    const error = new Error('Conversation event stream khong co du lieu');
    handlers.onError?.(error);
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || '';

      for (const rawEvent of events) {
        const parsed = parseSseEvent<unknown>(rawEvent);
        if (!parsed || !isChatSseEvent(parsed)) {
          continue;
        }

        handlers.onEvent?.(parsed);
      }
    }

    if (buffer.trim()) {
      const parsed = parseSseEvent<unknown>(buffer);
      if (parsed && isChatSseEvent(parsed)) {
        handlers.onEvent?.(parsed);
      }
    }
  } catch (error) {
    if (isAbortError(error)) {
      return;
    }

    const normalizedError =
      error instanceof Error
        ? error
        : new Error('Conversation event stream bi ngat ket noi');
    handlers.onError?.(normalizedError);
    throw normalizedError;
  }
};

const streamConversationEventsWithReconnect = async (
  conversationId: string,
  handlers: IConversationEventsReconnectHandlers = {}
) => {
  const reconnectOptions = handlers.reconnectOptions;
  const baseDelayMs = Math.max(
    100,
    reconnectOptions?.baseDelayMs ?? CONVERSATION_SSE_RECONNECT_BASE_DELAY_MS
  );
  const maxDelayMs = Math.max(
    baseDelayMs,
    reconnectOptions?.maxDelayMs ?? CONVERSATION_SSE_RECONNECT_MAX_DELAY_MS
  );
  const jitterRatio =
    reconnectOptions?.jitterRatio ?? CONVERSATION_SSE_RECONNECT_JITTER_RATIO;
  const maxReconnectAttempts =
    reconnectOptions?.maxReconnectAttempts ??
    CONVERSATION_SSE_MAX_RECONNECT_ATTEMPTS;

  let reconnectAttempt = 0;

  while (!handlers.signal?.aborted) {
    try {
      await streamConversationEvents(conversationId, {
        signal: handlers.signal,
        onConnected: () => {
          if (reconnectAttempt > 0) {
            handlers.onReconnectSuccess?.(reconnectAttempt);
          }
          reconnectAttempt = 0;
          handlers.onConnected?.();
        },
        onEvent: handlers.onEvent,
      });

      if (handlers.signal?.aborted) {
        return;
      }

      reconnectAttempt += 1;
      if (maxReconnectAttempts > 0 && reconnectAttempt > maxReconnectAttempts) {
        const maxRetryError = new Error(
          `Conversation event stream vuot qua gioi han reconnect (${maxReconnectAttempts})`
        );
        handlers.onError?.(maxRetryError);
        throw maxRetryError;
      }

      const delayMs = calculateBackoffDelayMs(
        reconnectAttempt,
        baseDelayMs,
        maxDelayMs,
        jitterRatio
      );
      handlers.onReconnectAttempt?.(reconnectAttempt, delayMs, 'stream_closed');
      await waitWithAbort(delayMs, handlers.signal);
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }

      if (!isRetriableConversationStreamError(error)) {
        const fatalError =
          error instanceof Error
            ? error
            : new Error('Conversation event stream bi ngat ket noi');
        handlers.onError?.(fatalError);
        throw fatalError;
      }

      reconnectAttempt += 1;
      if (maxReconnectAttempts > 0 && reconnectAttempt > maxReconnectAttempts) {
        const maxRetryError = new Error(
          `Conversation event stream vuot qua gioi han reconnect (${maxReconnectAttempts})`
        );
        handlers.onError?.(maxRetryError);
        throw maxRetryError;
      }

      const delayMs = calculateBackoffDelayMs(
        reconnectAttempt,
        baseDelayMs,
        maxDelayMs,
        jitterRatio
      );
      const reason = error instanceof Error ? error.message : 'unknown_error';

      handlers.onReconnectAttempt?.(reconnectAttempt, delayMs, reason);
      await waitWithAbort(delayMs, handlers.signal);
    }
  }
};

export default {
  getChatConversations,
  getChatMessages,
  updateChatMessageLike,
  streamChat,
  streamConversationEvents,
  streamConversationEventsWithReconnect,
};
