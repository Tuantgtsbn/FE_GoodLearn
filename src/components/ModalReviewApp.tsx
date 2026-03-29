import { useCallback, useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthAction } from '@hooks/useAuthAction';
import ApiReview from '@api/ApiReview';
import QUERY_KEY from '@api/QueryKey';
import { type ReviewAppDataDto } from '@dto/review.dto';
import { toast } from 'react-toastify';

interface IModalReviewAppProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export default function ModalReviewApp({
  onClose,
  isOpen,
}: IModalReviewAppProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch review stats
  const { data: stats } = useQuery({
    queryKey: [QUERY_KEY.REVIEW.GET_REVIEW_STATS],
    queryFn: () => ApiReview.getReviewStats(),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: isOpen,
  });

  // Submit or update review mutation
  const submitReviewMutation = useMutation({
    mutationFn: (data: ReviewAppDataDto) =>
      ApiReview.submitOrUpdateReview(data),
    onSuccess: () => {
      setRating(0);
      setContent('');
      setIsSubmitting(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REVIEW.GET_REVIEW_STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.REVIEW.GET_REVIEWS],
      });
      onClose?.();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = useAuthAction(() => {
    if (rating === 0) {
      toast.warn('Vui lòng chọn mức đánh giá');
      return;
    }

    if (!content.trim()) {
      toast.warn('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    submitReviewMutation.mutate({
      rating,
      content: content.trim(),
    });
  });

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setRating(0);
      setContent('');
      onClose?.();
    }
  }, [isSubmitting, onClose]);

  // Calculate rating distribution
  const ratingStats = useMemo(() => {
    if (!stats) return [];
    const total = stats.totalReviews || 1;
    const distribution = (stats.ratingDistribution || {}) as Record<
      string,
      number
    >;
    return [
      {
        stars: 5,
        count: (distribution['5'] ?? 0) as number,
        percentage: Math.round(
          (((distribution['5'] ?? 0) as number) / total) * 100
        ),
      },
      {
        stars: 4,
        count: (distribution['4'] ?? 0) as number,
        percentage: Math.round(
          (((distribution['4'] ?? 0) as number) / total) * 100
        ),
      },
      {
        stars: 3,
        count: (distribution['3'] ?? 0) as number,
        percentage: Math.round(
          (((distribution['3'] ?? 0) as number) / total) * 100
        ),
      },
      {
        stars: 2,
        count: (distribution['2'] ?? 0) as number,
        percentage: Math.round(
          (((distribution['2'] ?? 0) as number) / total) * 100
        ),
      },
      {
        stars: 1,
        count: (distribution['1'] ?? 0) as number,
        percentage: Math.round(
          (((distribution['1'] ?? 0) as number) / total) * 100
        ),
      },
    ];
  }, [stats]);

  return (
    <div
      className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-gray-900 text-2xl">Đánh giá website</h2>
          <p className="text-xs text-gray-500 mt-1">
            Cảm nhận của cậu về trải nhiệm học tập cùng AI là gì?
          </p>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Rating Display */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div>
              <p className="text-4xl font-bold text-gray-900">
                {stats?.averageRating?.toFixed(1) || '0.0'}
              </p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(stats?.averageRating || 0)
                        ? 'text-orange-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totalReviews || 0} đánh giá
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-1.5">
              {ratingStats.length > 0
                ? ratingStats.map((stat) => (
                    <div key={stat.stars} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-6">
                        {stat.stars}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        <span>{stat.percentage}%</span>
                      </span>
                    </div>
                  ))
                : [5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-6">{star}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        0%
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-3 border-t pt-5">
          <label className="block text-md font-bold text-gray-700 uppercase tracking-wide">
            Cảm nhận của cậu
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ cảm nhận của cậu ở đây nhé..."
            className="w-full h-24 p-3 text-sm border bg-[#f1f1f1] border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent resize-none placeholder:text-gray-400"
            disabled={isSubmitting}
            maxLength={1000}
          />

          {/* Rating Stars Selection */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
              >
                {star <= (hoveredRating || rating) ? (
                  <span className="text-gray-400">★</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="px-6 py-2 font-bold basis-[40%] border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !content.trim()}
          className="px-6 py-2 font-bold flex-1 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </div>
  );
}
