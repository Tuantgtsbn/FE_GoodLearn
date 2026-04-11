import { fetcher, fetcherWithMetadata } from './Fetcher';
import {
  type ICategory,
  type ICreateCategoryRequest,
  type IUpdateCategoryRequest,
} from 'src/types';

export interface IGetCategoriesParams {
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  parentId?: string;
  includeChildren?: boolean;
}

export interface IGetCategoryByIdParams {
  id: string;
}

export interface IGetCategoryBySlugParams {
  slug: string;
}

const path = {
  base: '/categories',
  getById: (id: string) => `/categories/${id}`,
  getBySlug: (slug: string) => `/categories/slug/${slug}`,
};

// ==================== PUBLIC ENDPOINTS ====================

const getCategories = (params?: IGetCategoriesParams) => {
  return fetcherWithMetadata<ICategory[]>({
    url: path.base,
    method: 'GET',
    params,
  });
};

const getCategoryById = (id: string) => {
  return fetcher<ICategory>({
    url: path.getById(id),
    method: 'GET',
  });
};

const getCategoryBySlug = (slug: string) => {
  return fetcher<ICategory>({
    url: path.getBySlug(slug),
    method: 'GET',
  });
};

// ==================== ADMIN ENDPOINTS ====================

const createCategory = (data: ICreateCategoryRequest) => {
  return fetcher<ICategory>({
    url: path.base,
    method: 'POST',
    data,
  });
};

const updateCategory = (id: string, data: IUpdateCategoryRequest) => {
  return fetcher<ICategory>({
    url: path.getById(id),
    method: 'PATCH',
    data,
  });
};

const deleteCategory = (id: string) => {
  return fetcher<ICategory>({
    url: path.getById(id),
    method: 'DELETE',
  });
};

export default {
  // Public
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  // Admin
  createCategory,
  updateCategory,
  deleteCategory,
};
