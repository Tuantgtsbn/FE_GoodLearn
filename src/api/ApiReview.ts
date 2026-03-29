import { type ReviewAppDataDto, type ReviewAppStatsDataDto } from '@dto/review.dto';
import { fetcher } from './Fetcher';
import { type IReviewApp } from 'src/types';

const path = {
    baseReview: '/reviews',
    getStats: '/reviews/stats',
    getReviews: '/reviews',
    submitReview: '/reviews',
};

const getReviewStats = () => {
    return fetcher<ReviewAppStatsDataDto>({
        url: path.getStats,
        method: 'GET',
    });
};

const getPublishedReviews = (limit: number = 10, offset: number = 0) => {
    return fetcher<IReviewApp[]>({
        url: `${path.getReviews}?limit=${limit}&offset=${offset}`,
        method: 'GET',
    });
};

const submitOrUpdateReview = (data: ReviewAppDataDto) => {
    return fetcher<IReviewApp>({
        url: path.submitReview,
        method: 'POST',
        data,
    });
};

export default {
    getReviewStats,
    getPublishedReviews,
    submitOrUpdateReview,
};
