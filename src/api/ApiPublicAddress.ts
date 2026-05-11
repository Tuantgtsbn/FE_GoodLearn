import { fetcher } from './Fetcher';

export interface IProvince {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: 'Thành phố Trung ương' | 'Tỉnh';
  decree: string;
}
export interface IProvinceResponse {
  requestId: string;
  provinces: IProvince[];
}

export interface IWard {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: 'Phường' | 'Xã' | 'Thị trấn';
  provinceCode: string;
  provinceName: string;
  decree: string;
}

export interface IWardResponse {
  requestId: string;
  communes: IWard[];
}

const path = {
  publicProvinces: '/addresses/provinces',
  publicWards: '/addresses/wards',
  publicWardsOfProvince: (provinceCode: string) =>
    `/addresses/provinces/${provinceCode}/wards`,
};

const getPublicProvinces = async (): Promise<IProvinceResponse> => {
  return fetcher({
    method: 'GET',
    url: path.publicProvinces,
  });
};

const getPublicWardsOfProvince = async (
  provinceCode: string
): Promise<IWardResponse> => {
  return fetcher({
    method: 'GET',
    url: path.publicWardsOfProvince(provinceCode),
  });
};

const getPublicWards = async (): Promise<IWardResponse> => {
  return fetcher({
    method: 'GET',
    url: path.publicWards,
  });
};

export default {
  getPublicProvinces,
  getPublicWards,
  getPublicWardsOfProvince,
};
