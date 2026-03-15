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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>
);
