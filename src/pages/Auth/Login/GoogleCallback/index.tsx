import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiAuth from '@api/ApiAuth';
import { loginUser } from '@redux/slices/AuthSlice';
import { ERole } from 'src/types';
import { useMutation } from '@tanstack/react-query';

export default function LoginGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Đang xác thực với Google...');
  const { mutateAsync } = useMutation({
    mutationFn: (code: string) => ApiAuth.loginByGoogle(code),
  });

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      // ⚠️ Case 1: Truy cập trực tiếp (không có code và error)
      // Có thể là user bookmark trang này hoặc truy cập trực tiếp
      if (!code && !error) {
        setStatus('error');
        setMessage(
          'Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.'
        );
        toast.warning('Vui lòng đăng nhập qua Google từ trang Login!');
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2000);
        return;
      }

      // ⚠️ Case 2: Google OAuth trả về lỗi
      if (error) {
        setStatus('error');
        let userMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
        if (error === 'access_denied') {
          userMessage =
            'Bạn đã từ chối quyền truy cập. Vui lòng thử lại và cho phép quyền.';
        } else if (error === 'invalid_request') {
          userMessage = 'Yêu cầu không hợp lệ. Vui lòng đăng nhập lại.';
        }

        setMessage(userMessage);
        toast.error(userMessage);
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2500);
        return;
      }

      // ⚠️ Case 3: Có code nhưng không hợp lệ
      if (!code || code.trim() === '') {
        setStatus('error');
        setMessage('Mã xác thực không hợp lệ hoặc đã hết hạn.');
        toast.error('Mã xác thực không hợp lệ!');
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2000);
        return;
      }

      try {
        const data = await mutateAsync(code);

        dispatch(loginUser(data));

        setStatus('success');
        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        toast.success('Đăng nhập thành công!');

        // ✅ Post message về parent window (trang Login)
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_LOGIN_SUCCESS',
              data: {
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              },
            },
            window.location.origin
          );
          window.close();
          return;
        }

        // Redirect theo role
        const role = data.user.role;
        setTimeout(() => {
          switch (role) {
            case ERole.USER:
              navigate('/', { replace: true });
              break;
            // case ERole.ADMIN:
            //   navigate('/admin', { replace: true });
            //   break;
            default:
              navigate('/', { replace: true });
          }
        }, 1500);
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error?.errorMessage || 'Đăng nhập thất bại. Vui lòng thử lại.'
        );
        toast.error(error?.errorMessage || 'Đăng nhập thất bại!');

        // ✅ Post error message về parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_LOGIN_ERROR',
              error: {
                message: error?.errorMessage || 'Đăng nhập thất bại',
                code: error?.errorCode,
              },
            },
            window.location.origin
          );
        }

        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/auth/login');
          }
        }, 2000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, dispatch, mutateAsync]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        bgcolor: '#ccc',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 4,
          padding: 6,
          boxShadow:
            '0 10px 40px rgba(0,0,0,0.1), 10px 10px 40px rgba(0,0,0,0.1), -10px -10px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        {/* Icon based on status */}
        <div className="flex justify-center">
          {status === 'loading' && (
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: '#667eea',
                marginBottom: 3,
              }}
            />
          )}

          {status === 'success' && (
            <CheckCircle
              size={80}
              color="#10b981"
              style={{ marginBottom: 24 }}
            />
          )}

          {status === 'error' && (
            <XCircle size={80} color="#ef4444" style={{ marginBottom: 24 }} />
          )}
        </div>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            marginBottom: 2,
            color:
              status === 'error'
                ? '#ef4444'
                : status === 'success'
                  ? '#10b981'
                  : '#667eea',
          }}
        >
          {status === 'loading' && 'Đang xử lý...'}
          {status === 'success' && 'Thành công!'}
          {status === 'error' && 'Có lỗi xảy ra'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            marginBottom: 3,
          }}
        >
          {message}
        </Typography>

        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#667eea',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: `${i * 0.16}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0)',
                    },
                    '40%': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
