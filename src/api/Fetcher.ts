import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import Config from '../config';
import qs from 'qs';
import {
  logout,
  handleLogout,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
} from '@utils/auth';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

enum ResponseCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
  INVALID_REFRESH_TOKEN = '10004',
  FORBIDDEN = '10005',
  UNAUTHORIZED = '10006',
  NOT_FOUND = '10007',
  VALIDATION_ERROR = '10008',
  INTERNAL_ERROR = '10009',
  BAD_REQUEST = '10010',
  RATE_LIMIT = '10029'
}

export interface IDataError<T = ValidationErrorDetail> {
  errorCode: string;
  errorMessage: string;
  errors?: T[];
}

export type ValidationErrorDetail = {
  field: string;
  message: string;
};

export interface IMetadata {
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export interface IDataWithMeta<T> {
  metadata: IMetadata;
  data: T;
}

export type QueryParam = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
};

export interface IResponseDTO<T> {
  success: boolean;
  message: string;
  data?: T;
  code: ResponseCode;
}

interface IResponseWithMetadataDTO<T> extends IResponseDTO<T> {
  metadata: IMetadata;
}

export interface IErrorResponseDTO<T> {
  success: boolean;
  message: string;
  code: ResponseCode;
  errors?: T[];
}

export interface IErrorResponseWithMetadataDTO<T> extends IErrorResponseDTO<T> {
  metadata: IMetadata;
}

export type IGeneralErrorResponseDTO = IErrorResponseDTO<ValidationErrorDetail>;

export type IGeneralErrorWithMetadataResponseDTO =
  IErrorResponseWithMetadataDTO<ValidationErrorDetail>;

interface IFetcherOptions {
  token?: string;
  withToken?: boolean;
  withMetadata?: boolean;
  displayError?: boolean;
  logRequest?: boolean;
  isFormData?: boolean;
}

function displayError<T = ValidationErrorDetail>(
  dataError: IDataError<T>
): void {
  const errorMessage = dataError.errorMessage ?? 'Somethings Wrong';
  toast.error(errorMessage);
}

function handleRefreshToken() {
  return new Promise<void>((resolve, reject) => {
    const currentRefreshToken = getRefreshToken();
    fetcher<{ accessToken: string }>(
      {
        url: '/auth/refresh-token',
        method: 'post',
        data: { refreshToken: currentRefreshToken },
      },
      { displayError: false, withToken: false }
    )
      .then((res) => {
        updateAccessToken(res.accessToken);
        setTimeout(() => {
          resolve();
        }, 100);
      })
      .catch(() => {
        reject();
      });
  });
}

function getAuthorization(defaultOptions: IFetcherOptions) {
  if (defaultOptions.token) {
    return `Bearer ${defaultOptions.token}`;
  }

  if (defaultOptions.withToken) {
    const token = getAccessToken();
    if (token) {
      return `Bearer ${token}`;
    }
  }

  return undefined;
}

function createApiClient(config: AxiosRequestConfig, options: IFetcherOptions) {
  const defaultOptions: IFetcherOptions = {
    ...config,
    withToken: Config.NETWORK_CONFIG.USE_TOKEN,
    withMetadata: Config.NETWORK_CONFIG.WITH_METADATA,
    displayError: Config.NETWORK_CONFIG.DISPLAY_ERROR,
    ...options,
  };

  const apiClient = axios.create({
    headers: {
      'Content-Type': options.isFormData
        ? 'multipart/form-data'
        : 'application/json',
      Authorization: getAuthorization(defaultOptions),
      timezone: timezone,
    },
    baseURL: Config.NETWORK_CONFIG.API_BASE_URL,
    timeout: Config.NETWORK_CONFIG.TIMEOUT,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });

  return { apiClient, defaultOptions };
}

function returnResponseData<T>(
  defaultOptions: IFetcherOptions,
  response: AxiosResponse<IResponseDTO<T>, IDataError<any>>,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: IDataError<any>) => void
) {
  if (response.data?.success) {
    if (!response.data.data) {
      const dataEmpty: IDataError = {
        errorCode: 'ERROR???',
        errorMessage: 'Data is empty',
      };
      if (defaultOptions.displayError) {
        displayError(dataEmpty);
      }
      reject(dataEmpty);
      return true;
    }
    resolve(response.data.data);
    return true;
  }
  return false;
}

function returnResponseDataWithMetaData<T>(
  defaultOptions: IFetcherOptions,
  response: AxiosResponse<IResponseWithMetadataDTO<T>, IDataError<any>>,
  resolve: (value: IDataWithMeta<T> | PromiseLike<IDataWithMeta<T>>) => void,
  reject: (reason?: IDataError<any>) => void
) {
  if (response.data.success) {
    if (response.data.data === undefined) {
      const dataEmpty: IDataError = {
        errorCode: 'ERROR???',
        errorMessage: 'Data is empty',
      };
      if (defaultOptions.displayError) {
        displayError(dataEmpty);
      }
      reject(dataEmpty);
      return true;
    }
    resolve({
      data: response.data.data,
      metadata: response.data.metadata,
    });
    return true;
  }
  return false;
}

async function processOtherCase<T, E>(
  config: AxiosRequestConfig,
  options: IFetcherOptions,
  defaultOptions: IFetcherOptions,
  response:
    | AxiosResponse<IResponseDTO<T>, IDataError<any>>
    | AxiosResponse<IResponseWithMetadataDTO<T>, IDataError<any>>,
  resolve: (value: E) => void,
  reject: (reason?: IDataError<any>) => void,
  retryFetcher: (
    config: AxiosRequestConfig,
    options: IFetcherOptions
  ) => Promise<E>
) {
  const dataError: IDataError = {
    errorCode: response.data.code || '',
    errorMessage: response.data.message || '',
  };
  if (dataError?.errorCode === '10003') {
    try {
      await handleRefreshToken();
      const retryOptions = { ...options, withToken: true };
      delete retryOptions.token;
      const data = await retryFetcher(config, retryOptions);
      resolve(data);
    } catch {
      handleLogout('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!', true);
      reject(dataError);
    }
    return;
  }
  if (dataError?.errorCode === '10004') {
    handleLogout('Phiên đăng nhập hết hạn Vui lòng đăng nhập lại!', true);
    reject(dataError);
    return;
  }
  if (defaultOptions.displayError) {
    displayError(dataError);
  }
  reject(dataError);
}

async function returnErrorData<T, E>(
  config: AxiosRequestConfig,
  options: IFetcherOptions,
  defaultOptions: IFetcherOptions,
  error: AxiosError<
    IGeneralErrorResponseDTO | IGeneralErrorWithMetadataResponseDTO
  >,
  resolve: (value: E) => void,
  reject: (reason?: IDataError<T>) => void,
  retryFetcher: (
    config: AxiosRequestConfig,
    options: IFetcherOptions
  ) => Promise<E>
) {
  if (axios.isAxiosError(error)) {
    // Axios error
    const somethingsWrong: IDataError<T> = {
      errorCode: error.code || '10009',
      errorMessage: error.message || 'Something is wrong',
    };

    let dataError = somethingsWrong;
    if (error?.response?.data) {
      dataError = {
        errorCode: error?.response?.data.code,
        errorMessage: error?.response?.data.message || '',
      };
    }
    if (dataError?.errorCode === '10003') {
      try {
        await handleRefreshToken();
        const retryOptions = { ...options, withToken: true };
        delete retryOptions.token;
        const data = await retryFetcher(config, retryOptions);
        return resolve(data);
      } catch {
        handleLogout('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!', true);
        return reject(dataError);
      }
    }
    if (dataError?.errorCode === '10006') {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/auth/login') ||
        currentPath.includes('/auth/signup');

      if (!isAuthPage) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        logout();
      }
    } else if (error.response?.data.errors) {
      dataError.errors = error.response.data.errors as T[];
    }

    if (defaultOptions.displayError) {
      displayError(dataError);
    }

    return reject(dataError);
  }

  toast.error('Something is wrong. Please try again');

  return reject({
    errorCode: 'NATIVE_ERROR',
    errorMessage: 'Somethings is wrong',
  });
}

export async function fetcher<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {}
): Promise<T> {
  const { apiClient, defaultOptions } = createApiClient(config, options);

  return new Promise<T>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseDTO<T>>>(config)
      .then(async (response) => {
        const newResponse = {
          ...response,
          data: {
            ...response?.data,
          },
        };
        if (!returnResponseData(defaultOptions, newResponse, resolve, reject)) {
          await processOtherCase(
            config,
            options,
            defaultOptions,
            newResponse,
            resolve,
            reject,
            fetcher
          );
        }
      })
      .catch(
        (
          error: AxiosError<
            IGeneralErrorResponseDTO | IGeneralErrorWithMetadataResponseDTO
          >
        ) => {
          returnErrorData(
            config,
            options,
            defaultOptions,
            error,
            resolve,
            reject,
            fetcher
          );
        }
      );
  });
}

export async function fetcherWithMetadata<T>(
  config: AxiosRequestConfig,
  options: IFetcherOptions = {}
): Promise<IDataWithMeta<T>> {
  const { apiClient, defaultOptions } = createApiClient(config, options);

  return new Promise<IDataWithMeta<T>>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseWithMetadataDTO<T>>>(config)
      .then(async (response) => {
        if (
          !returnResponseDataWithMetaData(
            defaultOptions,
            response,
            resolve,
            reject
          )
        ) {
          await processOtherCase(
            config,
            options,
            defaultOptions,
            response,
            resolve,
            reject,
            fetcherWithMetadata
          );
        }
      })
      .catch(
        (
          error: AxiosError<
            IGeneralErrorResponseDTO | IGeneralErrorWithMetadataResponseDTO
          >
        ) => {
          returnErrorData(
            config,
            options,
            defaultOptions,
            error,
            resolve,
            reject,
            fetcherWithMetadata
          );
        }
      );
  });
}
