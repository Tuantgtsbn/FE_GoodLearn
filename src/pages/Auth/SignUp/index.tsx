import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { RegisterUserDto } from '@dto/auth.dto';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import clsx from 'clsx';
import StepFour from './components/StepFour';
import { useMutation } from '@tanstack/react-query';
import ApiAuth, { type IDataResponseByEmailPassword } from '@api/ApiAuth';
import { toast } from 'react-toastify';
import { isDataError } from '@utils/narrowType';
import { safeSetFieldError } from '@utils/setErrorHookForm';
import { CircularProgress } from '@mui/material';
import { Button } from '@/components/ui/button';
import ICLogo from '@/components/Icon/ICLogo';

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const formSteps = 3;
  const [resultSignUp, setResultSignUp] =
    useState<IDataResponseByEmailPassword | null>(null);
  const methods = useForm({
    resolver: zodResolver(RegisterUserDto),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      address: {
        detail: '',
        ward: {
          name: '',
          code: '',
        },
        city: {
          name: '',
          code: '',
        },
        country: 'Việt Nam',
      },
      dateOfBirth: undefined,
      gender: 'male',
      phone: undefined,
      bio: undefined,
      gradeLevel: undefined,
    },
    mode: 'onBlur',
  });

  const { trigger, getValues, setError } = methods;

  const registerMutation = useMutation({
    mutationFn: (data: any) => {
      const { address, ...rest } = data;
      return ApiAuth.registerByEmailPassword({
        ...rest,
        address: {
          city: address.city.name,
          ward: address.ward.name,
          detail: address.detail,
          country: address.country,
        },
      });
    },
    onSuccess: (data) => {
      toast.success('Đăng ký thành công! Vui lòng nhập mã OTP.');
      setResultSignUp(data);
      setStep(4);
    },
    onError: (error: any) => {
      if (isDataError(error)) {
        if (error.errors) {
          error.errors.forEach((err: any) => {
            safeSetFieldError(setError, err.field, err.message);
          });
        }
        // toast.error(error.errorMessage || 'Đăng ký thất bại');
      } else {
        toast.error('Đã xảy ra lỗi khi đăng ký');
      }
    },
  });

  const handleNextStep = async () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = await trigger(['email', 'password', 'confirmPassword']);
        break;
      case 2:
        isValid = await trigger([
          'name.firstName',
          'name.lastName',
          'birthday',
          'gender',
          'phone',
        ] as any);
        break;
      case 3:
        isValid = await trigger([
          'address.detail',
          'address.ward',
          'address.city',
        ] as any);
        if (isValid) {
          const formData = getValues();
          registerMutation.mutate(formData);
          return;
        }
        break;
    }
    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4 rotate-3">
          <ICLogo width={80} height={80} />
        </div>
        <h1 className="text-zinc-900 text-2xl font-extrabold tracking-tight uppercase italic">
          GoodLearn
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Ứng dụng học tập thông minh của riêng bạn
        </p>
      </div>
      <FormProvider {...methods}>
        <div className="md:w-full max-w-[600px] p-8 rounded-lg shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(0,0,0,0.1)] space-y-4">
          <p className="text-[24px] font-bold text-center">Đăng ký tài khoản</p>
          <div className="flex justify-between">
            {Array.from({ length: formSteps }).map((_, index) => (
              <div
                key={index}
                className={clsx('h-[3px] w-[30%]', {
                  'bg-green-500': index + 1 < step,
                  'bg-gray-300': index + 1 >= step,
                })}
              ></div>
            ))}
          </div>
          <form>
            {step === 1 && <StepOne />}
            {step === 2 && <StepTwo />}
            {step === 3 && <StepThree />}
            {step === 4 && resultSignUp && <StepFour data={resultSignUp} />}
            <div className="mt-4 flex justify-between">
              {step > 1 && step < totalSteps && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-500 text-white px-3 py-1 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Quay lại</span>
                </Button>
              )}
              {step <= formSteps && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={registerMutation.isPending && step === formSteps}
                  className="bg-blue-500 text-white px-3 py-1 hover:bg-blue-700 ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {registerMutation.isPending && step === formSteps ? (
                    <>
                      <CircularProgress size={16} />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>{step === formSteps ? 'Hoàn tất' : 'Tiếp tục'}</span>
                  )}
                </Button>
              )}
            </div>
          </form>
          <div>
            <h3
              className="text-[#2563eb] font-[500] hover:underline hover:cursor-pointer max-w-fit mx-auto"
              onClick={() => navigate('/auth/login')}
            >
              Bạn đã có tài khoản?
            </h3>
          </div>
        </div>
      </FormProvider>
    </>
  );
}
