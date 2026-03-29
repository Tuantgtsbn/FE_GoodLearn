import clsx from 'clsx';
import { useState } from 'react';
import AccountSetting from './components/tabs/AccountSetting';
import ThemeSetting from './components/tabs/ThemeSetting';
import { Palette, Settings, UserPen, X } from 'lucide-react';

interface IUserSettingProps {
  onClose?: () => void;
}
export default function UserSetting({ onClose }: IUserSettingProps) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="relative w-full max-w-[800px] bg-white dark:bg-zinc-950 border border-border-muted dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
      <aside className="w-full md:w-64 border-r border-border-muted dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Settings size={20} className="text-primary dark:text-white" />
          <h2 className="font-bold text-lg tracking-tight">Cài đặt</h2>
        </div>
        <nav className="flex flex-col gap-1">
          <div
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg  dark:bg-zinc-800 text-primary dark:text-white',
              {
                'font-semibold bg-zinc-100 dark:bg-zinc-700': activeTab === 1,
              }
            )}
            onClick={() => setActiveTab(1)}
          >
            <UserPen />
            Tài khoản
          </div>
          <div
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg  dark:bg-zinc-800 text-primary dark:text-white',
              {
                'font-semibold bg-zinc-100 dark:bg-zinc-700': activeTab === 2,
              }
            )}
            onClick={() => setActiveTab(2)}
          >
            <Palette />
            Giao diện
          </div>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col relative grid-bg">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[600px]">
          <div
            className={clsx({
              hidden: activeTab !== 1,
            })}
          >
            <AccountSetting />
          </div>
          <div
            className={clsx({
              hidden: activeTab !== 2,
            })}
          >
            <ThemeSetting />
          </div>
        </div>
      </main>
    </div>
  );
}
