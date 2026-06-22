import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import type { IRootState } from '@/redux/store';
import { setTheme } from '@/redux/slices/SettingSlice';

export function ThemeSwitch() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: IRootState) => state.setting);
  const isLight = theme === 'light';
  const handleChangeTheme = (theme: string) => {
    dispatch(setTheme(theme as 'light' | 'dark'));
  };

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-borderTheme-secondary bg-bgTheme-primary/80 p-1 shadow-card"
      role="group"
      aria-label="Chuyển đổi giao diện"
    >
      <Button
        type="button"
        onClick={() => handleChangeTheme('light')}
        variant="outline"
        size="icon"
        className={isLight ? 'bg-zinc-200' : ''}
        aria-label="Chế độ sáng"
        aria-pressed={isLight}
      >
        <Sun color="#FFCB5B" className="h-3.5 w-3.5" />
        {isLight ? (
          <span className="absolute -bottom-1 h-0.5 w-2.5 rounded-full bg-themeSwitch-lightThumb" />
        ) : null}
      </Button>

      <Button
        type="button"
        onClick={() => handleChangeTheme('dark')}
        variant="outline"
        size="icon"
        aria-label="Chế độ tối"
        aria-pressed={!isLight}
        className={!isLight ? 'bg-zinc-600!' : ''}
      >
        <Moon className="h-3.5 w-3.5" />
        {!isLight ? (
          <span className="absolute -bottom-1 h-0.5 w-2.5 rounded-full bg-themeSwitch-darkThumb" />
        ) : null}
      </Button>
    </div>
  );
}
