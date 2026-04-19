import { fetcher, fetcherWithMetadata } from './Fetcher';
import type {
  IVideoDetailResponse,
  IVideoListApiQuery,
  IVideoListItem,
} from '@/types/video';

const path = {
  list: '/videos',
  detail: (id: string) => `/videos/${id}`,
};

const getVideoList = (params: IVideoListApiQuery) => {
  return fetcherWithMetadata<IVideoListItem[]>(
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

const getVideoDetail = (id: string) => {
  return fetcher<IVideoDetailResponse>(
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
  getVideoList,
  getVideoDetail,
};
