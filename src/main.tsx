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
import '@fontsource/google-sans'; // Defaults to weight 400
import '@fontsource/google-sans/400.css'; // Specify weight
import '@fontsource/google-sans/400-italic.css'; // Specify weight and style
import AppThemeProvider from './AppThemeProvider';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <Suspense fallback={<LoadingScreen />}>
              <App />
            </Suspense>
          </PersistGate>
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
    </AppThemeProvider>
  </Provider>
);
