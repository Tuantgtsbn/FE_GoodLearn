import { StrictMode, Suspense } from 'react';
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
      main: '#2563eb', // Modern Blue
      light: '#60a5fa',
      dark: '#1e40af',
      // @ts-ignore - custom property for premium backgrounds
      lighter: 'rgba(37, 99, 235, 0.08)',
    },
    secondary: {
      main: '#7c3aed', // Purple
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
    background: {
      default: '#f9fafb',
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
          border: '1px solid #d1d5db',
          '&:hover': {
            borderColor: '#2563eb',
          },
          '&.Mui-focused': {
            borderColor: '#2563eb',
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
  <StrictMode>
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
  </StrictMode>
);
