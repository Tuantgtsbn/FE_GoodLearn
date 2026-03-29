import ApiAuth from '@/api/ApiAuth';
import { queryClient } from '@/config/queryClient';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { logoutUser, updateAuthStore } from '@/redux/slices/AuthSlice';
import type { IRootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingScreen from '../LoadingScreen';

const MainLayout = () => {
  const { accessToken, isAuthenticated } = useSelector(
    (state: IRootState) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const isFetchingUserRef = useRef(false);

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      queryClient.invalidateQueries({ type: 'active' });
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken || isAuthenticated || isFetchingUserRef.current) {
        return;
      }

      try {
        isFetchingUserRef.current = true;
        setIsLoadingUser(true);

        const userData = await ApiAuth.getMe();

        dispatch(
          updateAuthStore({
            user: userData,
            isAuthenticated: true,
          })
        );
      } catch {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        dispatch(logoutUser());
      } finally {
        isFetchingUserRef.current = false;
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [accessToken, isAuthenticated, dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  useDocumentTitle();

  if (accessToken && isLoadingUser) {
    return <LoadingScreen />;
  }

  return <Outlet />;
};

export default MainLayout;
