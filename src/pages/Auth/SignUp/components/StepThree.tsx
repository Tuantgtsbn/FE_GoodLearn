import ApiPublicAddress from '@api/ApiPublicAddress';
import CommonInput from '@components/CommonInput';
import ErrorMessage from '@components/ErrorMessage';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { addressRegisterDto } from '@dto/auth.dto';
import z from 'zod';
import CommonSelect from '@/components/CommonSelect';

type addressRegisterDataDto = z.infer<typeof addressRegisterDto>;
export default function StepThree() {
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<addressRegisterDataDto>();
  const [provinceCode, setProvinceCode] = useState<string>(
    getValues('address.city.code')
  );

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => ApiPublicAddress.getPublicProvinces(),
    staleTime: Infinity,
  });

  const { data: wards } = useQuery({
    queryKey: ['wards', provinceCode],
    queryFn: () => ApiPublicAddress.getPublicWardsOfProvince(provinceCode),
    enabled: !!provinceCode,
    staleTime: Infinity,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          id="city"
        >
          Chọn tỉnh
        </label>
        <Controller
          control={control}
          name="address.city"
          render={({ field }) => (
            <>
              <CommonSelect
                value={field.value.name || ''}
                id="city"
                values={
                  provinces?.provinces?.map((item) => ({
                    name: item.name,
                    id: item.name,
                  })) || []
                }
                onChange={(selected) => {
                  const selectedProvince = provinces?.provinces?.find(
                    (item) => item.name === selected
                  );
                  setProvinceCode(selectedProvince?.code || '');
                  setValue('address.ward', {
                    name: '',
                    code: '',
                  });
                  field.onChange({
                    name: selected,
                    code: selectedProvince?.code || '',
                  });
                }}
                placeholder="Chọn tỉnh"
              />
              {errors.address?.city && (
                <ErrorMessage
                  message={(errors.address?.city.name?.message as string) || ''}
                />
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          id="ward"
        >
          Chọn xã, phường
        </label>
        <Controller
          control={control}
          name="address.ward"
          render={({ field }) => (
            <>
              <CommonSelect
                value={field.value.name || ''}
                id="ward"
                values={
                  wards?.communes?.map((item) => ({
                    name: item.name,
                    id: item.name,
                  })) || []
                }
                onChange={(selected) => {
                  const selectedWard = wards?.communes?.find(
                    (item) => item.name === selected
                  );
                  field.onChange({
                    name: selected,
                    code: selectedWard?.code || '',
                  });
                }}
                placeholder="Chọn xã, phường"
              />
              {errors.address?.ward && (
                <ErrorMessage
                  message={(errors.address?.ward.name?.message as string) || ''}
                />
              )}
            </>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          {...register('address.detail')}
          id="detail"
          placeholder="Chọn xã, phường"
          label="Địa chỉ chi tiết"
        />
        {errors.address?.detail && (
          <ErrorMessage
            message={(errors.address?.detail.message as string) || ''}
          />
        )}
      </div>
    </div>
  );
}
