import CommonInput from '@components/CommonInput';
import CommonSelect from '@components/CommonSelect';
import DatePickerComponent from '@components/DatePicker';
import ErrorMessage from '@components/ErrorMessage';
import { type RegisterUserDataDto } from '@dto/auth.dto';
import { Controller, useFormContext } from 'react-hook-form';

export default function StepTwo() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<RegisterUserDataDto>();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Họ và tên"
          label="Họ và tên"
          {...register('fullName')}
        />
        {errors.fullName && (
          <ErrorMessage message={(errors.fullName.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Tên hiển thị"
          label="Tên hiển thị"
          {...register('username')}
        />
        {errors.username && (
          <ErrorMessage message={(errors.username.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Số điện thoại"
          label="Số điện thoại"
          {...register('phone')}
        />
        {errors.phone && (
          <ErrorMessage message={(errors.phone.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2 font-medium">
        <label className="block font-medium text-gray-700 mb-1">
          Chọn ngày sinh
        </label>

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePickerComponent
              value={field.value}
              onChange={(data) => field.onChange(data?.toISOString())}
              config={{
                maxDate: new Date().toISOString(),
              }}
            />
          )}
        />

        {errors.dateOfBirth && (
          <ErrorMessage
            message={(errors.dateOfBirth.message as string) || ''}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="block font-medium text-gray-700 mb-1">
          Giới tính
        </label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => {
            return (
              <CommonSelect
                value={field.value}
                id="gender"
                values={[
                  { name: 'Nam', id: 'MALE' },
                  { name: 'Nữ', id: 'FEMALE' },
                  { name: 'Khác', id: 'OTHER' },
                ]}
                onChange={field.onChange}
                placeholder="Chọn giới tính"
                selectProps={{
                  sx: {
                    width: '100%',
                  },
                }}
              />
            );
          }}
        />
        {errors.gender && (
          <ErrorMessage message={(errors.gender.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="block font-medium text-gray-700 mb-1">
          Tiểu sử cá nhân (tùy chọn)
        </label>
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Tiểu sử cá nhân"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none h-24 p-2"
            {...register('bio')}
          />
          {errors.bio && (
            <ErrorMessage message={(errors.bio.message as string) || ''} />
          )}
        </div>
        {errors.gender && (
          <ErrorMessage message={(errors.gender.message as string) || ''} />
        )}
      </div>
    </div>
  );
}
