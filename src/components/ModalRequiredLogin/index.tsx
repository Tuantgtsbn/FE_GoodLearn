import { CircularProgress } from '@mui/material';
import { Bot, LogIn, PencilLine, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type ModalRequiredLoginResult = 'login' | 'later';

interface IModalRequiredLoginProps {
  onClose?: (result?: ModalRequiredLoginResult) => void;
}

export default function ModalRequiredLogin({
  onClose,
}: IModalRequiredLoginProps) {
  const navigate = useNavigate();
  const [fakeLoading, setFakeLoading] = useState(false);

  const handleLoginNow = () => {
    setFakeLoading(true);
    setTimeout(() => {
      onClose?.('login');
      navigate('/auth/login');
      setFakeLoading(false);
    }, 1000);
  };

  return (
    <div className="w-[90%] md:w-112.5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_56px_rgba(0,0,0,0.24)]">
      <div className="px-7 pt-8 pb-7 text-center">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50">
          <Bot size={30} className="text-zinc-900" strokeWidth={2.2} />
          <Sparkles
            size={13}
            className="absolute -right-2 -top-1.5 text-zinc-400"
            strokeWidth={2.2}
          />
          <PencilLine
            size={14}
            className="absolute -bottom-1.5 -left-3 rotate-12 text-zinc-300"
            strokeWidth={2.2}
          />
        </div>

        <h2 className="text-[24px] font-bold leading-tight text-zinc-900">
          Cậu cần đăng nhập để tiếp tục
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Đăng nhập để lưu lại lịch sử học tập và mở khóa các tính năng tuyệt
          vời khác nhé!
        </p>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={handleLoginNow}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
          >
            <span>Đăng nhập ngay</span>
            <LogIn size={16} />
            {fakeLoading && <CircularProgress size={20} />}
          </button>

          <button
            type="button"
            onClick={() => onClose?.('later')}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            Để sau
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-zinc-100 bg-zinc-50/70 px-4 py-3 text-[11px] text-zinc-400">
        <ShieldCheck size={13} />
        <span>Dữ liệu của bạn luôn được bảo mật tuyệt đối</span>
      </div>
    </div>
  );
}
