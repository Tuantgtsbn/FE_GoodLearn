import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiAuth, { type IDataResponseByEmailPassword } from '@api/ApiAuth';
import ErrorMessage from '@components/ErrorMessage';
import { tryCatch } from '@utils/handleError';
import { useNavigate } from 'react-router-dom';

interface IStepFourProps {
  data: IDataResponseByEmailPassword;
}
export default function StepFour({ data }: IStepFourProps) {
  const navigate = useNavigate();
  const email = data?.data?.email;
  const initialOtpTime = data?.otpResult?.time ?? 0;
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendOTPSuccess, setIsSendOTPSuccess] = useState(
    data.otpResult.success
  );
  const [timeLeft, setTimeLeft] = useState(initialOtpTime);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Không tìm thấy email đăng ký. Vui lòng thử lại.');
      navigate('/auth/register');
      return;
    }

    const [res, err] = await tryCatch(ApiAuth.requestResendOTP(email));

    if (err) {
      toast.error(err.errorMessage || 'Gửi lại OTP thất bại');
      setIsSendOTPSuccess(false);
      return;
    }

    if (res) {
      toast.success('Đã gửi lại mã OTP');
      setIsSendOTPSuccess(true);
      setTimeLeft(res.time);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (initialOtpTime <= 0) {
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [initialOtpTime]);

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Không tìm thấy email đăng ký. Vui lòng thử lại.');
      navigate('/auth/register');
      return;
    }

    if (otp.length !== 6) {
      toast.warn('Mã OTP phải có 6 chữ số');
      return;
    }
    setIsVerifying(true);
    const [res, err] = await tryCatch(ApiAuth.verifyOTP(otp, email));
    setIsVerifying(false);
    if (err) {
      toast.error(err.errorMessage || 'Mã OTP không hợp lệ');
      return;
    }
    if (res) {
      toast.success('Xác thực OTP thành công!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-background/80 p-8 shadow-lg backdrop-blur-md">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <ShieldCheck size={40} className="text-primary" />
      </div>
      <h1 className="text-center font-semibold">Xác thực OTP</h1>
      <h2 className="text-center text-muted-foreground">
        Vui lòng nhập mã OTP đã gửi về số điện thoại của bạn để hoàn tất đăng
        ký.
      </h2>
      {!isSendOTPSuccess && (
        <ErrorMessage message="Gửi OTP thất bại. Vui lòng nhấn nút thử lại." />
      )}
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full items-center gap-2">
          <label htmlFor="otp" className="text-lg font-medium">
            Mã OTP
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex-1 rounded-lg border bg-background px-4 py-2 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-destructive">{timeLeft} s</p>
        </div>
        <button
          type="button"
          disabled={isVerifying || otp.length !== 6}
          className={`w-full rounded-lg py-3 font-semibold text-primary-foreground ${
            isVerifying || otp.length !== 6
              ? 'cursor-not-allowed bg-muted'
              : 'bg-primary hover:opacity-90'
          }`}
          onClick={handleSubmit}
        >
          {isVerifying ? 'Đang xác thực...' : 'Xác nhận'}
        </button>
      </div>
      <div className="mt-4 text-center">
        <p>
          Không nhận được mã OTP?{' '}
          <span
            className="cursor-pointer text-xl font-bold text-primary underline hover:opacity-80"
            onClick={handleResendOTP}
          >
            Gửi lại
          </span>
        </p>
      </div>
    </div>
  );
}
