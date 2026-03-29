import { Lock, PenLine } from 'lucide-react';

export default function AccountSetting() {
  return (
    <div>
      <section className="mb-12">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            Thông tin cá nhân
          </h3>
          <p className="text-sm text-slate-500">
            Cập nhật thông tin hồ sơ và địa chỉ email của bạn.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-primary dark:border-white overflow-hidden bg-zinc-100">
                <img
                  className="w-full h-full object-cover"
                  data-alt="User profile avatar close up"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGkcyoIOyN1hhqvJGfbwhUdppwz2dApYQpLQIRhqukueVTmck2zuJdSuDQvPBvpfkZx-xA8JYZMUlFVtBUe7INvAo--aqbpxbVvjsAjYGIbioWMRAmJhljU_N1d8DasDnCeKXHTHnLu2vZ4UOCwUF-vMosGKVfiN4AM1PMaYem4QdXzVi3g6M4mqXY8GaqFptgr57YOoqFErmHgBeIYBegnDW6ul7pfEIi0-jBoIdyB1v3KwI9fFbGAauFMQPEpKQCCYkztoF_Rr0"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <PenLine size={16} />
              </button>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Ảnh đại diện</h4>
              <p className="text-xs text-slate-500 mb-3">
                JPG, GIF hoặc PNG. Tối đa 2MB.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold border border-border-muted rounded bg-white hover:bg-zinc-50 transition-colors">
                  Tải lên
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors rounded">
                  Xóa
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tên hiển thị
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium"
                type="text"
                value="Alex Nguyen"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Email (Không thể thay đổi)
              </label>
              <div className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-border-muted dark:border-zinc-800 rounded-lg text-slate-500 italic">
                <Lock size={16} />
                <span>alex.nguyen@example.com</span>
              </div>
            </div>
          </div>
          <button className="w-fit px-6 py-2.5 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-lg custom-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            Lưu thay đổi
          </button>
        </div>
      </section>
      <hr className="border-border-muted dark:border-zinc-800 mb-12" />
      <section className="mb-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            Bảo mật &amp; Mật khẩu
          </h3>
          <p className="text-sm text-slate-500">
            Quản lý mật khẩu và các tùy chọn bảo mật tài khoản.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu hiện tại
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu mới
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>
          <button className="w-fit px-6 py-2.5 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-lg custom-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            Cập nhật mật khẩu
          </button>
        </div>
      </section>
    </div>
  );
}
