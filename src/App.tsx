import { Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './styles/main.css';
import './styles/index.scss';

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
