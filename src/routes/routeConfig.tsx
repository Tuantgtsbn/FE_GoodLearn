import HomeLandingPage from '../pages/LandingPage/Home';
import FeatureLandingPage from '../pages/LandingPage/Feature';
import PriceLandingPage from '../pages/LandingPage/Price';
import LandingPageLayout from '../components/layouts/LandingPage';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/components/layouts/MainLayout';
import TermOfUse from '@/pages/LandingPage/TermOfUse';
import Privacy from '@/pages/LandingPage/Privacy';
import ContactPage from '@/pages/LandingPage/Contact';
import AuthLayout from '@/components/layouts/Auth';
import SignUp from '@/pages/Auth/SignUp';
import ForgotPasswordPage from '@/pages/Auth/ForgotPassword';
import { Navigate, Outlet } from 'react-router-dom';
import Login from '@/pages/Auth/Login';
import LoginGoogleCallback from '@/pages/Auth/Login/GoogleCallback';
import ProtectedRoute from './ProtectedRoute';
import { ERole } from '@/types';
import QuizzListPage from '@/pages/App/Quizz';
import DoExamPage from '@/pages/App/Quizz/DoExam';
import LeaderboardPage from '@/pages/App/Quizz/Leaderboard';
import { DialogProvider } from '@/context/DialogContext';
import UserLayout from '@/components/layouts/User';
import Voicecall from '@/pages/App/VoiceCall';
import FlashcardListPage from '@/pages/App/Flashcard';
import DoFlashcardPlayer from '@/pages/App/Flashcard/DoFlashcard';
import ChatPage from '@/pages/App/Chat';
import PaymentManagement from '@/pages/App/PaymentManagement';
import ArticlePage from '@/pages/App/Article';
import ArticleDetailPage from '@/pages/App/Article/ArticleDetail';

export const routes = [
  {
    path: '/',
    element: (
      <DialogProvider>
        <MainLayout />
      </DialogProvider>
    ),
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
        element: (
          <ProtectedRoute requireAuth={false} guestOnly>
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="login" replace />,
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <SignUp />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
          },
        ],
      },
      {
        path: '/app',
        element: (
          <ProtectedRoute allowedRoles={[ERole.USER]}>
            <UserLayout>
              <Outlet />
            </UserLayout>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/app/chat" replace />,
          },
          {
            path: 'quizz',
            element: <QuizzListPage />,
            handle: {
              title: 'Danh sách bài thi trắc nghiệm',
            },
          },
          {
            path: 'quizz/:quizId/do',
            element: <DoExamPage />,
            handle: {
              title: 'Làm bài thi',
            },
          },
          {
            path: 'quizz/:quizId/leaderboard',
            element: <LeaderboardPage />,
            handle: {
              title: 'Bảng xếp hạng bài thi',
            },
          },
          {
            path: 'voice',
            element: <Voicecall />,
            handle: {
              title: 'GoodLearn | Trò chuyện trực tiếp',
            },
          },
          {
            path: 'flashcards',
            element: <FlashcardListPage />,
            handle: {
              title: 'GoodLearn | Thư viện Flashcard',
            },
          },
          {
            path: 'flashcards/:setId',
            element: <DoFlashcardPlayer />,
            handle: {
              title: 'GoodLearn | Học Flashcard',
            },
          },
          {
            path: 'chat',
            element: <ChatPage />,
            handle: {
              title: 'GoodLearn | Chat AI',
            },
          },
          {
            path: 'payments',
            element: <PaymentManagement />,
            handle: {
              title: 'GoodLearn | Quản lý thanh toán',
            },
          },
          {
            path: 'article',
            element: <ArticlePage />,
            handle: {
              title: 'GoodLearn | Báo học trò',
            },
          },
          {
            path: 'article/:slug',
            element: <ArticleDetailPage />,
            handle: {
              title: 'GoodLearn | Báo học trò',
            },
          },
        ],
      },
      {
        path: 'login/google/callback',
        element: <LoginGoogleCallback />,
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
