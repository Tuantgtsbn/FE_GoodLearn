import type { ISubject } from '@/types';
import { fetcherWithMetadata } from './Fetcher';

const path = {
  getSubjects: '/subjects',
};

type SearchSubjectQuery = {
  search?: string;
  page?: string;
  limit?: string;
};

const getSubjects = async (params: SearchSubjectQuery) => {
  return fetcherWithMetadata<ISubject[]>({
    method: 'GET',
    url: path.getSubjects,
    params,
  });
};

export default {
  getSubjects,
};
