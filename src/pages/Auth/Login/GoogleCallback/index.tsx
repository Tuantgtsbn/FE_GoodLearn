import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiAuth from '@api/ApiAuth';
import { loginUser } from '@redux/slices/AuthSlice';
import { useMutation } from '@tanstack/react-query';
import { getDefaultRoute } from '../index';

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
    let cancelled = false;
    const timeoutIds = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId);
        if (!cancelled) {
          callback();
        }
      }, delay);

      timeoutIds.add(timeoutId);
    };

    const closePopupOrNavigateToLogin = (delay: number) => {
      schedule(() => {
        if (window.opener) {
          window.close();
        } else {
          navigate('/auth/login', { replace: true });
        }
      }, delay);
    };

    const handleCallbackError = (
      message: string,
      code?: string,
      delay = 2000
    ) => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_LOGIN_ERROR',
            error: { message, code },
          },
          window.location.origin
        );
        window.close();
        return;
      }

      setStatus('error');
      setMessage(message);
      toast.error(message);
      closePopupOrNavigateToLogin(delay);
    };

    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      // ⚠️ Case 1: Truy cập trực tiếp (không có code và error)
      // Có thể là user bookmark trang này hoặc truy cập trực tiếp
      if (!code && !error) {
        handleCallbackError(
          'Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.',
          undefined,
          2000
        );
        return;
      }

      // ⚠️ Case 2: Google OAuth trả về lỗi
      if (error) {
        let userMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
        if (error === 'access_denied') {
          userMessage =
            'Bạn đã từ chối quyền truy cập. Vui lòng thử lại và cho phép quyền.';
        } else if (error === 'invalid_request') {
          userMessage = 'Yêu cầu không hợp lệ. Vui lòng đăng nhập lại.';
        }

        handleCallbackError(userMessage, error, 2500);
        return;
      }

      // ⚠️ Case 3: Có code nhưng không hợp lệ
      if (!code || code.trim() === '') {
        handleCallbackError('Mã xác thực không hợp lệ hoặc đã hết hạn.');
        return;
      }

      try {
        const data = await mutateAsync(code);

        if (cancelled) {
          return;
        }

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
        schedule(() => {
          navigate(getDefaultRoute(role), { replace: true });
        }, 1500);
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        handleCallbackError(
          error?.errorMessage || 'Đăng nhập thất bại. Vui lòng thử lại.',
          error?.errorCode
        );
      }
    };

    handleGoogleCallback();

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.clear();
    };
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
