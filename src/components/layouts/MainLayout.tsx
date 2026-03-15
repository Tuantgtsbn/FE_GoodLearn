import useDocumentTitle from '@/hooks/useDocumentTitle';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);
  useDocumentTitle();
  return <Outlet />;
};

export default MainLayout;
