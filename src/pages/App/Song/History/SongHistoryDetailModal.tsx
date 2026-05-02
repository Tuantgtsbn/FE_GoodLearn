import { Calendar, Clock3, Music2, Star, Timer, X } from 'lucide-react';
import type { SongHistoryItem } from '@/api/ApiSong';

interface SongHistoryDetailModalProps {
  score: SongHistoryItem;
  onClose?: (result?: unknown) => void;
}

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '--';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds <= 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}p ${secs}s`;
};

const normalizePercent = (value: number | null) => {
  if (value === null || value === undefined) return 0;
  const scaled = value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, scaled));
};

const formatScoreValue = (value: number | null) => {
  if (value === null || value === undefined) return '--';
  return value.toFixed(1);
};

const statusBadge = (status: SongHistoryItem['status']) => {
  if (status === 'COMPLETED') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }
  if (status === 'FAILED') {
    return 'bg-rose-50 text-rose-700 ring-rose-100';
  }
  return 'bg-amber-50 text-amber-700 ring-amber-100';
};

const statusLabel = (status: SongHistoryItem['status']) => {
  if (status === 'COMPLETED') return 'Hoàn tất';
  if (status === 'FAILED') return 'Thất bại';
  return 'Đang xử lý';
};

const scoreRows = [
  { label: 'Cao độ', key: 'pitchScore', icon: <Music2 size={14} /> },
  { label: 'Nhịp điệu', key: 'rhythmScore', icon: <Clock3 size={14} /> },
  { label: 'Ổn định', key: 'stabilityScore', icon: <Timer size={14} /> },
  { label: 'Cảm xúc', key: 'dynamicsScore', icon: <Star size={14} /> },
] as const;

export default function SongHistoryDetailModal({
  score,
  onClose,
}: SongHistoryDetailModalProps) {
  const totalScoreText =
    score.totalScore === null ? '--' : score.totalScore.toFixed(1);

  const processingTime = score.processingTimeMs
    ? `${(score.processingTimeMs / 1000).toFixed(1)}s`
    : '--';

  return (
    <div
      className="w-[92%] max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_64px_rgba(15,23,42,0.2)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Chi tiết kết quả
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            {score.song.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {score.song.artists?.join(', ') || 'Nghệ sĩ chưa cập nhật'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onClose?.(undefined)}
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[1.2fr,0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <Calendar size={12} />
                {formatDateTime(score.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <Music2 size={12} />
                {score.song.genre || 'Không rõ thể loại'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <Timer size={12} />
                {formatDuration(score.song.durationSeconds)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1',
                  statusBadge(score.status),
                ].join(' ')}
              >
                {statusLabel(score.status)}
              </span>
              <span className="text-xs text-slate-400">
                Thời gian xử lý: {processingTime}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Tổng điểm
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-black">{totalScoreText}</span>
              <span className="text-sm text-white/70">/ 100</span>
            </div>
            <p className="mt-2 text-xs text-white/60">
              Hạng: {score.grade || '--'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {scoreRows.map((row) => {
            const value = score[row.key];
            return (
              <div
                key={row.key}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="text-slate-500">{row.icon}</span>
                    {row.label}
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {formatScoreValue(value)}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"
                    style={{ width: `${normalizePercent(value)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
