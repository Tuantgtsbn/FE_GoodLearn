import { fetcherWithMetadata } from './Fetcher';
import { fetcher } from './Fetcher';
import type {
  IExamLeaderboardResponse,
  IExamListApiQuery,
  IExamListItem,
  IGetExamAttemptDetailResponse,
  ISaveExamAnswerPayload,
  ISaveExamAnswerResponse,
  IStartExamPayload,
  IStartExamResponse,
  ISubmitExamPayload,
  ISubmitExamResponse,
} from '@/types/exam';

const path = {
  list: '/exams',
  start: '/exams/start',
  answer: '/exams/answer',
  submit: '/exams/submit',
  attemptDetail: (attemptId: string) => `/exams/attempt/${attemptId}`,
  leaderboard: (quizId: string) => `/exams/${quizId}/leaderboard`,
};

const getExamList = (params: IExamListApiQuery) => {
  return fetcherWithMetadata<IExamListItem[]>(
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

const startExam = (payload: IStartExamPayload) => {
  return fetcher<IStartExamResponse>(
    {
      url: path.start,
      method: 'POST',
      data: payload,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const saveExamAnswer = (payload: ISaveExamAnswerPayload) => {
  return fetcher<ISaveExamAnswerResponse>(
    {
      url: path.answer,
      method: 'POST',
      data: payload,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const submitExam = (payload: ISubmitExamPayload) => {
  return fetcher<ISubmitExamResponse>(
    {
      url: path.submit,
      method: 'POST',
      data: payload,
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const getExamAttemptDetail = (attemptId: string) => {
  return fetcher<IGetExamAttemptDetailResponse>(
    {
      url: path.attemptDetail(attemptId),
      method: 'GET',
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

const getExamLeaderboard = (quizId: string) => {
  return fetcher<IExamLeaderboardResponse>(
    {
      url: path.leaderboard(quizId),
      method: 'GET',
    },
    {
      withToken: true,
      displayError: false,
    }
  );
};

export default {
  getExamList,
  startExam,
  saveExamAnswer,
  submitExam,
  getExamAttemptDetail,
  getExamLeaderboard,
};
