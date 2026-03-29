import CommonInput from '@components/CommonInput';
import ErrorMessage from '@components/ErrorMessage';
import { useFormContext } from 'react-hook-form';

export default function StepOne() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <CommonInput
          label="Email"
          type="email"
          placeholder="Email"
          {...register('email')}
        />
        {errors.email && (
          <ErrorMessage message={(errors.email.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          id="password"
          placeholder="Mật khẩu"
          type="password"
          {...register('password')}
          showPassword={true}
          label="Mật khẩu"
        />
        {errors.password && (
          <ErrorMessage message={(errors.password.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          id="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          type="password"
          {...register('confirmPassword')}
          label="Xác nhận mật khẩu"
          showPassword={true}
        />
        {errors.confirmPassword && (
          <ErrorMessage
            message={(errors.confirmPassword.message as string) || ''}
          />
        )}
      </div>
    </div>
  );
}
