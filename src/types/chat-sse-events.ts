export const CHAT_SSE_SCHEMA_VERSION = '1.0' as const;

export type ToolName = 'create_video' | 'create_flashcard';

export type JobStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED';

export type JobResultType = 'video' | 'flashcard_set';

export type TimelineStageStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type ChatSseEventType =
  | 'tool.job.accepted'
  | 'tool.job.progress'
  | 'tool.job.stage_changed'
  | 'tool.job.completed'
  | 'tool.job.failed'
  | 'tool.job.canceled'
  | 'tool.job.heartbeat'
  | 'conversation.snapshot'
  | 'tool.job.warning';

export interface ChatSseEnvelope<
  TType extends ChatSseEventType,
  TPayload extends object,
> {
  schemaVersion: typeof CHAT_SSE_SCHEMA_VERSION;
  eventId: string;
  eventType: TType;
  emittedAt: string;
  conversationId: string;
  generationJobId: string;
  toolCallId: string;
  toolName: ToolName;
  sequence: number;
  payload: TPayload;
}

export interface ToolJobAcceptedPayload {
  status: Extract<JobStatus, 'PENDING' | 'IN_PROGRESS'>;
  progress: number;
  args: Record<string, unknown>;
  message: string;
}

export interface ToolJobProgressPayload {
  status: Extract<JobStatus, 'IN_PROGRESS'>;
  progress: number;
  message: string | null;
  etaSeconds: number | null;
}

export interface TimelineStage {
  stageId: string;
  title: string;
  status: TimelineStageStatus;
  progress: number;
  message: string;
  at: string;
}

export interface ToolJobStageChangedPayload {
  status: Extract<JobStatus, 'IN_PROGRESS' | 'FAILED' | 'COMPLETED'>;
  progress: number;
  timelineVersion: number;
  stage: TimelineStage;
}

export interface ToolJobCompletedPayload {
  status: Extract<JobStatus, 'COMPLETED'>;
  progress: 100;
  resultType: JobResultType;
  resultId: string;
  resultUrl: string | null;
  summary: string | null;
}

export interface ToolJobFailedPayload {
  status: Extract<JobStatus, 'FAILED'>;
  progress: number;
  error: {
    code: string;
    message: string;
    retriable: boolean;
  };
}

export interface ToolJobCanceledPayload {
  status: Extract<JobStatus, 'CANCELED'>;
  progress: number;
  reason: string | null;
}

export interface ToolJobHeartbeatPayload {
  status: JobStatus;
  progress: number;
  ttlSeconds: number;
}

export interface ToolJobWarningPayload {
  status: JobStatus;
  progress: number;
  warningCode: string;
  warningMessage: string;
}

export interface ConversationSnapshotPayload {
  status: JobStatus;
  progress: number;
  timelineVersion: number;
  timeline: TimelineStage[];
  resultType: JobResultType | null;
  resultId: string | null;
  resultUrl: string | null;
  errorMessage: string | null;
}

export type ToolJobAcceptedEvent = ChatSseEnvelope<
  'tool.job.accepted',
  ToolJobAcceptedPayload
>;

export type ToolJobProgressEvent = ChatSseEnvelope<
  'tool.job.progress',
  ToolJobProgressPayload
>;

export type ToolJobStageChangedEvent = ChatSseEnvelope<
  'tool.job.stage_changed',
  ToolJobStageChangedPayload
>;

export type ToolJobCompletedEvent = ChatSseEnvelope<
  'tool.job.completed',
  ToolJobCompletedPayload
>;

export type ToolJobFailedEvent = ChatSseEnvelope<
  'tool.job.failed',
  ToolJobFailedPayload
>;

export type ToolJobCanceledEvent = ChatSseEnvelope<
  'tool.job.canceled',
  ToolJobCanceledPayload
>;

export type ToolJobHeartbeatEvent = ChatSseEnvelope<
  'tool.job.heartbeat',
  ToolJobHeartbeatPayload
>;

export type ToolJobWarningEvent = ChatSseEnvelope<
  'tool.job.warning',
  ToolJobWarningPayload
>;

export type ConversationSnapshotEvent = ChatSseEnvelope<
  'conversation.snapshot',
  ConversationSnapshotPayload
>;

export type ChatSseEvent =
  | ToolJobAcceptedEvent
  | ToolJobProgressEvent
  | ToolJobStageChangedEvent
  | ToolJobCompletedEvent
  | ToolJobFailedEvent
  | ToolJobCanceledEvent
  | ToolJobHeartbeatEvent
  | ToolJobWarningEvent
  | ConversationSnapshotEvent;

export const isChatSseEvent = (value: unknown): value is ChatSseEvent => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.schemaVersion === CHAT_SSE_SCHEMA_VERSION &&
    typeof record.eventId === 'string' &&
    typeof record.eventType === 'string' &&
    typeof record.emittedAt === 'string' &&
    typeof record.conversationId === 'string' &&
    typeof record.generationJobId === 'string' &&
    typeof record.toolCallId === 'string' &&
    (record.toolName === 'create_video' ||
      record.toolName === 'create_flashcard') &&
    typeof record.sequence === 'number' &&
    Number.isFinite(record.sequence) &&
    typeof record.payload === 'object' &&
    record.payload !== null &&
    !Array.isArray(record.payload)
  );
};

export const isTerminalJobStatus = (status: JobStatus) => {
  return status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELED';
};
