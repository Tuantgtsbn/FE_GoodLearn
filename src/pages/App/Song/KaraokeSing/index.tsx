import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Music,
  Loader2,
  Star,
  Trophy,
  Volume1,
  Volume2,
  VolumeX,
  X,
  AlertTriangle,
  Upload,
} from 'lucide-react';

import ApiSong from '@/api/ApiSong';
import QUERY_KEY from '@/api/QueryKey';
import { parseLrc, getCurrentLineIndex, formatTime } from '@/utils/lrcParser';
import type { LrcLine } from '@/utils/lrcParser';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { ISongScore } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type KaraokeState = 'idle' | 'countdown' | 'singing';

// ─── Lyrics Display Component ─────────────────────────────────────────────────
// Sử dụng memo để tránh re-render khi props không đổi
const LyricsDisplay = memo(
  ({
    lines,
    currentIndex,
    totalDuration,
    currentTime,
    isPlaying = false,
  }: {
    lines: LrcLine[];
    currentIndex: number;
    totalDuration: number;
    currentTime: number;
    isPlaying?: boolean;
  }) => {
    // Tính phần trăm tiến trình trong dòng hiện tại
    const getLineProgress = useCallback(
      (lineIdx: number): number => {
        if (lineIdx !== currentIndex || currentIndex < 0) return 0;
        const lineStart = lines[lineIdx].time;
        // Ưu tiên dùng endTime từ END marker, nếu không có thì dùng dòng tiếp theo
        const lineEnd =
          lines[lineIdx].endTime ??
          (lineIdx < lines.length - 1
            ? lines[lineIdx + 1].time
            : totalDuration);
        const duration = lineEnd - lineStart;
        if (duration <= 0) return 0;
        return Math.min(1, Math.max(0, (currentTime - lineStart) / duration));
      },
      [lines, currentIndex, totalDuration, currentTime]
    );

    // Hiển thị 5 dòng: 2 trước, 1 hiện tại, 2 sau
    const visibleRange = 2;
    const visibleLines = useMemo(() => {
      const startIdx = Math.max(0, currentIndex - visibleRange);
      const endIdx = Math.min(lines.length - 1, currentIndex + visibleRange);
      const result: (LrcLine & { index: number })[] = [];
      for (let i = startIdx; i <= endIdx; i++) {
        result.push({ ...lines[i], index: i });
      }
      return result;
    }, [currentIndex, lines]);

    return (
      <div className="relative flex flex-col items-center justify-center min-h-[340px] md:min-h-[420px] gap-3 md:gap-4 px-4">
        {visibleLines.map((line) => {
          const isCurrent = line.index === currentIndex;
          const isPast = line.index < currentIndex;
          const isFuture = line.index > currentIndex;
          const progress = getLineProgress(line.index);

          return (
            <div
              key={`${line.index}-${line.time}`}
              className={clsx(
                'text-center font-extrabold uppercase leading-snug select-none will-change-transform',
                {
                  // Dòng hiện tại - to hơn, màu vàng nổi bật
                  'text-5xl md:text-7xl lg:text-8xl scale-110 text-[#ffee00] drop-shadow-[0_0_30px_rgba(255,238,0,0.5)]':
                    isCurrent,
                  // Dòng kế cận (trước/sau 1) - trung bình
                  'text-xl md:text-2xl lg:text-3xl text-zinc-400 opacity-60':
                    (isPast && line.index === currentIndex - 1) ||
                    (isFuture && line.index === currentIndex + 1),
                  // Dòng xa hơn - nhỏ, mờ
                  'text-base md:text-lg lg:text-xl text-zinc-600 opacity-30':
                    (isPast && line.index < currentIndex - 1) ||
                    (isFuture && line.index > currentIndex + 1),
                }
              )}
              style={{
                transition: isCurrent
                  ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
                  : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
              }}
            >
              {isCurrent ? (
                // Dòng hiện tại: hiệu ứng karaoke sweep vàng
                <span className="relative inline-block">
                  {/* Layer nền (chưa hát) - tối hơn */}
                  <span className="text-zinc-700">{line.text}</span>
                  {/* Layer highlight (đã hát) - vàng sáng nổi bật */}
                  <span
                    className="absolute inset-0 text-[#ffee00] overflow-hidden whitespace-nowrap font-extrabold"
                    style={{
                      clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
                      transition: 'clip-path 0.1s linear',
                      textShadow: '0 0 20px rgba(255, 238, 0, 0.6)',
                    }}
                  >
                    {line.text}
                  </span>
                </span>
              ) : (
                <span>{line.text}</span>
              )}
            </div>
          );
        })}

        {/* Placeholder khi chưa bắt đầu hoặc đang nghỉ giữa đoạn */}
        {currentIndex < 0 && lines.length > 0 && (
          <div className="text-center">
            {isPlaying ? (
              // Đang nghỉ giữa đoạn → hiển thị dòng tiếp theo sắp đến
              (() => {
                const nextLine = lines.find((l) => l.time > currentTime);

                // Nếu không có dòng tiếp theo → hết bài
                if (!nextLine) {
                  return (
                    <div className="animate-fade-in">
                      <p className="text-5xl md:text-7xl font-black text-[#ffee00] mb-4 drop-shadow-lg">
                        ✓
                      </p>
                      <p className="text-3xl md:text-5xl font-extrabold text-[#ffee00] uppercase drop-shadow-[0_0_20px_rgba(255,238,0,0.4)]">
                        Hết bài
                      </p>
                      <p className="text-lg md:text-xl text-zinc-600 mt-4 opacity-50 font-semibold">
                        Cảm ơn bạn đã hát! 🎤
                      </p>
                    </div>
                  );
                }

                // Nếu dòng tiếp theo có isEndOfSong → sắp hết bài
                if (nextLine.isEndOfSong) {
                  return (
                    <>
                      <p className="text-lg md:text-xl text-zinc-600 mb-3 opacity-50 font-semibold">
                        ♪ Phần cuối...
                      </p>
                      <p className="text-2xl md:text-4xl font-extrabold text-zinc-500 uppercase opacity-40">
                        {nextLine.text}
                      </p>
                    </>
                  );
                }

                // Dòng tiếp theo bình thường
                return (
                  <>
                    <p className="text-lg md:text-xl text-zinc-600 mb-3 opacity-50 font-semibold">
                      ♪ Nghỉ giữa đoạn...
                    </p>
                    <p className="text-2xl md:text-4xl font-extrabold text-zinc-500 uppercase opacity-40">
                      {nextLine.text}
                    </p>
                  </>
                );
              })()
            ) : (
              // Chưa bắt đầu → hiển thị 2 dòng đầu
              <>
                <p className="text-3xl md:text-5xl font-extrabold text-zinc-500 uppercase">
                  {lines[0]?.text}
                </p>
                <p className="text-xl md:text-2xl text-zinc-600 mt-3 opacity-40 uppercase font-bold">
                  {lines[1]?.text}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

LyricsDisplay.displayName = 'LyricsDisplay';

// ─── Scoring Modal Component ─────────────────────────────────────────────────
type ScoringModalState = 'uploading' | 'processing' | 'completed' | 'error';

const WAITING_MESSAGES = [
  'AI đang phân tích giọng hát của bạn... 🎤',
  'Đang so sánh cao độ và nhịp điệu... 🎵',
  'Kiểm tra độ ổn định giọng hát... 📊',
  'Sắp có kết quả rồi, chờ chút nhé! ⏳',
  'AI đang làm việc chăm chỉ... 🤖',
];

const ScoringModal = ({
  isOpen,
  scoreId,
  onRetry,
  onBack,
  onClose,
}: {
  isOpen: boolean;
  scoreId: string | null;
  onRetry: () => void;
  onBack: () => void;
  onClose: () => void;
}) => {
  const [modalState, setModalState] = useState<ScoringModalState>('uploading');
  const [scoreResult, setScoreResult] = useState<ISongScore | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [waitingMsgIndex, setWaitingMsgIndex] = useState(0);
  const pollingRef = useRef<number>(0);
  const msgIntervalRef = useRef<number>(0);

  // Khi có scoreId → chuyển sang processing và bắt đầu polling
  useEffect(() => {
    if (!scoreId) return;

    setModalState('processing');

    // Polling mỗi 10 giây
    pollingRef.current = window.setInterval(async () => {
      try {
        const result = await ApiSong.getScoreStatus(scoreId);

        if (result.status === 'COMPLETED') {
          window.clearInterval(pollingRef.current);
          setScoreResult(result);
          setModalState('completed');
        } else if (result.status === 'FAILED') {
          window.clearInterval(pollingRef.current);
          setErrorMessage('Chấm điểm thất bại. Vui lòng thử lại.');
          setModalState('error');
        }
      } catch {
        // Polling fail silently, sẽ thử lại lần sau
      }
    }, 10_000);

    return () => {
      window.clearInterval(pollingRef.current);
    };
  }, [scoreId]);

  // Xoay vòng câu chờ đợi mỗi 5 giây
  useEffect(() => {
    if (modalState !== 'processing' && modalState !== 'uploading') return;

    msgIntervalRef.current = window.setInterval(() => {
      setWaitingMsgIndex((prev) => (prev + 1) % WAITING_MESSAGES.length);
    }, 5_000);

    return () => {
      window.clearInterval(msgIntervalRef.current);
    };
  }, [modalState]);

  // Reset khi đóng
  useEffect(() => {
    if (!isOpen) {
      setModalState('uploading');
      setScoreResult(null);
      setErrorMessage('');
      setWaitingMsgIndex(0);
      window.clearInterval(pollingRef.current);
      window.clearInterval(msgIntervalRef.current);
    }
  }, [isOpen]);

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'S':
      case 'S+':
        return 'text-[#ffee00]';
      case 'A':
      case 'A+':
        return 'text-[#00d4ff]';
      case 'B':
      case 'B+':
        return 'text-green-400';
      default:
        return 'text-zinc-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl animate-fade-in">
        {/* Close button - chỉ hiện khi completed hoặc error */}
        {(modalState === 'completed' || modalState === 'error') && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-800 transition text-zinc-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        {/* ── Uploading state ── */}
        {modalState === 'uploading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#ff006e]/10 border-2 border-[#ff006e]/30 flex items-center justify-center">
                <Upload size={28} className="text-[#ff006e] animate-pulse" />
              </div>
              <Loader2
                size={80}
                className="absolute inset-0 text-[#ff006e] animate-spin opacity-30"
              />
            </div>
            <p className="text-lg font-bold text-white">
              Đang gửi bản ghi âm...
            </p>
            <p className="text-sm text-zinc-400 text-center">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        )}

        {/* ── Processing state ── */}
        {modalState === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#ff006e]/10 border-2 border-[#ff006e]/30 flex items-center justify-center">
                <Mic size={28} className="text-[#ff006e]" />
              </div>
              <Loader2
                size={80}
                className="absolute inset-0 text-[#ff006e] animate-spin opacity-30"
              />
            </div>
            <p className="text-lg font-bold text-white">AI đang chấm điểm...</p>
            <p className="text-sm text-zinc-400 text-center min-h-[20px] transition-all duration-300">
              {WAITING_MESSAGES[waitingMsgIndex]}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#ff006e] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Quá trình có thể mất 30 giây đến 1 phút
            </p>
          </div>
        )}

        {/* ── Completed state ── */}
        {modalState === 'completed' && scoreResult && (
          <div className="flex flex-col items-center gap-5 py-4 animate-fade-in">
            <p className="text-sm font-bold text-[#ff006e] uppercase tracking-widest">
              Kết quả chấm điểm
            </p>

            {/* Grade circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#ffee00] flex items-center justify-center bg-[#ffee00]/10 backdrop-blur-md">
                <span
                  className={clsx(
                    'text-5xl font-black',
                    getGradeColor(scoreResult.grade)
                  )}
                >
                  {scoreResult.grade || '—'}
                </span>
              </div>
              <div className="absolute -top-2 -right-2 bg-[#ff006e] rounded-full px-3 py-1 text-xs font-extrabold text-white">
                <Trophy size={12} className="inline mr-1" />
                {scoreResult.totalScore?.toFixed(1) || '0'}
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {[
                {
                  label: 'Cao độ',
                  value: scoreResult.pitchScore,
                  icon: '🎵',
                },
                {
                  label: 'Nhịp điệu',
                  value: scoreResult.rhythmScore,
                  icon: '🥁',
                },
                {
                  label: 'Ổn định',
                  value: scoreResult.stabilityScore,
                  icon: '📊',
                },
                {
                  label: 'Dynamics',
                  value: scoreResult.dynamicsScore,
                  icon: '🔊',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-zinc-800/80 border border-zinc-700 p-2.5 text-center"
                >
                  <span className="text-base">{item.icon}</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {item.label}
                  </p>
                  <p className="text-lg font-extrabold text-white">
                    {item.value?.toFixed(1) || '—'}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2 w-full">
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#ff006e] px-5 py-3 text-sm font-extrabold text-white uppercase tracking-wider hover:bg-[#e0005f] transition active:scale-95"
              >
                <RotateCcw size={16} />
                Hát lại
              </button>
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-400 transition"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
            </div>
          </div>
        )}

        {/* ── Error state ── */}
        {modalState === 'error' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <p className="text-lg font-bold text-white">Đã xảy ra lỗi</p>
            <p className="text-sm text-zinc-400 text-center">
              {errorMessage || 'Không thể chấm điểm. Vui lòng thử lại.'}
            </p>
            <div className="flex gap-3 mt-2 w-full">
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#ff006e] px-5 py-3 text-sm font-extrabold text-white uppercase tracking-wider hover:bg-[#e0005f] transition active:scale-95"
              >
                <RotateCcw size={16} />
                Thử lại
              </button>
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-400 transition"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Karaoke Sing Page ───────────────────────────────────────────────────
const KaraokeSingPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();

  // ── State ──
  const [state, setState] = useState<KaraokeState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0 → 1
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [scoreId, setScoreId] = useState<string | null>(null);
  const [showScoringModal, setShowScoringModal] = useState(false);

  // ── Refs ──
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const countdownTimerRef = useRef<number>(0);
  const stateRef = useRef<KaraokeState>(state);

  // Sync stateRef with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ── Hooks ──
  const {
    isRecording,
    startRecording,
    stopRecording,
    cleanup: cleanupRecorder,
  } = useAudioRecorder();

  // ── Fetch song data ──
  const { data: song, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SONG.DETAIL, songId],
    queryFn: () => ApiSong.getSongDetail(songId!),
    enabled: !!songId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ── Parse LRC ──
  const [lrcLines, setLrcLines] = useState<LrcLine[]>([]);
  const [lrcLoaded, setLrcLoaded] = useState(false);

  useEffect(() => {
    const lrcUrl = song?.songFiles?.lrc;
    if (!lrcUrl) return;

    fetch(lrcUrl)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseLrc(text);
        setLrcLines(parsed);
        setLrcLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load LRC:', err);
        toast.error('Không thể tải lời bài hát');
      });
  }, [song?.songFiles?.lrc]);

  // ── Audio URL ──
  const audioUrl = useMemo(() => {
    return (
      song?.songFiles?.audio_karaoke || song?.songFiles?.audio_original || ''
    );
  }, [song?.songFiles]);

  // ── Current lyric index ──
  const currentLineIndex = useMemo(() => {
    if (lrcLines.length === 0) return -1;
    return getCurrentLineIndex(lrcLines, currentTime);
  }, [lrcLines, currentTime]);

  // ── Animation loop (cập nhật currentTime + duration) ──
  // Sử dụng throttling để tránh re-render quá nhiều (60fps → ~10fps)
  const lastUpdateRef = useRef(0);
  const UPDATE_INTERVAL = 100; // 100ms = 10 updates/giây (đủ mượt cho karaoke)

  const updateTime = useCallback(function tick() {
    const audio = audioRef.current;
    if (audio && stateRef.current === 'singing') {
      const now = performance.now();
      // Chỉ update nếu đã qua UPDATE_INTERVAL
      if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
        setCurrentTime(audio.currentTime);
        lastUpdateRef.current = now;
        // Cập nhật duration nếu chưa có (một số browser set muộn)
        if (audio.duration && isFinite(audio.duration)) {
          setDuration((prev) => (prev === 0 ? audio.duration : prev));
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // Safety net: đảm bảo rAF loop luôn chạy khi state = singing
  useEffect(() => {
    if (state === 'singing' && audioRef.current && !audioRef.current.paused) {
      // Khởi động rAF loop nếu chưa chạy
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateTime);
    }
    return () => {
      if (state !== 'singing') {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, updateTime]);

  // ── Start: xin quyền micro trước, rồi countdown, rồi phát ──
  const handleStart = useCallback(async () => {
    if (!audioUrl) {
      toast.error('Bài hát chưa có file audio');
      return;
    }

    // Xin quyền micro TRƯỚC khi bắt đầu countdown
    try {
      await startRecording();
    } catch {
      toast.error(
        'Không thể truy cập microphone. Vui lòng cho phép quyền micro.'
      );
      return;
    }

    setState('countdown');
    setCountdown(3);
    setCurrentTime(0);
    setScoreId(null);
    setShowScoringModal(false);

    let count = 3;
    countdownTimerRef.current = window.setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        window.clearInterval(countdownTimerRef.current);

        // Cập nhật stateRef TRƯỚC khi gọi rAF để tránh race condition
        // (useEffect sync stateRef có thể chạy SAU rAF đầu tiên)
        stateRef.current = 'singing';
        setState('singing');

        // Bắt đầu phát nhạc (micro đã sẵn sàng)
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }

        // Bắt đầu animation loop
        animFrameRef.current = requestAnimationFrame(updateTime);
      }
    }, 1000);
  }, [audioUrl, startRecording, updateTime]);

  // ── Stop singing ──
  const handleStop = useCallback(async () => {
    // Dừng nhạc
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Dừng animation
    cancelAnimationFrame(animFrameRef.current);

    // Dừng ghi âm và lấy blob
    const blob = await stopRecording();

    if (blob && songId) {
      // Mở modal scoring
      setShowScoringModal(true);

      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      try {
        const result = await ApiSong.scoreVoice(songId, formData);
        setScoreId(result.scoreId);
        // Polling sẽ được ScoringModal tự xử lý khi nhận scoreId
      } catch {
        toast.error('Lỗi khi gửi file ghi âm');
        setShowScoringModal(false);
        setState('idle');
      }
    }
  }, [stopRecording, songId]);

  // ── Audio events ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      handleStop();
    };

    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      // Fallback: cập nhật duration nếu chưa có (một số browser set duration muộn)
      if (duration === 0 && audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }

      // Fallback: cập nhật currentTime nếu rAF loop không hoạt động
      if (stateRef.current === 'singing') {
        setCurrentTime(audio.currentTime);
      }
    };

    // Nếu metadata đã load trước khi listener được gắn
    if (audio.duration && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [handleStop, duration]);

  // ── Cleanup khi unmount ──
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.clearInterval(countdownTimerRef.current);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Giải phóng micro để browser ngừng hiển thị icon mic
      cleanupRecorder();
    };
  }, [cleanupRecorder]);

  // ── Reset / Retry ──
  const handleRetry = useCallback(async () => {
    // Dừng nhạc
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Dừng animation
    cancelAnimationFrame(animFrameRef.current);

    // Dừng countdown nếu đang chạy
    window.clearInterval(countdownTimerRef.current);

    // Dừng ghi âm nếu đang recording
    if (isRecording) {
      await stopRecording();
    }

    // Reset state
    setCurrentTime(0);
    setScoreId(null);
    setShowScoringModal(false);
    setState('idle');
  }, [isRecording, stopRecording]);

  // ── Volume controls ──
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      const clamped = Math.max(0, Math.min(1, newVolume));
      setVolume(clamped);
      if (audioRef.current) {
        audioRef.current.volume = clamped;
        // Tự động unmute khi kéo volume > 0
        if (clamped > 0 && isMuted) {
          audioRef.current.muted = false;
          setIsMuted(false);
        }
        // Tự động mute khi kéo volume về 0
        if (clamped === 0 && !isMuted) {
          audioRef.current.muted = true;
          setIsMuted(true);
        }
      }
    },
    [isMuted]
  );

  // ── Progress percentage ──
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={48} className="text-[#ff006e] animate-spin" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <Music size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-xl font-bold">Không tìm thấy bài hát</p>
          <button
            onClick={() => navigate('/app/songs')}
            className="mt-4 rounded-full bg-zinc-800 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* ── Background decorations ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#ff006e]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#00d4ff]/5 blur-3xl" />
        {/* Music notes decorations */}
        <div className="absolute top-20 left-10 text-5xl text-zinc-800 rotate-[-15deg] select-none">
          ♪
        </div>
        <div className="absolute top-40 right-16 text-3xl text-zinc-800 rotate-[10deg] select-none">
          ♫
        </div>
        <div className="absolute bottom-32 left-20 text-4xl text-zinc-800 rotate-[20deg] select-none">
          ♪
        </div>
        {/* Star decorations */}
        <Star
          size={20}
          className="absolute top-1/3 right-10 text-zinc-800 fill-zinc-800"
        />
        <Star
          size={14}
          className="absolute top-1/2 left-16 text-zinc-800 fill-zinc-800"
        />
      </div>

      {/* ── Top bar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate('/app/songs')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold hidden md:inline">
            Quay lại
          </span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff006e]">
            <Music size={14} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-white leading-tight line-clamp-1">
              {song.title}
            </p>
            <p className="text-sm text-zinc-500">{song.artists?.join(', ')}</p>
          </div>
        </div>

        {/* REC indicator */}
        <div className="flex items-center gap-3">
          {state === 'singing' && (
            <div className="rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-1.5">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Live
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#ff006e] animate-pulse" />
                <span className="text-xs font-bold text-[#ff006e]">REC</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Main lyrics area ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* Countdown overlay */}
        {state === 'countdown' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-8xl md:text-9xl font-black text-[#ffee00] animate-bounce">
                {countdown}
              </p>
              <p className="text-lg text-zinc-400 font-semibold mt-4">
                Chuẩn bị hát...
              </p>
            </div>
          </div>
        )}

        {/* Lyrics display */}
        {(state === 'idle' || state === 'singing') && lrcLines.length > 0 && (
          <LyricsDisplay
            lines={lrcLines}
            currentIndex={currentLineIndex}
            totalDuration={duration || song.durationSeconds || 0}
            currentTime={currentTime}
            isPlaying={state === 'singing'}
          />
        )}

        {/* No LRC fallback */}
        {!lrcLoaded && state === 'idle' && !isLoading && (
          <div className="text-center px-4">
            <p className="text-2xl md:text-4xl font-extrabold text-zinc-500 uppercase">
              Sẵn sàng hát!
            </p>
            <p className="text-sm text-zinc-600 mt-2">Nhấn START để bắt đầu</p>
          </div>
        )}

        {/* Idle state with LRC */}
        {lrcLoaded && state === 'idle' && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-zinc-400 font-bold">
              ♪ {lrcLines.length} câu •{' '}
              {formatTime(duration || song.durationSeconds || 0)}
            </p>
          </div>
        )}
      </main>

      {/* ── Bottom control bar ── */}
      <footer className="relative z-20 px-6 pb-6 pt-2">
        {/* Volume + Progress bar */}
        {state === 'singing' && (
          <div className="mb-4">
            {/* Volume control nằm ngang phía trên progress */}
            <div
              className="relative flex items-center gap-2 mb-2"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-zinc-800 transition shrink-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} className="text-zinc-500" />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} className="text-zinc-400" />
                ) : (
                  <Volume2 size={16} className="text-zinc-400" />
                )}
              </button>

              <div
                className={clsx(
                  'flex items-center transition-all duration-200 overflow-hidden',
                  showVolumeSlider ? 'w-28 opacity-100' : 'w-0 opacity-0'
                )}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-full h-1 rounded-full appearance-none cursor-pointer bg-zinc-700
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:hover:bg-[#ffee00]
                    [&::-webkit-slider-thumb]:transition-colors
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:hover:bg-[#ffee00]"
                  style={{
                    background: `linear-gradient(to right, #ffee00 0%, #ffee00 ${(isMuted ? 0 : volume) * 100}%, #3f3f46 ${(isMuted ? 0 : volume) * 100}%, #3f3f46 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Time display */}
            <div className="flex items-center justify-between font-semibold text-zinc-500 mb-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-800/80 overflow-hidden border border-zinc-700/50">
              <div
                className="h-full rounded-full transition-all duration-150 ease-linear"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#ccc',
                  boxShadow:
                    '0 0 12px rgba(255, 0, 110, 0.5), 0 0 12px rgba(0, 212, 255, 0.3)',
                }}
              />
            </div>
            {/* Segment markers from LRC (skip END markers) */}
            {lrcLines.length > 0 && duration > 0 && (
              <div className="relative h-1 mt-0.5">
                {lrcLines
                  .filter((line) => !line.isEndMarker)
                  .map((line, i) => (
                    <div
                      key={i}
                      className="absolute top-0 w-0.5 h-1 bg-zinc-700 rounded-full"
                      style={{ left: `${(line.time / duration) * 100}%` }}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-4">
          {state === 'idle' && (
            <button
              onClick={handleStart}
              disabled={!audioUrl}
              className="group flex items-center gap-3 rounded-full bg-[#ffee00] px-10 py-4 text-base font-black uppercase tracking-widest text-[#0a0a0a] transition hover:bg-[#ffee00]/90 hover:shadow-lg hover:shadow-[#ffee00]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} className="fill-[#0a0a0a]" />
              START
            </button>
          )}

          {state === 'singing' && (
            <>
              {/* Mic indicator */}
              <div
                className={clsx(
                  'flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold',
                  isRecording
                    ? 'bg-[#ff006e]/20 border border-[#ff006e]/40 text-[#ff006e]'
                    : 'bg-zinc-800 text-zinc-500'
                )}
              >
                {isRecording ? (
                  <Mic size={16} className="animate-pulse" />
                ) : (
                  <MicOff size={16} />
                )}
                {isRecording ? 'Đang ghi âm' : 'Mic tắt'}
              </div>

              {/* Reset button */}
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-full border border-zinc-600 px-5 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-400 hover:text-white transition active:scale-95"
              >
                <RotateCcw size={16} />
                Hát lại
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Hidden audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {/* Scoring Modal */}
      <ScoringModal
        isOpen={showScoringModal}
        scoreId={scoreId}
        onRetry={() => {
          setShowScoringModal(false);
          handleRetry();
        }}
        onBack={() => {
          setShowScoringModal(false);
          navigate('/app/songs');
        }}
        onClose={() => {
          setShowScoringModal(false);
          setState('idle');
        }}
      />

      {/* Custom animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KaraokeSingPage;
