import { fetcher, fetcherWithMetadata } from './Fetcher';
import {
  type IArticle,
  type ICategoryWithArticles,
  type ICreateArticleRequest,
  type IUpdateArticleRequest,
} from 'src/types';

export interface IGetArticlesParams {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'viewCount' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
  authorId?: string;
  assigneeId?: string;
  status?: string;
}

export interface IGetFeaturedArticlesParams {
  page?: string;
  limit?: string;
  sortBy?: 'viewCount' | 'createdAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
  slug?: string;
  featured?: string;
  minViews?: string;
}

export interface IGetLatestByCategoriesParams {
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IGetMostViewedByCategoriesParams {
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  minViews?: string;
}

export interface IGetRelatedArticlesParams {
  articleId: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

const path = {
  base: '/articles',
  getById: (id: string) => `/articles/${id}`,
  getBySlug: (slug: string) => `/articles/slug/${slug}`,
  featured: '/articles/featured',
  latestByCategories: '/articles/latest-by-categories',
  mostViewedByCategories: '/articles/most-viewed-by-categories',
  related: '/articles/related',
  sendForReview: (id: string) => `/articles/send-for-review/${id}`,
  rejectReview: (id: string) => `/articles/review/reject/${id}`,
  approveReview: (id: string) => `/articles/review/approve/${id}`,
  requestEdit: (id: string) => `/articles/request-edit/${id}`,
};

// ==================== PUBLIC ENDPOINTS ====================

const getArticles = (params?: IGetArticlesParams) => {
  return fetcherWithMetadata<IArticle[]>({
    url: path.base,
    method: 'GET',
    params,
  });
};

const getFeaturedArticles = (params?: IGetFeaturedArticlesParams) => {
  return fetcherWithMetadata<IArticle[]>({
    url: path.featured,
    method: 'GET',
    params,
  });
};

const getLatestArticlesByCategories = (
  params?: IGetLatestByCategoriesParams
) => {
  return fetcherWithMetadata<ICategoryWithArticles[]>({
    url: path.latestByCategories,
    method: 'GET',
    params,
  });
};

const getMostViewedArticlesByCategories = (
  params?: IGetMostViewedByCategoriesParams
) => {
  return fetcherWithMetadata<ICategoryWithArticles[]>({
    url: path.mostViewedByCategories,
    method: 'GET',
    params,
  });
};

const getRelatedArticles = (params: IGetRelatedArticlesParams) => {
  return fetcherWithMetadata<IArticle[]>({
    url: path.related,
    method: 'GET',
    params,
  });
};

const getArticleById = (id: string) => {
  return fetcher<IArticle>({
    url: path.getById(id),
    method: 'GET',
  });
};

const getArticleBySlug = (slug: string) => {
  return fetcher<IArticle>({
    url: path.getBySlug(slug),
    method: 'GET',
  });
};

// ==================== ADMIN ENDPOINTS ====================

const createArticle = (
  data: ICreateArticleRequest,
  files?: { thumbnail?: File; images?: File[] }
) => {
  const formData = new FormData();

  // Append text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'tagIds' && Array.isArray(value)) {
        value.forEach((id) => formData.append('tagIds[]', id));
      } else if (key === 'extras' || key === 'toc') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'featured') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // Append files
  if (files?.thumbnail) {
    formData.append('thumbnail', files.thumbnail);
  }
  if (files?.images && files.images.length > 0) {
    files.images.forEach((file) => formData.append('images', file));
  }

  return fetcher<IArticle>({
    url: path.base,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateArticle = (
  id: string,
  data: IUpdateArticleRequest,
  files?: { thumbnail?: File; images?: File[] }
) => {
  const formData = new FormData();

  // Append text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'tagIds' && Array.isArray(value)) {
        value.forEach((id) => formData.append('tagIds[]', id));
      } else if (key === 'extras' || key === 'toc') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'featured') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // Append files
  if (files?.thumbnail) {
    formData.append('thumbnail', files.thumbnail);
  }
  if (files?.images && files.images.length > 0) {
    files.images.forEach((file) => formData.append('images', file));
  }

  return fetcher<IArticle>({
    url: path.getById(id),
    method: 'PATCH',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteArticle = (id: string) => {
  return fetcher<IArticle>({
    url: path.getById(id),
    method: 'DELETE',
  });
};

// ==================== ARTICLE REVIEW WORKFLOW ====================

const sendForReview = (id: string) => {
  return fetcher<IArticle>({
    url: path.sendForReview(id),
    method: 'POST',
  });
};

const rejectReview = (id: string, reason: string) => {
  return fetcher<IArticle>({
    url: path.rejectReview(id),
    method: 'POST',
    data: { reason },
  });
};

const approveReview = (id: string) => {
  return fetcher<IArticle>({
    url: path.approveReview(id),
    method: 'POST',
  });
};

const requestEdit = (id: string, assigneeId: string) => {
  return fetcher<IArticle>({
    url: path.requestEdit(id),
    method: 'POST',
    data: { assigneeId },
  });
};

export default {
  // Public
  getArticles,
  getFeaturedArticles,
  getLatestArticlesByCategories,
  getMostViewedArticlesByCategories,
  getRelatedArticles,
  getArticleById,
  getArticleBySlug,
  // Admin
  createArticle,
  updateArticle,
  deleteArticle,
  // Review workflow
  sendForReview,
  rejectReview,
  approveReview,
  requestEdit,
};
