import { type IDataError } from '@api/Fetcher';

export const isDataError = (error: unknown): error is IDataError => {
  return typeof error === 'object' && error !== null && 'errorCode' in error;
};
