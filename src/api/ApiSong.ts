import type { ISong, ISongScore } from '@/types';
import { fetcher, fetcherWithMetadata } from './Fetcher';

// Request Interfaces
export interface ISongListApiQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface IListSongScoreQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: 'createdAt' | 'totalScore';
  sortOrder?: 'asc' | 'desc';
}

export interface IUserSongHistoryQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: 'createdAt' | 'totalScore';
  sortOrder?: 'asc' | 'desc';
  status?: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

const path = {
  list: '/songs',
  detail: (id: string) => `/songs/${id}`,
  scores: (id: string) => `/songs/${id}/scores`,
  scoreVoice: (id: string) => `/songs/${id}/score`,
  scoreStatus: (scoreId: string) => `/songs/scores/${scoreId}/status`,
  history: '/songs/user/history',
};

/**
 * Lấy danh sách bài hát (có phân trang và tìm kiếm)
 */
const getSongList = (params: ISongListApiQuery) => {
  return fetcherWithMetadata<ISong[]>(
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

/**
 * Lấy chi tiết bài hát bằng ID
 */
const getSongDetail = (id: string) => {
  return fetcher<ISong>(
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

/**
 * Thêm bài hát mới (bao gồm các file)
 */
const createSong = (data: FormData) => {
  return fetcher<ISong>(
    {
      url: path.list,
      method: 'POST',
      data,
    },
    {
      withToken: true,
      displayError: true, // Thường create sẽ cần show lỗi nếu có
    }
  );
};

/**
 * Lấy danh sách điểm số (bảng xếp hạng) của một bài hát
 */

type SongScoresDataResponse = {
  id: string;
  totalScore: number;
  grade: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };
};

export type SongHistoryItem = {
  id: string;
  songId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalScore: number | null;
  grade: string | null;
  pitchScore: number | null;
  rhythmScore: number | null;
  stabilityScore: number | null;
  dynamicsScore: number | null;
  processingTimeMs: number | null;
  createdAt: string;
  song: {
    id: string;
    title: string;
    artists: string[];
    genre: string | null;
    durationSeconds: number | null;
  };
};

const getSongScores = (id: string, params: IListSongScoreQuery) => {
  return fetcherWithMetadata<SongScoresDataResponse[]>(
    {
      url: path.scores(id),
      method: 'GET',
      params,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

/**
 * Bắt đầu tính điểm giọng hát bằng file ghi âm
 */
const scoreVoice = (id: string, data: FormData) => {
  return fetcher<{ scoreId: string; status: string }>(
    {
      url: path.scoreVoice(id),
      method: 'POST',
      data,
    },
    {
      isFormData: true,
      withToken: true,
      displayError: true,
    }
  );
};

/**
 * Lấy trạng thái quá trình chấm điểm hiện tại (polling)
 */
const getScoreStatus = (scoreId: string) => {
  return fetcher<ISongScore>(
    {
      url: path.scoreStatus(scoreId),
      method: 'GET',
    },
    {
      withToken: true, // Nếu webhook gọi nội bộ thì tắt token, nhưng frontend gọi thì thường có token
      displayError: false, // Dùng polling không nên show error popup
    }
  );
};

/**
 * Lấy lịch sử hát karaoke của user hiện tại
 */
const getUserSongHistory = (params: IUserSongHistoryQuery) => {
  return fetcherWithMetadata<SongHistoryItem[]>(
    {
      url: path.history,
      method: 'GET',
      params,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

export default {
  getSongList,
  getSongDetail,
  createSong,
  getSongScores,
  scoreVoice,
  getScoreStatus,
  getUserSongHistory,
};
