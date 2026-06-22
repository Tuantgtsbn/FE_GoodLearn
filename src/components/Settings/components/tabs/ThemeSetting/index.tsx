import ICEngland from '@/components/Icon/ICEngland';
import ICVietNam from '@/components/Icon/ICVietNam';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setLanguage } from '@/redux/slices/SettingSlice';
import type { IRootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

export default function ThemeSetting() {
  const dispatch = useDispatch();
  const { language } = useSelector((state: IRootState) => state.setting);

  const handleChangeLanguage = (language: string) => {
    dispatch(setLanguage(language as 'vi' | 'en'));
  };

  return (
    <div>
      <section className="mb-10">
        <h3 className="text-xl font-bold text-primary mb-2">Giao diện</h3>
        <ThemeSwitch />
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
