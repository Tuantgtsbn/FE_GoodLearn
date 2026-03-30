import { fetcher, fetcherWithMetadata } from './Fetcher';
import type { IFlashcardListApiQuery, IFlashcardSetListItem, IFlashcardSetDetailResponse } from '@/types/flashcard';

const path = {
  list: '/flashcard-sets',
  detail: (id: string) => `/flashcard-sets/${id}`,
};

const getFlashcardSetList = (params: IFlashcardListApiQuery) => {
  return fetcherWithMetadata<IFlashcardSetListItem[]>(
    {
      url: path.list,
      method: 'GET',
      params,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const getFlashcardSetDetail = (id: string) => {
  return fetcher<IFlashcardSetDetailResponse>(
    {
      url: path.detail(id),
      method: 'GET',
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

export default {
  getFlashcardSetList,
  getFlashcardSetDetail,
};
