import ICLogo from './Icon/ICLogo';
import ApiAuth from '@/api/ApiAuth';
import { tryCatch } from '@/utils/handleError';
import { logout } from '@/utils/auth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

interface ModalConfirmLogoutProps {
  id: string;
  onClose: (result: unknown) => void;
}

export default function ModalConfirmLogout({
  onClose,
}: ModalConfirmLogoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    const [res, err] = await tryCatch(ApiAuth.logOut());
    setIsLoading(false);
    if (err) {
      toast.error(err.errorMessage || 'Đăng xuất thất bại');
      return;
    }
    if (res) {
      logout();
      onClose(true);
    }
  };
  return (
    <div>
      <main className="w-full max-w-[520px] mt-16">
        <div className="bg-background border-2 border-black rounded-xl overflow-hidden neo-brutalism-shadow transition-all">
          <div className="graph-paper h-64 w-full flex items-center justify-center border-b-2 border-black">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-40 h-40 bg-zinc-50 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center relative">
                  <ICLogo className="w-full h-full" />
                  <div className="absolute -top-2 -right-2 bg-foreground text-background  px-2 py-1 border border-foreground rounded-md text-xs font-bold">
                    Hẹn gặp lại!
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Bạn muốn đăng xuất à?
            </h1>
            <p className="text-zinc-600 text-lg leading-relaxed max-w-[320px] mx-auto">
              Hẹn sớm gặp lại cậu để cùng ôn bài tiếp nhé!
            </p>
          </div>
          <div className="px-8 pb-8 flex flex-col gap-4">
            <button
              onClick={handleLogout}
              className="w-full bg-background text-foreground h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 border-2 border-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Đăng xuất {isLoading && <CircularProgress />}
            </button>
            <button
              onClick={() => onClose(false)}
              className="w-full bg-foreground text-background h-14 rounded-lg font-bold text-lg border-2 border-foreground transition-all neo-brutalism-secondary active:scale-[0.98]"
            >
              Ở lại học tiếp
            </button>
          </div>
          <div className="bg-zinc-50 py-4 border-t border-zinc-100 text-center">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
              GoodLearn • Trợ lý học AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
