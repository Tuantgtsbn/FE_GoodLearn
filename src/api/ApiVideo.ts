import { fetcher, fetcherWithMetadata } from './Fetcher';
import type {
  IVideoDetailResponse,
  IVideoListApiQuery,
  IVideoListItem,
} from '@/types/video';

const path = {
  list: '/videos',
  detail: (id: string) => `/videos/${id}`,
  share: (id: string) => `/videos/${id}/share`,
  unshare: (id: string) => `/videos/${id}/unshare`,
};

export interface IVideoVisibilityUpdateResponse {
  id: string;
  isPublic: boolean;
  updatedAt: string;
}

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

const shareVideo = (id: string) => {
  return fetcher<IVideoVisibilityUpdateResponse>(
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

const unshareVideo = (id: string) => {
  return fetcher<IVideoVisibilityUpdateResponse>(
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
  getVideoList,
  getVideoDetail,
  shareVideo,
  unshareVideo,
};
