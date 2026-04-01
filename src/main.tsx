import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './components/LoadingScreen/index.tsx';
import store, { persistor } from './redux/store.ts';
import { queryClient } from './config/queryClient.ts';
import App from './App.tsx';
import ErrorBoundary from './components/ui/ErrorBoudary.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import '@fontsource/google-sans'; // Defaults to weight 400
import '@fontsource/google-sans/400.css'; // Specify weight
import '@fontsource/google-sans/400-italic.css'; // Specify weight and style

const theme = createTheme({
  palette: {
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
    text: {
      primary: '#111111',
      secondary: '#525252',
    },
    background: {
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
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <Suspense fallback={<LoadingScreen />}>
              <App />
            </Suspense>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        draggable
        pauseOnFocusLoss
        autoClose={3000}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </ErrorBoundary>
  </ThemeProvider>
);
