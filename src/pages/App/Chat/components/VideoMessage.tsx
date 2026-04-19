import { Clapperboard, CirclePlay, Lock } from 'lucide-react';

type VideoJobStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED';

interface VideoMessageProps {
  videoId: string;
  title?: string;
  description?: string | null;
  progress?: number;
  status?: VideoJobStatus;
  videoUrl?: string | null;
}

export default function VideoMessage({
  videoId,
  title,
  description,
  progress,
  status,
  videoUrl,
}: VideoMessageProps) {
  const canOpenVideo = Boolean(videoUrl && status === 'COMPLETED');

  const openVideo = () => {
    if (!canOpenVideo || !videoUrl) {
      return;
    }

    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const statusText =
    status === 'COMPLETED'
      ? 'Da tao xong video'
      : status === 'FAILED'
        ? 'Tao video that bai'
        : status === 'IN_PROGRESS'
          ? `Dang tao video (${progress ?? 0}%)`
          : 'Dang cho xu ly';

  return (
    <div className="chat-video-message" role="group" aria-label="Video message">
      <div className="chat-video-message__left" aria-hidden>
        <div className="chat-video-message__icon-wrap">
          <Clapperboard size={16} />
        </div>
      </div>

      <div className="chat-video-message__content">
        <div className="chat-video-message__title">
          {title || 'Video da tao xong'}
        </div>
        {description && (
          <div className="chat-video-message__description">{description}</div>
        )}
        <div className="chat-video-message__meta">{statusText}</div>
        <div className="chat-video-message__id">ID: {videoId}</div>
      </div>

      <button
        type="button"
        className="chat-video-message__open-btn"
        disabled={!canOpenVideo}
        onClick={openVideo}
        title={canOpenVideo ? 'Mo video' : 'Chua co URL video'}
      >
        {canOpenVideo ? <CirclePlay size={14} /> : <Lock size={14} />}
        <span>{canOpenVideo ? 'Mo video' : 'Khoa'}</span>
      </button>
    </div>
  );
}
