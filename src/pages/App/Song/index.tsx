import {
  Mic,
  Flame,
  FileText,
  ChevronRight,
  Star,
  Headphones,
  PlayCircle,
  Trophy,
  Gift,
  AudioLines,
  Search,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import ApiSong from '@/api/ApiSong';
import QUERY_KEY from '@/api/QueryKey';
import type { ISong } from '@/types';

// ─── Gradient colors for song cards (fallback when no thumbnail) ──────────────
const GRADIENT_COLORS = [
  'from-zinc-700 to-zinc-900',
  'from-zinc-800 to-zinc-950',
  'from-zinc-600 to-zinc-800',
  'from-zinc-700 to-zinc-900',
  'from-zinc-800 to-zinc-900',
  'from-zinc-700 to-zinc-800',
];

const getGradient = (index: number) =>
  GRADIENT_COLORS[index % GRADIENT_COLORS.length];

// ─── Format duration ──────────────────────────────────────────────────────────
const formatDuration = (seconds: number | null) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ─── Song Card Component ──────────────────────────────────────────────────────
const SongCard = ({
  song,
  index,
  featured = false,
  onClick,
}: {
  song: ISong;
  index: number;
  featured?: boolean;
  onClick: () => void;
}) => {
  const thumbnailUrl = song.songFiles?.thumbnail;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 cursor-pointer',
        featured
          ? 'border-[3px] border-[#ffee00] scale-105 shadow-2xl shadow-yellow-400/20 z-10'
          : 'border border-zinc-700 hover:border-zinc-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40'
      )}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Background: thumbnail hoặc gradient fallback */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={song.title}
          className="absolute inset-0 w-full h-full object-contain"
        />
      ) : (
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-b flex items-center justify-center',
            getGradient(index)
          )}
        >
          <Mic
            size={64}
            className="text-zinc-500 opacity-30 group-hover:opacity-50 transition-opacity"
          />
        </div>
      )}

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Top badges */}
      <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
        {song.genre ? (
          <span className="rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 px-2.5 py-1 text-[10px] font-bold text-[#00d4ff] tracking-wide">
            {song.genre}
          </span>
        ) : (
          <span />
        )}

        {song.hasReferenceAudio && (
          <span className="rounded-full bg-[#ff006e]/80 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
            AI Score
          </span>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
        <p className="font-bold text-white text-sm leading-tight line-clamp-1">
          {song.title}
        </p>
        <p className="text-zinc-400 text-xs mt-0.5">
          {song.artists?.join(', ') || 'Unknown'}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {song.durationSeconds && (
            <span className="flex items-center gap-1 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/30 px-2 py-0.5 text-[10px] font-semibold text-[#00d4ff]">
              <Headphones size={10} />
              {formatDuration(song.durationSeconds)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Feature Card Component ───────────────────────────────────────────────────
const FeatureCard = ({
  icon,
  title,
  desc,
  variant,
  extra,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  variant: 'magenta' | 'white' | 'light' | 'record';
  extra?: React.ReactNode;
  className?: string;
}) => {
  const bg =
    variant === 'magenta'
      ? 'bg-[#ff006e] text-white'
      : variant === 'record'
        ? 'bg-white text-zinc-900'
        : variant === 'light'
          ? 'bg-zinc-100 text-zinc-900'
          : 'bg-white text-zinc-900';

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 flex flex-col gap-3 shadow-sm',
        bg,
        className
      )}
    >
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          variant === 'magenta'
            ? 'bg-white/20 text-white'
            : 'bg-zinc-100 text-zinc-700'
        )}
      >
        {icon}
      </div>
      <div>
        <h3
          className={clsx(
            'text-lg font-extrabold leading-tight',
            variant === 'magenta' ? 'text-white' : 'text-zinc-900'
          )}
        >
          {title}
        </h3>
        <p
          className={clsx(
            'text-sm mt-1 leading-relaxed',
            variant === 'magenta' ? 'text-white/80' : 'text-zinc-500'
          )}
        >
          {desc}
        </p>
      </div>
      {extra}
    </div>
  );
};

// ─── Loading Skeleton Card ────────────────────────────────────────────────────
const SongCardSkeleton = () => (
  <div
    className="relative rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 animate-pulse"
    style={{ aspectRatio: '3/4' }}
  >
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <div className="h-4 w-3/4 rounded bg-zinc-800 mb-2" />
      <div className="h-3 w-1/2 rounded bg-zinc-800" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SongPage = () => {
  const navigate = useNavigate();
  const [searchValue] = useState('');
  const [moreSearchValue, setMoreSearchValue] = useState('');
  const [morePage, setMorePage] = useState(1);
  const MORE_SONGS_LIMIT = 8;

  // Gọi API danh sách bài hát HOT (luôn lấy 4 bài đầu tiên của trang 1)
  const { data: hotSongsData, isLoading: isLoadingHotSongs } = useQuery({
    queryKey: [QUERY_KEY.SONG.LIST, { search: searchValue }],
    queryFn: () =>
      ApiSong.getSongList({
        page: 1,
        limit: 4,
        search: searchValue || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Gọi API danh sách bài hát còn lại (có phân trang và tìm kiếm riêng)
  const { data: moreSongsData, isLoading: isLoadingMoreSongs } = useQuery({
    queryKey: [
      QUERY_KEY.SONG.LIST,
      'more',
      { search: moreSearchValue, page: morePage },
    ],
    queryFn: () =>
      ApiSong.getSongList({
        page: morePage,
        limit: MORE_SONGS_LIMIT,
        search: moreSearchValue || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Tách hot songs (4 đầu tiên) và phần còn lại
  const hotSongs = useMemo(() => hotSongsData?.data ?? [], [hotSongsData]);
  const allMoreSongs = useMemo(
    () => moreSongsData?.data ?? [],
    [moreSongsData]
  );
  const moreSongsMetadata = moreSongsData?.metadata;
  const moreTotalPages = moreSongsMetadata?.totalPages ?? 1;

  const handleClickSong = (songId: string) => {
    navigate(`/app/songs/${songId}/sing`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#ff006e]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-20 w-80 h-80 rounded-full bg-[#00d4ff]/8 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff006e]/30 bg-[#ff006e]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ff006e]">
                <Flame size={12} />
                Nền tảng học tập có Karaoke AI đầu tiên Việt Nam
              </div>

              <h1 className="font-headline font-black text-6xl md:text-8xl text-on-surface leading-none tracking-tighter uppercase">
                Hát cực chất, <br />
                <p className="text-[#FF007A] tracking-normal bg-[#FAFF00] px-2 border-2 border-black inline-block transform rotate-1">
                  Phiêu
                </p>{' '}
                cực đỉnh
              </h1>

              <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-md">
                Chấm điểm bằng AI, giúp bạn giải trí sau những giờ học căng
                thẳng
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    // Scroll tới phần bài hát
                    document
                      .getElementById('songs')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group flex items-center gap-2 rounded-full bg-[#ff006e] px-8 py-3.5 text-sm font-extrabold uppercase text-white tracking-wider transition hover:bg-[#e0005f] hover:shadow-lg hover:shadow-[#ff006e]/30 active:scale-95"
                >
                  <Mic size={16} />
                  HÁT NGAY
                </button>
                <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-zinc-500 hover:bg-white/10">
                  <PlayCircle size={16} />
                  Xem demo
                </button>
              </div>

              {/* Stats Mini */}
              <div className="mt-10 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-extrabold text-white">500K+</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Người dùng</p>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <p className="text-2xl font-extrabold text-white">
                    {hotSongs.length > 0 ? `${hotSongs.length}+` : '50K+'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Bài hát</p>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-extrabold text-white">4.9</p>
                    <Star
                      size={14}
                      className="fill-[#ffee00] text-[#ffee00] mb-1"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Đánh giá</p>
                </div>
              </div>
            </div>

            {/* Right: Illustration frame */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Yellow corner border accent */}
                <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border-2 border-[#ffee00]" />
                <div className="relative w-72 h-96 md:w-80 md:h-[420px] rounded-2xl bg-zinc-900 border-2 border-[#ffee00] overflow-hidden flex items-center justify-center">
                  {/* Nếu có bài hát đầu tiên có thumbnail, hiển thị */}
                  {hotSongs[0]?.songFiles?.thumbnail ? (
                    <img
                      src={hotSongs[0].songFiles.thumbnail}
                      alt={hotSongs[0].title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff006e]/20 to-[#00d4ff]/10" />
                      <div className="text-center z-10">
                        <Mic size={80} className="text-zinc-500 mx-auto mb-4" />
                        <p className="text-lg font-extrabold text-white uppercase">
                          Let's Sing
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          AI Scoring System
                        </p>
                      </div>
                    </>
                  )}

                  {/* Score overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-400">Độ phổ biến</p>
                        <p className="text-lg font-bold text-white">🔥 Hot</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Độ chính xác</p>
                        <p className="text-lg font-bold text-[#ffee00]">97%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hot Trend Section ── */}
      <section id="songs" className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#ff006e]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#ff006e]">
                HOT TREND
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Bài Hát Nổi Bật 🔥
              </h2>
            </div>
            <a
              href="#ranking"
              className="flex items-center gap-1 text-sm font-semibold text-zinc-400 hover:text-white transition"
            >
              Xem tất cả
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {isLoadingHotSongs
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SongCardSkeleton key={i} />
                ))
              : hotSongs.map((song, idx) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={idx}
                    featured={idx === 0}
                    onClick={() => handleClickSong(song.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Section ── */}
      <section className="py-12 md:py-16 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Tại sao chọn{' '}
              <span className="text-[30px] lg:text-[60px] text-[#ff006e]">
                GoodLearn Karaoke?
              </span>
            </h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-lg mx-auto">
              Nền tảng karaoke AI đầu tiên được thiết kế đặc biệt cho học sinh —
              học hát, giải trí và rèn luyện kỹ năng!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chấm điểm AI 2.0 */}
            <FeatureCard
              icon={<Star size={20} />}
              title="Chấm điểm AI 2.0"
              desc="Công nghệ nhận diện giọng hát độc quyền, phân tích từng nốt nhạc và nhịp điệu để bạn biết mình cần cải thiện ở đâu."
              variant="magenta"
              className="md:col-span-2"
              extra={
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-end gap-0.5 h-8">
                    {[4, 7, 10, 6, 9, 12, 8, 11, 7, 9].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-white/50"
                        style={{ height: `${h * 2.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/70 font-semibold">
                    Phân tích realtime
                  </span>
                </div>
              }
            />

            {/* Đấu trường live */}
            <FeatureCard
              icon={<AudioLines size={20} />}
              title="Làn điệu dân ca"
              className="md:col-span-1"
              desc="Nhiều bài hát quan họ Bắc Ninh giúp các em học sinh bảo tồn và phát huy nét đẹp văn hóa dân tộc"
              variant="light"
              extra={
                <div className="mt-2 flex gap-2">
                  <div className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                    🥇 Gold
                  </div>
                  <div className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                    🥈 Silver
                  </div>
                  <div className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700">
                    🥉 Bronze
                  </div>
                </div>
              }
            />

            {/* Lời bài hát chi tiết */}
            <FeatureCard
              icon={<FileText size={20} />}
              title="Lời bài hát chi tiết"
              desc="Lyrics đồng bộ realtime từng câu. Hỗ trợ LRC format."
              variant="white"
              className="md:col-span-1"
              extra={
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5 h-8">
                    {[4, 6, 7, 10, 9, 12, 8].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-gray-600 h-[6px]"
                        style={{ width: `${h * 2.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-foreground font-semibold">
                    Lời bài hát chi tiết
                  </span>
                </div>
              }
            />

            {/* Nhận thưởng*/}
            <FeatureCard
              icon={<Gift size={20} />}
              title="Nhận thưởng"
              desc="Hát càng hay, càng nhận được phần thưởng để sử dụng các tính năng nâng cao như: chat, tạo video, tạo flashcard bằng AI."
              variant="record"
              className="md:col-span-2"
              extra={
                <button className="mt-2 flex items-center gap-2 rounded-full bg-[#00d4ff] px-4 py-2 text-xs font-bold text-white hover:bg-[#00b8d9] transition">
                  <Gift size={12} />
                  Nhận thưởng ngay
                </button>
              }
            />
          </div>
        </div>
      </section>

      {/* ── More Songs Section ── */}
      <section id="ranking" className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Bài hát khác 🎵
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={moreSearchValue}
                onChange={(e) => {
                  setMoreSearchValue(e.target.value);
                  setMorePage(1); // Reset to page 1 when search changes
                }}
                placeholder="Tìm kiếm bài hát..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff] transition"
              />
            </div>
          </div>

          {/* Song Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoadingMoreSongs
              ? Array.from({ length: MORE_SONGS_LIMIT }).map((_, i) => (
                  <SongCardSkeleton key={`more-${i}`} />
                ))
              : allMoreSongs.map((song, idx) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={idx + (morePage - 1) * MORE_SONGS_LIMIT}
                    onClick={() => handleClickSong(song.id)}
                  />
                ))}
          </div>

          {/* Empty State */}
          {allMoreSongs.length === 0 && !isLoadingMoreSongs && (
            <div className="py-12 text-center text-zinc-600 text-sm">
              Không tìm thấy bài hát nào
            </div>
          )}

          {/* Pagination */}
          {moreTotalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setMorePage((prev) => Math.max(1, prev - 1))}
                disabled={morePage <= 1}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>

              <span className="px-4 py-2 text-sm font-semibold text-white">
                Trang {morePage} / {moreTotalPages}
              </span>

              <button
                onClick={() =>
                  setMorePage((prev) => Math.min(moreTotalPages, prev + 1))
                }
                disabled={morePage >= moreTotalPages}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-12 md:py-16 bg-zinc-950/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sẵn sàng <span className="text-[#ff006e]">thách đấu</span> chưa?
          </h2>
          <p className="mt-4 text-zinc-400 text-base max-w-lg mx-auto">
            Tham gia cùng hơn 500,000 học sinh đang cải thiện giọng hát mỗi ngày
            với AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                document
                  .getElementById('songs')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 rounded-full bg-[#ffee00] px-8 py-3.5 text-sm font-extrabold uppercase text-[#0a0a0a] tracking-wider transition hover:bg-[#ffee00]/90 active:scale-95"
            >
              <Trophy size={16} />
              THỬ NGAY MIỄN PHÍ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SongPage;
