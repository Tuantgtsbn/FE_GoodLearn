import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ShieldCheck, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import ApiAuth from '@api/ApiAuth';
import { Link, useNavigate } from 'react-router-dom';

const STEP = { EMAIL: 0, CODE: 1, RESET: 2 };

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();

  const emailForm = useForm<{ email: string }>({
    defaultValues: { email: '' },
  });
  const codeForm = useForm<{ code: string }>({ defaultValues: { code: '' } });
  const resetForm = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timerId = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [countdown]);

  const passwordStrength = useMemo(() => {
    const pwd = resetForm.watch('password');
    if (!pwd) return { percent: 'w-0', color: 'bg-gray-200', text: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    const map = [
      { percent: 'w-1/5', color: 'bg-red-500', text: 'Rất yếu' },
      { percent: 'w-2/5', color: 'bg-orange-500', text: 'Yếu' },
      { percent: 'w-3/5', color: 'bg-yellow-500', text: 'Trung bình' },
      { percent: 'w-4/5', color: 'bg-blue-500', text: 'Mạnh' },
      { percent: 'w-full', color: 'bg-green-500', text: 'Rất mạnh' },
    ];
    if (score === 0) {
      return { percent: 'w-1/5', color: 'bg-red-500', text: 'Rất yếu' };
    }
    return map[Math.min(score - 1, map.length - 1)];
  }, [resetForm.watch('password')]);

  const handleSendCode = emailForm.handleSubmit(async ({ email }) => {
    setIsSubmitting(true);
    try {
      await ApiAuth.requestForgotPassword(email);
      toast.success('Đã gửi mã xác thực. Vui lòng kiểm tra email.');
      setEmail(email);
      setCountdown(60);
      setStep(STEP.CODE);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể gửi mã');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleVerifyCode = codeForm.handleSubmit(async ({ code }) => {
    if (!email) {
      toast.error('Vui lòng nhập email trước khi xác thực mã');
      return;
    }
    setIsSubmitting(true);
    try {
      await ApiAuth.verifyForgotPassword(code, email);
      toast.success('Xác thực thành công. Hãy đặt mật khẩu mới.');
      setStep(STEP.RESET);
    } catch (error: any) {
      toast.error(error?.message || 'Mã xác thực không đúng');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleResetPassword = resetForm.handleSubmit(
    async ({ password, confirmPassword }) => {
      if (password !== confirmPassword) {
        toast.error('Mật khẩu mới và xác nhận không khớp');
        return;
      }
      setIsSubmitting(true);
      try {
        await ApiAuth.resetPassword({ email, password });
        toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
        resetForm.reset();
        codeForm.reset();
        emailForm.reset();
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 1000);
      } catch (error: any) {
        toast.error(error?.message || 'Đặt lại mật khẩu thất bại');
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  const handleResendCode = async () => {
    if (!email || countdown > 0) return;
    try {
      await ApiAuth.requestForgotPassword(email);
      toast.success('Đã gửi lại mã xác thực.');
      setCountdown(60 * 15);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể gửi lại mã');
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center gap-8 mb-8 space-x-4">
      {[
        { label: 'Nhập email', value: STEP.EMAIL },
        { label: 'Nhập mã', value: STEP.CODE },
        { label: 'Mật khẩu mới', value: STEP.RESET },
      ].map((item, idx) => (
        <div key={item.value} className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold ${
              step === item.value
                ? 'bg-blue-600 text-white border-blue-600'
                : step > item.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-200 text-gray-400'
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`text-sm font-medium ${
              step >= item.value ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="h-[100%] max-w-[750px] p-12 rounded-lg shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(0,0,0,0.1)] space-y-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-600">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h1>
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">
            Thực hiện lần lượt các bước để lấy lại quyền truy cập tài khoản của
            bạn.
          </p>
        </div>

        {renderStepper()}

        {step === STEP.EMAIL && (
          <form onSubmit={handleSendCode} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email đăng nhập
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-md py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...emailForm.register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
              <p className="text-sm text-center text-gray-500 mt-2">
                Chúng tôi sẽ gửi mã gồm 6 ký tự đến email của bạn để xác nhận
                danh tính.
              </p>
            </div>
            <div className="flex justify-center items-center gap-3 w-full">
              <Link
                to="/auth/login"
                className="w-28 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition disabled:opacity-60"
              >
                Huỷ
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting && (
                  <RefreshCw className="animate-spin" size={18} />
                )}
                {isSubmitting ? 'Đang gửi mã...' : 'Gửi mã xác thực'}
              </button>
            </div>
          </form>
        )}

        {step === STEP.CODE && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4">
              Chúng tôi đã gửi mã đến <strong>{email}</strong>. Nếu bạn nhập sai
              email,
              <button
                type="button"
                className="text-blue-600 font-semibold ml-1 hover:underline"
                onClick={() => setStep(STEP.EMAIL)}
              >
                bấm nhập lại.
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã xác thực (6 ký tự)
              </label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 tracking-[0.5em] text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...codeForm.register('code', {
                  required: 'Vui lòng nhập mã',
                  minLength: { value: 6, message: 'Mã gồm 6 ký tự' },
                })}
              />
              {codeForm.formState.errors.code && (
                <p className="text-sm text-red-500 mt-1">
                  {codeForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Còn lại:{' '}
                <strong>
                  {countdown > 0
                    ? `00:${countdown.toString().padStart(2, '0')}`
                    : '00:00'}
                </strong>
              </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0}
                className="font-semibold text-blue-600 disabled:text-gray-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={16} />
                Gửi lại mã
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực mã'}
            </button>
          </form>
        )}

        {step === STEP.RESET && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...resetForm.register('password', {
                    required: 'Vui lòng nhập mật khẩu mới',
                    minLength: { value: 8, message: 'Ít nhất 8 ký tự' },
                  })}
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {resetForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {resetForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...resetForm.register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                  })}
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all ${passwordStrength.color} ${passwordStrength.percent}`}
                ></div>
              </div>
              {passwordStrength.text && (
                <p className="text-sm text-gray-600">
                  Độ mạnh: {passwordStrength.text}
                </p>
              )}
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Ít nhất 8 ký tự</li>
                <li>Chứa chữ hoa, chữ thường, số và ký tự đặc biệt</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Đang lưu...' : 'Hoàn tất đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
