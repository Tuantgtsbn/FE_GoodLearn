import { useSelector } from 'react-redux';
import type { IRootState } from './redux/store';
import { useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const buildTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#111111',
        light: '#2b2b2b',
        dark: '#000000',
        // @ts-expect-error - custom property for subtle selected backgrounds
        lighter: 'rgba(17, 17, 17, 0.08)',
      },
      secondary: {
        main: '#525252',
        light: '#737373',
        dark: '#262626',
      },
      text:
        mode === 'dark'
          ? {
              primary: '#000',
              secondary: '#fff',
            }
          : {
              primary: '#fff',
              secondary: '#000',
            },
      background:
        mode === 'dark'
          ? {
              default: '#0f0f0f',
              paper: '#171717',
            }
          : {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
    },
    typography: {
      fontFamily: '"Google Sans", ui-sans-serif, sans-serif, system-ui',
    },
    components: {
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            border: '1px solid #d4d4d4',
            '&:hover': {
              borderColor: '#111111',
            },
            '&.Mui-focused': {
              borderColor: '#111111',
            },
          },
          input: {
            padding: '10px',
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: '#fff',
          },
        },
      },
    },
  });

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const selectedTheme = useSelector((state: IRootState) => state.setting.theme);
  const mode = selectedTheme === 'dark' ? 'dark' : 'light';

  const theme = useMemo(() => buildTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default AppThemeProvider;
