import type { ITestCategory } from '@/types';
import { fetcherWithMetadata } from './Fetcher';

const path = {
  getTestCategories: '/test-categories',
};

type SearchTestCategoryQuery = {
  search?: string;
  page?: string;
  limit?: string;
};

const getTestCategories = async (params: SearchTestCategoryQuery) => {
  return fetcherWithMetadata<ITestCategory[]>({
    method: 'GET',
    url: path.getTestCategories,
    params,
  });
};

export default {
  getTestCategories,
};
