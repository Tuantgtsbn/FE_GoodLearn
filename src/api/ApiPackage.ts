import type { IPackage } from '@/types';
import { fetcher } from './Fetcher';

const path = {
  list: '/packages',
  detail: (packageId: string) => `/packages/${packageId}`,
};

const getPackageList = () => {
  return fetcher<IPackage[]>(
    {
      url: path.list,
      method: 'GET',
    },
    {
      withToken: false,
      displayError: false,
    }
  );
};

const getPackageDetail = (packageId: string) => {
  return fetcher<IPackage>(
    {
      url: path.detail(packageId),
      method: 'GET',
    },
    {
      withToken: false,
      displayError: false,
    }
  );
};

export default {
  getPackageList,
  getPackageDetail,
};
