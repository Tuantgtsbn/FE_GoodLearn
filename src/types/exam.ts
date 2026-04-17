export interface IExamSubject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
}

export interface IExamCategory {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
}

export interface IExamListItem {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: number | null;
  timeLimit: number | null;
  passingScorePercentage: number | null;
  pointsToComplete: number;
  pointsToEarn: number;
  isPublic: boolean;
  isFeatured: boolean;
  isOfSystem: boolean;
  totalAttempts: number;
  totalCompletions: number;
  averageScore: number;
  questionCount: number;
  attemptCount: number;
  subject: IExamSubject | null;
  testCategory: IExamCategory | null;
  createdAt: string;
  updatedAt: string;
}

export interface IExamListApiQuery {
  page?: number;
  limit?: number;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'totalAttempts'
    | 'totalCompletions'
    | 'averageScore';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  subjectId?: string;
  gradeLevel?: number;
  isFeatured?: boolean;
}

export interface IExamAnswerOption {
  id: string;
  optionLabel: string;
  optionText: string;
  optionImageUrl: string | null;
  optionOrder: number;
}

export interface IExamQuestion {
  id: string;
  questionTitle: string;
  questionText: string;
  questionType: string;
  questionImageUrl: string | null;
  points: number;
  questionOrder: number;
  answerOptions: IExamAnswerOption[];
}

export type IExamAnswersMap = Record<string, string[]>;

export interface IStartExamPayload {
  quizId: string;
}

export interface IStartExamResponse {
  attemptId: string;
  quizId: string;
  durationSeconds: number | null;
  startedAt: string;
  timeLeftSeconds: number | null;
  resumed: boolean;
  answers: IExamAnswersMap;
  questions: IExamQuestion[];
}

export interface IGetExamAttemptDetailResponse {
  attemptId: string;
  quizId: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  timeLeftSeconds: number | null;
  isCompleted: boolean;
  isExpired: boolean;
  answers: IExamAnswersMap;
  questions: IExamQuestion[];
}

export interface ISaveExamAnswerPayload {
  attemptId: string;
  questionId: string;
  selectedOptions: string[];
}

export interface ISaveExamAnswerResponse {
  attemptId: string;
  questionId: string;
  selectedOptions: string[];
  answeredAt?: string;
  cleared: boolean;
}

export interface ISubmitExamPayload {
  attemptId: string;
}

export interface ISubmitExamResponse {
  attemptId: string;
  alreadySubmitted: boolean;
  score: number;
  maxScore: number;
  rawPoints: number;
  isPassed: boolean | null;
  pointsEarned: number | null;
  completedAt: string | null;
  timeSpentSeconds: number | null;
  autoSubmitted?: boolean;
}

export interface IExamLeaderboardUser {
  id: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface IExamLeaderboardEntry {
  rank: number;
  user: IExamLeaderboardUser;
  point: number;
  examDate: string;
}

export interface IExamLeaderboardResponse {
  quiz: {
    id: string;
    title: string;
  };
  leaderboard: IExamLeaderboardEntry[];
  myRank: IExamLeaderboardEntry | null;
}

export interface IExamQuestionResult {
  questionId: string;
  questionTitle: string;
  questionText: string;
  questionType: string;
  questionImageUrl: string | null;
  questionOrder: number;
  points: number;
  correctAnswer: string[];
  selectedOptions: string[];
  isCorrect: boolean;
  explanation: string | null;
  answerOptions: IExamAnswerOption[];
}

export interface IGetExamAttemptResultResponse {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  isPassed: boolean | null;
  passingScorePercentage: number | null;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number | null;
  questions: IExamQuestionResult[];
}
