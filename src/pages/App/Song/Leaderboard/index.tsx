import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ArrowLeft,
  Crown,
  Trophy,
  Eye,
  ChevronDown,
  Music,
  Loader2,
  TrendingUp,
  Flame,
} from 'lucide-react';

import ApiSong from '@/api/ApiSong';
import QUERY_KEY from '@/api/QueryKey';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  id: string;
  totalScore: number;
  grade: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };
}

// ─── Avatar Component ─────────────────────────────────────────────────────────
const Avatar = ({
  name,
  url,
  size = 'md',
}: {
  name: string;
  url: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const initial = name.charAt(0).toUpperCase();
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  // Tạo gradient color dựa vào tên
  const colors = [
    'from-[#ff006e] to-[#ff6b35]',
    'from-[#00d4ff] to-[#0088cc]',
    'from-[#ffee00] to-[#ff6b35]',
    'from-[#10b981] to-[#00d4ff]',
    'from-[#8b5cf6] to-[#ff006e]',
    'from-[#f59e0b] to-[#ff006e]',
  ];
  const colorIdx = name.length % colors.length;

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={clsx(
          'rounded-full object-cover border-2 border-zinc-700',
          sizeMap[size]
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-extrabold text-white bg-gradient-to-br border-2 border-zinc-700',
        sizeMap[size],
        colors[colorIdx]
      )}
    >
      {initial}
    </div>
  );
};

// ─── Podium Card ──────────────────────────────────────────────────────────────
const PodiumCard = ({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
}) => {
  const cardStyles = {
    1: {
      bg: 'bg-[#ffee00]',
      text: 'text-[#0a0a0a]',
      badge: 'bg-[#0a0a0a] text-[#ffee00]',
      border: 'border-[#ffee00]',
      height: 'h-44',
      labelBg: 'bg-[#0a0a0a]',
      labelText: 'text-[#ffee00]',
      ptsColor: 'text-[#0a0a0a]',
    },
    2: {
      bg: 'bg-[#00d4ff]',
      text: 'text-[#0a0a0a]',
      badge: 'bg-[#0a0a0a] text-[#00d4ff]',
      border: 'border-[#00d4ff]',
      height: 'h-36',
      labelBg: 'bg-[#0a0a0a]',
      labelText: 'text-[#00d4ff]',
      ptsColor: 'text-[#0a0a0a]',
    },
    3: {
      bg: 'bg-[#ff006e]',
      text: 'text-white',
      badge: 'bg-[#0a0a0a] text-[#ff006e]',
      border: 'border-[#ff006e]',
      height: 'h-36',
      labelBg: 'bg-[#0a0a0a]',
      labelText: 'text-[#ff006e]',
      ptsColor: 'text-white',
    },
  };

  const s = cardStyles[rank];

  return (
    <div
      className={clsx(
        'relative flex flex-col items-center justify-end rounded-xl px-4 pb-4 pt-6 transition-transform hover:-translate-y-1',
        s.bg,
        s.height,
        rank === 1 ? 'w-40 md:w-48 z-10' : 'w-32 md:w-40'
      )}
    >
      {/* Rank badge: coin-style */}
      <div
        className={clsx(
          'absolute -top-0 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black',
          s.badge
        )}
      >
        {rank}
      </div>

      {/* King crown for #1 */}
      {rank === 1 && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-[#0a0a0a] px-3 py-1 flex items-center gap-1">
            <Crown size={12} className="text-[#ffee00]" />
            <span className="text-[10px] font-extrabold text-[#ffee00] uppercase tracking-wider">
              King
            </span>
          </div>
        </div>
      )}

      {/* Avatar / Rank number */}
      <div className="mb-2">
        {rank === 1 ? (
          <div className="w-14 h-14 rounded-lg bg-[#0a0a0a] flex items-center justify-center border-2 border-[#0a0a0a]">
            <span className="text-3xl font-black text-[#ffee00]">{rank}</span>
          </div>
        ) : (
          <Avatar
            name={entry.user.fullName}
            url={entry.user.avatarUrl}
            size="lg"
          />
        )}
      </div>

      {/* Name */}
      <p
        className={clsx(
          'text-sm font-extrabold uppercase tracking-tight text-center leading-tight',
          s.text
        )}
      >
        {entry.user.fullName}
      </p>

      {/* Score */}
      <div
        className={clsx(
          'mt-1.5 rounded-full px-3 py-0.5 text-xs font-extrabold',
          s.labelBg,
          s.labelText
        )}
      >
        {((entry.totalScore ?? 0) * 1000).toLocaleString()} PTS
      </div>
    </div>
  );
};

// ─── Ranking Row ──────────────────────────────────────────────────────────────
const RankingRow = ({
  entry,
  rank,
  isEven,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isEven: boolean;
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-4 px-5 py-3.5 transition-colors group',
        isEven ? 'bg-zinc-900/40' : 'bg-transparent',
        'hover:bg-zinc-800/60'
      )}
    >
      {/* Rank */}
      <div className="w-10 text-center">
        <span className="text-sm font-extrabold text-zinc-400">
          {String(rank).padStart(2, '0')}
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          name={entry.user.fullName}
          url={entry.user.avatarUrl}
          size="sm"
        />
        <span className="text-sm font-bold text-white truncate">
          {entry.user.fullName}
        </span>
      </div>

      {/* Grade */}
      <div className="w-14 text-center">
        <span
          className={clsx(
            'text-xs font-extrabold px-2 py-0.5 rounded-full',
            entry.grade?.startsWith('S')
              ? 'bg-[#ffee00]/15 text-[#ffee00]'
              : entry.grade?.startsWith('A')
                ? 'bg-[#00d4ff]/15 text-[#00d4ff]'
                : 'bg-zinc-700/50 text-zinc-400'
          )}
        >
          {entry.grade || 'N/A'}
        </span>
      </div>

      {/* Score */}
      <div className="w-20 text-right">
        <span className="text-sm font-extrabold text-[#ffee00]">
          {entry.totalScore?.toFixed(1) ?? '0.0'}
        </span>
      </div>

      {/* Action */}
      <div className="w-8 text-center">
        <button className="p-1 rounded-md hover:bg-zinc-700 transition opacity-0 group-hover:opacity-100">
          <Eye size={14} className="text-zinc-500" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SongLeaderboardPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // API call
  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY_KEY.SONG.SCORES,
      songId,
      { sortBy: 'totalScore', sortOrder },
    ],
    queryFn: () =>
      ApiSong.getSongScores(songId!, {
        sortBy: 'totalScore',
        sortOrder,
        limit: 50,
      }),
    enabled: !!songId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  // Extract scores from API response
  const scores = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      totalScore: item.totalScore,
      grade: item.grade,
      user: {
        id: item.user.id,
        fullName: item.user.fullName,
        avatarUrl: item.user.avatarUrl,
      },
    }));
  }, [data]);

  // Nếu < 3 thì hiển thị tất cả trong bảng, >= 3 thì tách top 3 ra podium
  const top3 = useMemo(
    () => (scores.length >= 3 ? scores.slice(0, 3) : []),
    [scores]
  );
  const rest = useMemo(
    () => (scores.length >= 3 ? scores.slice(3) : scores),
    [scores]
  );

  // Sắp xếp podium: [#2, #1, #3]
  const podiumOrder = useMemo(() => {
    if (top3.length === 3) {
      return [top3[1], top3[0], top3[2]]; // [#2, #1, #3]
    }
    return [];
  }, [top3]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={36} className="text-[#ff006e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero / Podium Section ── */}
      <section className="relative overflow-hidden pb-6">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#ffee00]/5 blur-3xl" />
          <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#ff006e]/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-80 h-80 rounded-full bg-[#00d4ff]/5 blur-3xl" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Title area */}
        <div className="relative z-10 pt-6 pb-2 px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Quay lại</span>
            </button>
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-[#ffee00]" />
              <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-tight">
                Bảng Xếp Hạng
              </h1>
            </div>
            <div className="w-16" /> {/* spacer */}
          </div>

          {/* Song info pill */}
          {songId && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="rounded-full bg-zinc-900 border border-zinc-700 px-4 py-1.5 flex items-center gap-2">
                <Music size={12} className="text-[#ff006e]" />
                <span className="text-xs font-bold text-zinc-300">
                  Bài hát đang xem
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Podium Cards - Only show when >= 3 entries */}
        {top3.length >= 3 && (
          <div className="relative z-10 flex items-end justify-center gap-2 md:gap-4 px-4 pb-4">
            {/* #2 */}
            <div className="flex flex-col items-center self-end">
              <PodiumCard entry={podiumOrder[0]} rank={2} />
            </div>
            {/* #1 (taller) */}
            <div className="flex flex-col items-center self-end -mb-2">
              <PodiumCard entry={podiumOrder[1]} rank={1} />
            </div>
            {/* #3 */}
            <div className="flex flex-col items-center self-end">
              <PodiumCard entry={podiumOrder[2]} rank={3} />
            </div>
          </div>
        )}

        {/* Decorative star */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <Flame size={16} className="text-[#ff006e] opacity-50" />
        </div>
      </section>

      {/* ── Rankings Table ── */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        {/* Table header */}
        <div className="flex items-center justify-between mb-1 px-5 py-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#ff006e]" />
            Global Rankings
          </h2>
          <button
            onClick={() => setSortOrder((p) => (p === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1 rounded-full bg-[#ff006e]/10 border border-[#ff006e]/20 px-3 py-1 text-[10px] font-extrabold uppercase text-[#ff006e] hover:bg-[#ff006e]/20 transition"
          >
            <ChevronDown
              size={12}
              className={clsx(
                'transition-transform',
                sortOrder === 'asc' && 'rotate-180'
              )}
            />
            {sortOrder === 'desc' ? 'Cao nhất' : 'Thấp nhất'}
          </button>
        </div>

        {/* Column labels */}
        {scores.length > 0 && (
          <div className="flex items-center gap-4 px-5 py-2 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            <div className="w-10 text-center">STT</div>
            <div className="flex-1">Người chơi</div>
            <div className="w-14 text-center">Grade</div>
            <div className="w-20 text-right">Điểm số</div>
            <div className="w-8" />
          </div>
        )}

        {/* Rows */}
        <div className="rounded-xl overflow-hidden border border-zinc-800/50">
          {/* Show all entries in table when < 3 */}
          {scores.length < 3 &&
            scores.map((entry, idx) => (
              <RankingRow
                key={entry.id}
                entry={entry}
                rank={idx + 1}
                isEven={idx % 2 === 0}
              />
            ))}

          {/* Show remaining entries when >= 3 */}
          {rest.length > 0 &&
            rest.map((entry, idx) => (
              <RankingRow
                key={entry.id}
                entry={entry}
                rank={idx + 4}
                isEven={idx % 2 === 0}
              />
            ))}

          {scores.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <Trophy size={48} className="mx-auto mb-4 text-zinc-700" />
              <p className="text-lg font-bold text-zinc-500">
                Chưa có dữ liệu xếp hạng
              </p>
              <p className="text-sm text-zinc-600 mt-2">
                Hãy là người đầu tiên tham gia!
              </p>
            </div>
          )}

          {scores.length >= 3 && rest.length === 0 && (
            <div className="py-8 text-center text-zinc-500 text-sm">
              Đã hiển thị tất cả {scores.length} người chơi
            </div>
          )}
        </div>
      </section>

      {/* ── Current User Rank Bar (sticky bottom) ── */}
      {/* TODO: Add API endpoint for current user's rank */}
      {scores.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-t-xl bg-zinc-800 border-t border-zinc-700 flex items-center justify-center px-5 py-3 shadow-2xl">
              <p className="text-sm font-bold text-zinc-400">
                🏆 Hãy tham gia hát để xem thứ hạng của bạn!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongLeaderboardPage;
