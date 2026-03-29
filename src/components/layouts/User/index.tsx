import SideBar from '@components/SideBar';
import {
  LogOut,
  BookOpenText,
  Menu,
  MessageSquareMore,
  TvMinimalPlay,
  Mic,
  FileQuestionMark,
} from 'lucide-react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  useMediaQuery,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type IRootState } from '@redux/store';
import { tryCatch } from '@utils/handleError';
import ApiAuth from '@api/ApiAuth';
import { toast } from 'react-toastify';
import { logout } from '@utils/auth';
import clsx from 'clsx';
import Footer from '../LandingPage/components/Footer';
import ICLogo from '@/components/Icon/ICLogo';
import UserAvatar from './components/UserAvatar';

interface IPatientLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: IPatientLayoutProps) => {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const sideBarItems = [
    {
      label: 'Chatbot',
      to: '/app',
      requireAuth: true,
      icon: <MessageSquareMore />,
      action: () => {
        navigate('/app');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Tạo video & flash card',
      to: '/app/make-content',
      requireAuth: true,
      icon: <TvMinimalPlay />,
      action: () => {
        navigate('/app/make-content');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Voice',
      to: '/app/voice',
      requireAuth: true,
      icon: <Mic />,
      action: () => {
        navigate('/app/voice');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Thi trắc nghiệm',
      to: '/app/quizz',
      icon: <FileQuestionMark />,
      requireAuth: true,
      action: () => {
        navigate('/app/quizz');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Mở rộng',
      requireAuth: true,
      children: [
        {
          label: 'Tài liệu tham khảo',
          to: '/app/reference',
          icon: <BookOpenText />,
          action: () => {
            navigate('/app/reference');
            setDrawerOpen(false);
          },
        },
      ],
    },
  ];

  const handleLogout = async () => {
    const [res, err] = await tryCatch(ApiAuth.logOut());
    if (err) {
      toast.error(err.errorMessage || 'Đăng xuất thất bại');
      return;
    }
    if (res) {
      logout();
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col">
        {isMobile && (
          <>
            <Box
              display="flex"
              alignItems="center"
              className="w-full bg-gray-200 border-b border-gray-200 h-[64px] px-2"
            >
              <IconButton
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1 }}
              >
                <Menu size={28} />
              </IconButton>
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <ICLogo />
                <p className="text-lg font-bold">GoodLearn</p>
              </div>
            </Box>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{ sx: { width: 256 } }}
            >
              <SideBar
                items={sideBarItems}
                orientation="vertical"
                header={
                  <div
                    className="flex gap-3 items-center px-4 mb-5 cursor-pointer"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/');
                    }}
                  >
                    <ICLogo />
                    <p className="text-xl font-bold">GoodLearn</p>
                  </div>
                }
                footer={
                  isAuthenticated ? (
                    <ListItem disablePadding onClick={handleLogout}>
                      <ListItemButton>
                        <ListItemIcon>
                          <LogOut color="red" />
                        </ListItemIcon>
                        <ListItemText primary="Đăng xuất" />
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }
              />
            </Drawer>
          </>
        )}

        {!isMobile && (
          <SideBar
            items={sideBarItems}
            orientation="horizontal"
            header={
              <div
                className="flex gap-3 items-center cursor-pointer mr-8"
                onClick={() => navigate('/')}
              >
                <ICLogo />
                <p className="text-xl font-bold whitespace-nowrap">GoodLearn</p>
              </div>
            }
            footer={<UserAvatar />}
          />
        )}

        <main
          className={clsx('flex-1 flex flex-col', {
            'pb-8': !pathName.includes('chat'),
          })}
        >
          {children}
        </main>

        {!pathName.includes('chat') && <Footer />}
      </div>
    </>
  );
};

export default UserLayout;
