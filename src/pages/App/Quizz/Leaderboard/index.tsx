import ApiExam from '@/api/ApiExam';
import QUERY_KEY from '@/api/QueryKey';
import Avatar from '@/components/ui/Avatar';
import type { IExamLeaderboardEntry } from '@/types/exam';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ArrowLeft,
  Award,
  Crown,
  LoaderCircle,
  Medal,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type LeaderboardLocationState = {
  examTitle?: string;
  from?: 'quizz_list' | 'do_exam';
};

const formatExamDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getDisplayName = (entry: IExamLeaderboardEntry) => {
  return entry.user.fullName || entry.user.username || 'Người dùng';
};

const rankClassName = (rank: number) => {
  if (rank === 1)
    return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
  if (rank === 2) return 'bg-muted text-muted-foreground border';
  if (rank === 3)
    return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
  return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { quizId = '' } = useParams();
  const { state } = useLocation();
  const locationState = state as LeaderboardLocationState | null;

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEY.EXAM.LEADERBOARD, quizId],
    queryFn: () => ApiExam.getExamLeaderboard(quizId),
    enabled: Boolean(quizId),
  });

  const examTitle =
    locationState?.examTitle ||
    data?.quiz.title ||
    (quizId ? `Đề thi #${quizId.slice(0, 8).toUpperCase()}` : 'Bảng xếp hạng');

  const topThree = useMemo(() => {
    return data?.leaderboard.slice(0, 3) || [];
  }, [data?.leaderboard]);

  const highestPoint = data?.leaderboard[0]?.point ?? null;

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-2xl border bg-background px-6 py-4 shadow-sm">
          <LoaderCircle
            className="animate-spin text-muted-foreground"
            size={20}
          />
          <span className="font-semibold text-muted-foreground">
            Đang tải bảng xếp hạng...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border bg-background p-6 text-center">
          <h2 className="text-xl font-bold text-foreground">
            Không thể tải bảng xếp hạng
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => {
                if (locationState?.from === 'do_exam') {
                  navigate(-1);
                } else {
                  navigate('/app/quizz');
                }
              }}
              className="rounded-xl border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
            >
              Quay lại
            </button>
            <button
              onClick={() => void refetch()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-5 py-5 text-white shadow-xl md:px-6">
        <button
          onClick={() => {
            if (locationState?.from === 'quizz_list') {
              navigate('/app/quizz');
            } else {
              navigate(-1);
            }
          }}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Trophy size={13} />
              Leaderboard
            </p>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">
              {examTitle}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Top 20 người có điểm cao nhất và thứ hạng hiện tại của bạn.
            </p>
          </div>

          <button
            disabled={isFetching}
            onClick={() => refetch()}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15"
          >
            {isFetching ? 'Đang cập nhật...' : 'Đồng bộ mới nhất'}
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border bg-background p-4">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Award size={14} />
            Điểm cao nhất
          </p>
          <p className="mt-2 text-3xl font-black text-primary">
            {highestPoint !== null ? `${highestPoint.toFixed(2)}` : '--'}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <UserRound size={14} />
            Top hiển thị
          </p>
          <p className="mt-2 text-3xl font-black text-foreground">
            {data.leaderboard.length}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Medal size={14} />
            Thứ hạng của bạn
          </p>
          <p className="mt-2 text-3xl font-black text-primary">
            {data.myRank ? `#${data.myRank.rank}` : '--'}
          </p>
        </div>
      </section>

      {/* Podium */}
      {topThree.length > 0 && (
        <section className="overflow-hidden rounded-3xl border bg-background p-6 md:p-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-foreground md:text-4xl">
              Vinh Danh Top 3
            </h2>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              Tổng cộng {data?.leaderboard.length.toLocaleString() || '--'}{' '}
              người tham gia đã hoàn thành bài thi
            </p>
          </div>

          <div className="flex flex-row items-end justify-center gap-4 pt-[50px] md:gap-16 w-full">
            {[2, 1, 3].map((rank) => {
              const entry = topThree.find((e) => e.rank === rank);
              if (!entry)
                return <div key={rank} className="hidden md:block w-32" />;

              const isFirst = rank === 1;
              const avatarSize = isFirst
                ? 'w-30 h-30 md:w-40 md:h-40'
                : 'w-24 h-24 md:w-32 md:h-32';
              const bgColor =
                rank === 1
                  ? 'bg-yellow-400'
                  : rank === 2
                    ? 'bg-orange-400'
                    : 'bg-slate-300';
              const badgeBg =
                rank === 1
                  ? 'bg-yellow-400'
                  : rank === 2
                    ? 'bg-orange-400'
                    : 'bg-slate-400';
              const badgeLabel =
                rank === 1 ? 'Vàng' : rank === 2 ? 'Bạc' : 'Đồng';

              return (
                <div
                  key={entry.user.id}
                  className={clsx(
                    'flex flex-col items-center transition-all',
                    isFirst
                      ? 'z-10 mb-[30px] scale-110 md:scale-125'
                      : 'opacity-90'
                  )}
                >
                  <div className="relative mb-4">
                    {isFirst && (
                      <div className="absolute -top-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center text-yellow-500 drop-shadow-md">
                        <Crown size={isFirst ? 32 : 24} fill="currentColor" />
                      </div>
                    )}

                    <div
                      className={clsx(
                        'rounded-full p-2 flex justify-center items-center',
                        bgColor
                      )}
                    >
                      <Avatar
                        name={getDisplayName(entry)}
                        src={entry.user.avatarUrl}
                        className={clsx('object-cover', avatarSize)}
                        size="lg"
                      />
                    </div>

                    <div
                      className={clsx(
                        'absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md md:text-xs',
                        badgeBg
                      )}
                    >
                      {badgeLabel}
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    <p className="max-w-[120px] truncate text-sm font-black text-foreground md:max-w-[200px] md:text-xl">
                      {getDisplayName(entry)}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-muted-foreground md:text-sm">
                      {entry.point.toFixed(0)} Điểm
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Leaderboard Table */}
      <section className="rounded-2xl border bg-background p-4 md:p-5">
        <h2 className="mb-3 text-base font-extrabold text-foreground">
          Top 20 bảng xếp hạng
        </h2>

        {data.leaderboard.length === 0 ? (
          <div className="rounded-xl bg-muted p-5 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu xếp hạng cho bài thi này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Hạng
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Người dùng
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Điểm
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ngày thi
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((entry) => {
                  const isMe = data.myRank?.user.id === entry.user.id;

                  return (
                    <tr
                      key={`${entry.user.id}-${entry.rank}`}
                      className={clsx(
                        'ring-1',
                        isMe
                          ? 'bg-blue-500/5 ring-blue-500/20'
                          : 'bg-background ring-border'
                      )}
                    >
                      <td className="px-3 py-3 align-middle">
                        <span
                          className={clsx(
                            'rounded-full border px-2 py-1 text-xs font-bold',
                            rankClassName(entry.rank)
                          )}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={getDisplayName(entry)}
                            src={entry.user.avatarUrl}
                            size="sm"
                          />
                          <div>
                            <p className="line-clamp-1 text-sm font-semibold text-foreground">
                              {getDisplayName(entry)}
                            </p>
                            {isMe && (
                              <p className="text-xs font-semibold text-primary">
                                Bạn
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right align-middle text-sm font-black text-foreground">
                        {entry.point.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3 text-right align-middle text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-bold">
                          {formatExamDate(entry.examDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {data.myRank &&
        !data.leaderboard.some(
          (entry) => entry.user.id === data.myRank?.user.id
        ) && (
          <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">
              Thứ hạng của bạn
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-blue-700/80 dark:text-blue-400/80">
                Bạn đang đứng hạng{' '}
                <span className="font-black">#{data.myRank.rank}</span> với{' '}
                <span className="font-black">
                  {data.myRank.point.toFixed(2)}%
                </span>
              </p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                Ngày thi: {formatExamDate(data.myRank.examDate)}
              </p>
            </div>
          </section>
        )}
    </div>
  );
};

export default LeaderboardPage;
