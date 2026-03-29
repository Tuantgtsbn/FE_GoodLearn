import { type IDataError } from '@api/Fetcher';
import { isDataError } from './narrowType';
import axios from 'axios';

type SuccessResult<T> = readonly [T, null];
type ErrorResult<E> = readonly [null, E];
type Result<T, E> = SuccessResult<T> | ErrorResult<E>;

function parseError(error: any): IDataError {
  if (isDataError(error)) {
    return error;
  } else if (axios.isAxiosError(error)) {
    return {
      errorCode: error.response?.data?.code || 'UNKNOWN_ERROR',
      errorMessage: error.response?.data?.message || 'Unknown error',
    };
  } else if (error instanceof Error) {
    return {
      errorCode: 'UNKNOWN_ERROR',
      errorMessage: error.message,
    };
  } else if (typeof error === 'string') {
    return {
      errorCode: 'UNKNOWN_ERROR',
      errorMessage: error,
    };
  }
  return {
    errorCode: 'UNKNOWN_ERROR',
    errorMessage: 'Unknown error',
  };
}

async function tryCatch<T>(fn: Promise<T>): Promise<Result<T, IDataError>> {
  try {
    const data = await fn;
    return [data, null] as const;
  } catch (error: unknown) {
    const parsedError = parseError(error);
    return [null, parsedError] as const;
  }
}

export { tryCatch, parseError };
