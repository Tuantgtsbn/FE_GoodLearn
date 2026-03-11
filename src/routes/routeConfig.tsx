import HomeLandingPage from '../pages/LandingPage/Home';
import FeatureLandingPage from '../pages/LandingPage/Feature';
import PriceLandingPage from '../pages/LandingPage/Price';
import LandingPageLayout from '../components/layouts/LandingPage';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/components/layouts/MainLayout';
import AuthPage from '../pages/Auth';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <LandingPageLayout />,
        children: [
          {
            index: true,
            element: <HomeLandingPage />,
            handle: {
              title: 'GoodLearn - Hoc tập hiệu quả, phát triển bản thân',
            },
          },
          {
            path: 'feature',
            element: <FeatureLandingPage />,
            handle: {
              title: 'GoodLearn - Tính năng',
            },
          },
          {
            path: 'price',
            element: <PriceLandingPage />,
            handle: {
              title: 'GoodLearn - Bảng giá',
            },
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: '*',
        element: <NotFound fallbackUrl="/" />,
      },
    ],
  },
];
