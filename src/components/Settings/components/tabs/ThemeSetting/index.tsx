import ICEngland from '@/components/Icon/ICEngland';
import ICVietNam from '@/components/Icon/ICVietNam';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setLanguage, setTheme } from '@/redux/slices/SettingSlice';
import type { IRootState } from '@/redux/store';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

export default function ThemeSetting() {
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state: IRootState) => state.setting);
  const handleChangeTheme = (theme: string) => {
    dispatch(setTheme(theme as 'light' | 'dark'));
  };
  const handleChangeLanguage = (language: string) => {
    dispatch(setLanguage(language as 'vi' | 'en'));
  };

  return (
    <div>
      <section className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
          Chủ đề (Theme)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer group relative">
            <input
              className="hidden peer"
              name="theme"
              type="radio"
              checked={theme === 'light'}
              onChange={() => handleChangeTheme('light')}
            />
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 bg-white transition-all peer-checked:border-black peer-checked:border-[3px] peer-checked:neo-shadow">
              <Sun size={32} className="mb-2" />
              <span className="font-bold text-sm text-center">
                Giấy trắng (Sáng)
              </span>
            </div>
          </label>
          <label className="cursor-pointer group relative">
            <input
              className="hidden peer"
              name="theme"
              type="radio"
              checked={theme === 'dark'}
              onChange={() => handleChangeTheme('dark')}
            />
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 bg-white transition-all peer-checked:border-black peer-checked:border-[3px] peer-checked:neo-shadow">
              <Moon size={32} className="mb-2" />
              <span className="font-bold text-sm text-center text-slate-500 peer-checked:text-black">
                Bảng đen (Tối)
              </span>
            </div>
          </label>
        </div>
      </section>
      <section className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
          Ngôn ngữ hiển thị
        </h3>
        <div className="relative">
          <Select value={language} onValueChange={handleChangeLanguage}>
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Lựa chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-full">
              <SelectGroup>
                <SelectItem value="vi">
                  <ICVietNam className="inline mr-2" />
                  Tiếng Việt
                </SelectItem>
                <SelectItem value="en">
                  <ICEngland className="inline mr-2" />
                  English
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
