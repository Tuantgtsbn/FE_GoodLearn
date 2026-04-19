export interface IVideoUser {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface IVideoListItem {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  gradeLevel: number | null;
  aiModel: string | null;
  generationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  fileSize: number | null;
  isPublic: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  user: IVideoUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface IVideoListApiQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  gradeLevel?: number;
  isPublic?: boolean;
  scope?: 'mine' | 'public';
}

export interface IVideoDetailResponse extends IVideoListItem {
  transcript: string | null;
}
