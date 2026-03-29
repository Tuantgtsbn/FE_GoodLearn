import axios from 'axios';

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

const getPublicProvinces = async () => {
  return axios
    .get<IProvinceResponse>(
      'https://production.cas.so/address-kit/latest/provinces'
    )
    .then((res) => res.data);
};

const getPublicWardsOfProvince = async (provinceCode: string) => {
  return axios
    .get<IWardResponse>(
      `https://production.cas.so/address-kit/latest/provinces/${provinceCode}/communes`
    )
    .then((res) => res.data);
};

const getPublicWards = async () => {
  return axios
    .get<IWardResponse>('https://production.cas.so/address-kit/latest/communes')
    .then((res) => res.data);
};

export default {
  getPublicProvinces,
  getPublicWards,
  getPublicWardsOfProvince,
};
