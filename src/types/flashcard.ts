// ─── Flashcard types ─────────────────────────────────────────────────────────

export interface IFlashcardSubject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  colorHex: string | null;
  iconName: string | null;
}

export interface IFlashcardUser {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface IFlashcardSetListItem {
  id: string;
  title: string;
  description: string | null;
  subjectId: string | null;
  subject: IFlashcardSubject | null;
  gradeLevel: number | null;
  isPublic: boolean;
  isFeatured: boolean;
  cardCount: number;
  viewCount: number;
  likeCount: number;
  generationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  user: IFlashcardUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface IFlashcardListApiQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  subjectId?: string;
  gradeLevel?: number;
  isPublic?: boolean;
}

export type FlashcardType =
  | 'BASIC'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'FILL_IN_THE_BLANK';

export interface IFlashcardOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface IFlashcardItem {
  id: string;
  flashcardSetId: string;
  type: FlashcardType;
  frontContent: string;
  backContent: string;
  options: IFlashcardOption[] | null;
  explanation: string | null;
  displayOrder: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IFlashcardSetDetailResponse extends IFlashcardSetListItem {
  flashcards: IFlashcardItem[];
}
