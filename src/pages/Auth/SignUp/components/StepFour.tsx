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
    <div className="w-full max-w-md mx-auto bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 backdrop-blur-md">
      <ShieldCheck size={40} className="text-blue-500 mb-2" />
      <h1 className="font-semibold text-center">Xác thực OTP</h1>
      <h2 color="text.secondary" className="text-center">
        Vui lòng nhập mã OTP đã gửi về số điện thoại của bạn để hoàn tất đăng
        ký.
      </h2>
      {!isSendOTPSuccess && (
        <ErrorMessage message="Gửi OTP thất bại. Vui lòng nhấn nút thử lại." />
      )}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-2 w-full items-center">
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
            className="flex-1 px-4 py-2 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-500">{timeLeft} s</p>
        </div>
        <button
          type="button"
          disabled={isVerifying || otp.length !== 6}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isVerifying || otp.length !== 6
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleSubmit}
        >
          {isVerifying ? 'Đang xác thực...' : 'Xác nhận'}
        </button>
      </div>
      <div className="text-center mt-4">
        <p>
          Không nhận được mã OTP?{' '}
          <span
            className="text-blue-500 font-bold text-xl underline cursor-pointer hover:text-blue-600"
            onClick={handleResendOTP}
          >
            Gửi lại
          </span>
        </p>
      </div>
    </div>
  );
}
