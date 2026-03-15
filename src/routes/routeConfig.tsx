import HomeLandingPage from '../pages/LandingPage/Home';
import FeatureLandingPage from '../pages/LandingPage/Feature';
import PriceLandingPage from '../pages/LandingPage/Price';
import LandingPageLayout from '../components/layouts/LandingPage';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/components/layouts/MainLayout';
import AuthPage from '../pages/Auth';
import TermOfUse from '@/pages/LandingPage/TermOfUse';
import Privacy from '@/pages/LandingPage/Privacy';
import ContactPage from '@/pages/LandingPage/Contact';

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
          {
            path: 'terms-of-use',
            element: <TermOfUse />,
            handle: {
              title: 'GoodLearn - Điều khoản sử dụng',
            },
          },
          {
            path: 'privacy',
            element: <Privacy />,
            handle: {
              title: 'GoodLearn - Chính sách bảo mật',
            },
          },
          {
            path: 'contact',
            element: <ContactPage />,
            handle: {
              title: 'GoodLearn - Liên hệ',
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
        handle: {
          title: 'Không tìm thấy trang',
        },
      },
    ],
  },
];
