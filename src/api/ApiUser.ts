import type { IUser, IUserQuota } from '@/types';
import { fetcher } from './Fetcher';

const path = {
  updateProfile: '/users/me',
};

const updateProfile = (data: Partial<IUser> & { avatar?: File }) => {
  return fetcher<IUser>(
    {
      url: path.updateProfile,
      method: 'PATCH',
      data,
    },
    {
      isFormData: true,
    }
  );
};

type GetUserQuotaResponse = {
  userId: string;
  email: string;
  quota: IUserQuota;
};

const getUserQuota = () => {
  return fetcher<GetUserQuotaResponse>({
    url: `${path.updateProfile}/quota`,
    method: 'GET',
  });
};

export default {
  updateProfile,
  getUserQuota,
};
