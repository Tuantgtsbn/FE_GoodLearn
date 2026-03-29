import { type IUser, type ILoginResponse } from 'src/types';
import { fetcher } from './Fetcher';
import { type LoginDataDto } from 'src/dto/auth.dto';

const path = {
  registerEmailPassword: '/auth/patient/register/byEmail',
  loginEmailPassword: '/auth/login/byEmail',
  requestForgotPassword: '/auth/forgot-password/request',
  verifyForgotPassword: '/auth/forgot-password/verify',
  resetPassword: '/auth/forgot-password/reset',
  getMe: '/auth/me',
  verifyOTP: '/auth/verify-registration-otp',
  requestResendOTP: '/auth/resend-registration-otp',
  logout: '/auth/logout',
  googleLogin: '/auth/google/url',
  googleCallback: '/auth/google/callback',
};

type RegisterByEmailPasswordDto = {
  email: string;
  username: string;
  password: string;
  fullName: string;
  birthday: string;
  gender: string;
  phone: string;
  address: {
    detail: string;
    ward: string;
    city: string;
    country: string;
  };
  bio?: string;
  gradeLevel?: number;
};

export interface IDataResponseByEmailPassword {
  data: IUser;
  otpResult: {
    success: boolean;
    message: string;
    time: number;
  };
}

const registerByEmailPassword = (data: RegisterByEmailPasswordDto) => {
  return fetcher<IDataResponseByEmailPassword>(
    {
      url: path.registerEmailPassword,
      method: 'POST',
      data,
    },
    {
      displayError: false,
    }
  );
};

const loginByEmailPassword = (data: LoginDataDto): Promise<ILoginResponse> => {
  return fetcher<ILoginResponse>(
    {
      url: path.loginEmailPassword,
      method: 'POST',
      data,
    },
    {
      displayError: false,
    }
  );
};

const getMe = () => {
  return fetcher<IUser>(
    {
      url: path.getMe,
      method: 'GET',
    },
    {
      displayError: false,
      withToken: true,
    }
  );
};

const verifyOTP = (otp: string, email: string) => {
  return fetcher<IUser>(
    {
      url: path.verifyOTP,
      method: 'POST',
      data: { otp, email },
    },
    {
      displayError: false,
    }
  );
};

const requestResendOTP = (email: string) => {
  return fetcher<{ message: string; time: number; success: boolean }>(
    {
      url: path.requestResendOTP,
      method: 'POST',
      data: { email },
    },
    {
      displayError: false,
    }
  );
};

const logOut = () => {
  return fetcher<object>(
    {
      url: '/auth/logout',
      method: 'POST',
    },
    {
      displayError: false,
    }
  );
};

const getGoogleLoginUrl = () => {
  return fetcher<{ url: string }>(
    {
      url: '/auth/google/url',
      method: 'GET',
    },
    {
      displayError: true,
    }
  );
};

const loginByGoogle = (code: string) => {
  return fetcher<ILoginResponse>(
    {
      url: '/auth/google/callback',
      method: 'POST',
      data: { code },
    },
    {
      displayError: false,
    }
  );
};

const requestForgotPassword = (email: string) => {
  return fetcher<{ message: string }>({
    url: path.requestForgotPassword,
    method: 'POST',
    data: { email },
  });
};

const verifyForgotPassword = (otp: string, email: string) => {
  return fetcher<{ message: string }>({
    url: path.verifyForgotPassword,
    method: 'POST',
    data: { otp, email },
  });
};

const resetPassword = (payload: { email: string; password: string }) => {
  return fetcher<{ message: string }>({
    url: path.resetPassword,
    method: 'POST',
    data: payload,
  });
};

export default {
  registerByEmailPassword,
  loginByEmailPassword,
  getMe,
  verifyOTP,
  requestResendOTP,
  logOut,
  getGoogleLoginUrl,
  loginByGoogle,
  requestForgotPassword,
  verifyForgotPassword,
  resetPassword,
};
