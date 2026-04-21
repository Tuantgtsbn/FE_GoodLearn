import z from 'zod';

export const ReviewAppDto = z.object({
  rating: z.number().min(1, 'Rating từ 1 đến 5').max(5, 'Rating từ 1 đến 5'),
  content: z
    .string()
    .min(1, 'Nội dung đánh giá là bắt buộc')
    .max(1000, 'Nội dung không vượt quá 1000 ký tự'),
});

export type ReviewAppDataDto = z.infer<typeof ReviewAppDto>;

export const ReviewAppStatsDto = z.object({
  totalReviews: z.number(),
  averageRating: z.number(),
  ratingDistribution: z.record(z.string(), z.number()).optional(),
});

export type ReviewAppStatsDataDto = z.infer<typeof ReviewAppStatsDto>;
