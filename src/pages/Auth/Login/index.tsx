import CommonInput from '@/components/CommonInput';
import ErrorMessage from '@/components/ErrorMessage';
import ICGoogle from '@/components/Icon/ICGoogle';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/Divider';
import { LockIcon, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginDto, type LoginDataDto } from '@/dto/auth.dto';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/redux/slices/AuthSlice';
import ApiAuth from '@/api/ApiAuth';
import { toast } from 'react-toastify';
import { ERole } from '@/types';
import type { IDataError, ValidationErrorDetail } from '@/api/Fetcher';
import ICLogo from '@/components/Icon/ICLogo';
import { CircularProgress } from '@mui/material';
import ModelGetUrl from './components/ModalGetUrl';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationErrs, setValidationErrs] = useState<Record<string, string>>(
    {}
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataDto>({
    resolver: zodResolver(LoginDto),
  });
  const isAfterPostMessage = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, data, error } = event.data;

      if (type === 'GOOGLE_LOGIN_SUCCESS' || type === 'GOOGLE_LOGIN_ERROR') {
        isAfterPostMessage.current = true;
        setIsLoading(false);
      }

      if (type === 'GOOGLE_LOGIN_SUCCESS') {
        dispatch(loginUser(data));
        toast.success('Đăng nhập thành công!');
        const role = data.user.role?.name;
        setTimeout(() => {
          switch (role) {
            case ERole.USER:
              navigate('/', { replace: true });
              break;
            case ERole.ADMIN:
              navigate('/admin', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
        }, 500);
      } else if (type === 'GOOGLE_LOGIN_ERROR') {
        toast.error(error?.message || 'Đăng nhập Google thất bại!');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: ApiAuth.loginByEmailPassword,
    onMutate: () => {
      setValidationErrs({});
    },
    onSuccess: async (data) => {
      dispatch(loginUser(data));
      toast.success('Đăng nhập thành công!');
      const role = data.user.role;

      setTimeout(() => {
        switch (role) {
          case ERole.USER:
            navigate('/', { replace: true });
            break;
          case ERole.ADMIN:
            navigate('/admin', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }, 100);
    },
    onError: (error: IDataError<ValidationErrorDetail>) => {
      if (error.errors && error.errors.length > 0) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setValidationErrs(errorMap);
      } else {
        toast.error(error.errorMessage || 'Đăng nhập thất bại');
      }
    },
  });

  const onSubmit = (data: LoginDataDto) => {
    mutate(data);
  };

  const handleLoginGoogle = (url: string) => {
    setIsLoading(true);
    isAfterPostMessage.current = false;

    const windowWidth = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;

    const windowHeight = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    const popupWidth = Math.min(1200, windowWidth - 20);
    const popupHeight = Math.min(800, windowHeight - 20);

    const left = Math.round((windowWidth - popupWidth) / 2);
    const top = Math.round((windowHeight - popupHeight) / 2);

    const popup = window.open(
      url,
      '_blank',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (!popup || typeof popup.closed === 'undefined') {
      toast.error('Popup bị chặn! Vui lòng cho phép popup trong trình duyệt.');
      setIsLoading(false);
      return;
    }

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        if (!isAfterPostMessage.current) {
          setIsLoading(false);
          toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
        }
        clearInterval(checkPopup);
      }
    }, 500);
  };

  return (
    <div>
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
      <div className="flex flex-col gap-2">
        <CommonInput
          icon={Mail}
          label="Email"
          type="email"
          placeholder="Nhập email"
          {...register('email')}
          error={!!errors.email}
        />

        <ErrorMessage
          message={errors.email?.message || validationErrs['email']}
        />
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          icon={LockIcon}
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          showPassword
          {...register('password')}
          error={!!errors.password}
        />

        <ErrorMessage
          message={errors.password?.message || validationErrs['password']}
        />
      </div>
      <div className="flex items-center justify-end mt-2">
        <Link to="/auth/forgot-password">
          <p className="text-[#2563eb] font-[500]">Quên mật khẩu?</p>
        </Link>
      </div>
      <Button
        className="w-full cursor-pointer text-2xl font-bold h-[50px] mt-4"
        onClick={handleSubmit(onSubmit)}
        loading={isPending ?? null}
      >
        Đăng nhập
      </Button>
      <Divider>
        <p className="text-[16px]">Hoặc</p>
      </Divider>
      <div className="flex flex-col gap-4">
        <Button
          className="cursor-pointer h-[40px]"
          onClick={() => setOpen(true)}
        >
          <span className="flex">
            <ICGoogle />
            <span className="ml-2">Đăng nhập với Google</span>
            {isLoading && <CircularProgress size={20} className="ml-2" />}
          </span>
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
      <ModelGetUrl
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLoginGoogle}
      />
    </div>
  );
}
