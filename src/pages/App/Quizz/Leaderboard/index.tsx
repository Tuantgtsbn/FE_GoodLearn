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
  if (rank === 1) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (rank === 2) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-blue-50 text-blue-700 border-blue-100';
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

  // const fakeData = [
  //   {
  //     user: {
  //       id: '1',
  //       fullName: 'Nguyễn Văn A',
  //       avatarUrl: 'https://i.pravatar.cc/150?u=1',
  //     },
  //     point: 100,
  //     rank: 1,
  //   },
  //   {
  //     user: {
  //       id: '2',
  //       fullName: 'Nguyễn Văn B',
  //       avatarUrl: 'https://i.pravatar.cc/150?u=2',
  //     },
  //     point: 90,
  //     rank: 2,
  //   },
  //   {
  //     user: {
  //       id: '3',
  //       fullName: 'Nguyễn Văn C',
  //       avatarUrl: 'https://i.pravatar.cc/150?u=3',
  //     },
  //     point: 80,
  //     rank: 3,
  //   },
  // ];

  const highestPoint = data?.leaderboard[0]?.point ?? null;

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-slate-700 shadow-sm ring-1 ring-slate-200">
          <LoaderCircle className="animate-spin" size={20} />
          <span className="font-semibold">Đang tải bảng xếp hạng...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Không thể tải bảng xếp hạng
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => navigate('/app/quizz')}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Về danh sách đề
            </button>
            <button
              onClick={() => void refetch()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <header className="mb-5 rounded-3xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-700 px-5 py-5 text-white shadow-xl md:px-6">
        <button
          onClick={() =>
            navigate(`/app/quizz/${quizId}/do`, { state: { examTitle } })
          }
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} />
          Quay lại làm bài
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
            <p className="mt-1 text-sm text-blue-50">
              Top 20 người có điểm cao nhất và thứ hạng hiện tại của bạn.
            </p>
          </div>

          <button
            disabled={isFetching}
            onClick={() => refetch()}
            className="rounded-xl bg-white/15 px-3 py-2 text-sm"
          >
            {isFetching ? 'Đang cập nhật...' : 'Đồng bộ mới nhất'}
          </button>
        </div>
      </header>

      <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Award size={14} />
            Điểm cao nhất
          </p>
          <p className="mt-2 text-3xl font-black text-blue-700">
            {highestPoint !== null ? `${highestPoint.toFixed(2)}` : '--'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <UserRound size={14} />
            Top hiển thị
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {data.leaderboard.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Medal size={14} />
            Thứ hạng của bạn
          </p>
          <p className="mt-2 text-3xl font-black text-indigo-700">
            {data.myRank ? `#${data.myRank.rank}` : '--'}
          </p>
        </div>
      </section>

      {topThree.length > 0 && (
        <section className="mb-8 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Vinh Danh Top 3
            </h2>
            <p className="mt-2 text-base font-medium text-slate-500">
              Tổng cộng {data?.leaderboard.length.toLocaleString() || '--'}{' '}
              người tham gia đã hoàn thành bài thi
            </p>
          </div>

          <div className="flex flex-row items-end justify-center gap-4 md:gap-16 w-full pt-[50px]">
            {/* Podium ordering: Rank 2, Rank 1, Rank 3 */}
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
                    {/* Crown Icon for #1 */}
                    {isFirst && (
                      <div className="absolute -top-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center text-yellow-500 bg-transparent drop-shadow-md">
                        <Crown size={isFirst ? 32 : 24} fill="currentColor" />
                      </div>
                    )}

                    {/* Avatar with Ring */}
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

                    {/* Rank Badge */}
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
                    <p className="max-w-[120px] truncate text-sm font-black text-slate-900 md:max-w-[200px] md:text-xl">
                      {getDisplayName(entry)}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-500 md:text-sm">
                      {entry.point.toFixed(0)} Điểm
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
        <h2 className="mb-3 text-base font-extrabold text-slate-900">
          Top 20 bảng xếp hạng
        </h2>

        {data.leaderboard.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-600">
            Chưa có dữ liệu xếp hạng cho bài thi này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Hạng
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Người dùng
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Điểm
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                          ? 'bg-blue-50 ring-blue-200'
                          : 'bg-white ring-slate-200'
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
                            <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                              {getDisplayName(entry)}
                            </p>
                            {isMe && (
                              <p className="text-xs font-semibold text-blue-700">
                                Bạn
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right align-middle text-sm font-black text-slate-900">
                        {entry.point.toFixed(2)}%
                      </td>
                      <td className="px-3 py-3 text-right align-middle text-sm text-slate-600">
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
          <section className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
            <h3 className="text-sm font-bold text-indigo-900">
              Thứ hạng của bạn
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-indigo-900">
                Bạn đang đứng hạng{' '}
                <span className="font-black">#{data.myRank.rank}</span> với{' '}
                <span className="font-black">
                  {data.myRank.point.toFixed(2)}%
                </span>
              </p>
              <p className="text-xs text-indigo-700">
                Ngày thi: {formatExamDate(data.myRank.examDate)}
              </p>
            </div>
          </section>
        )}
    </div>
  );
};

export default LeaderboardPage;
