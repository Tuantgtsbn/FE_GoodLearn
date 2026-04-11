import { fetcher, fetcherWithMetadata } from './Fetcher';
import {
  type ITag,
  type ICreateTagRequest,
  type IUpdateTagRequest,
} from 'src/types';

export interface IGetTagsParams {
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IGetTagByIdParams {
  id: string;
}

export interface IGetTagBySlugParams {
  slug: string;
}

const path = {
  base: '/tags',
  getById: (id: string) => `/tags/${id}`,
  getBySlug: (slug: string) => `/tags/slug/${slug}`,
};

// ==================== PUBLIC ENDPOINTS ====================

const getTags = (params?: IGetTagsParams) => {
  return fetcherWithMetadata<ITag[]>({
    url: path.base,
    method: 'GET',
    params,
  });
};

const getTagById = (id: string) => {
  return fetcher<ITag>({
    url: path.getById(id),
    method: 'GET',
  });
};

const getTagBySlug = (slug: string) => {
  return fetcher<ITag>({
    url: path.getBySlug(slug),
    method: 'GET',
  });
};

// ==================== ADMIN ENDPOINTS ====================

const createTag = (data: ICreateTagRequest) => {
  return fetcher<ITag>({
    url: path.base,
    method: 'POST',
    data,
  });
};

const updateTag = (id: string, data: IUpdateTagRequest) => {
  return fetcher<ITag>({
    url: path.getById(id),
    method: 'PATCH',
    data,
  });
};

const deleteTag = (id: string) => {
  return fetcher<ITag>({
    url: path.getById(id),
    method: 'DELETE',
  });
};

export default {
  // Public
  getTags,
  getTagById,
  getTagBySlug,
  // Admin
  createTag,
  updateTag,
  deleteTag,
};
