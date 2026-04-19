import { fetcher, fetcherWithMetadata } from './Fetcher';
import type {
  IFlashcardListApiQuery,
  IFlashcardSetListItem,
  IFlashcardSetDetailResponse,
} from '@/types/flashcard';

const path = {
  list: '/flashcard-sets',
  detail: (id: string) => `/flashcard-sets/${id}`,
  share: (id: string) => `/flashcard-sets/${id}/share`,
  unshare: (id: string) => `/flashcard-sets/${id}/unshare`,
};

export interface IFlashcardVisibilityUpdateResponse {
  id: string;
  isPublic: boolean;
  updatedAt: string;
}

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

const shareFlashcardSet = (id: string) => {
  return fetcher<IFlashcardVisibilityUpdateResponse>(
    {
      url: path.share(id),
      method: 'PATCH',
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const unshareFlashcardSet = (id: string) => {
  return fetcher<IFlashcardVisibilityUpdateResponse>(
    {
      url: path.unshare(id),
      method: 'PATCH',
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
  shareFlashcardSet,
  unshareFlashcardSet,
};
