/**
 * Authentication utilities
 * Separated from Fetcher to break circular dependency
 */

import { logoutUser, updateAuthStore } from '@redux/slices/AuthSlice';
import store, { persistor } from '@redux/store';
import { toast } from 'react-toastify';

/**
 * Logout user and clear session
 */
export function logout(): void {
  persistor
    .purge()
    .then(() => {
      store.dispatch(logoutUser());
      window.location.assign('/auth/login');
    })
    .catch(() => {
      window.alert('Trình duyệt bị lỗi. Xóa Cookie trình duyệt và thử lại');
    });
}

/**
 * Handle logout with toast notification
 */
export function handleLogout(content: string, isRequiredLogOut: boolean): void {
  if (!isRequiredLogOut) {
    toast.warn(content);
  } else {
    logout();
    toast.error(content);
  }
}

/**
 * Get current access token from Redux store
 */
export function getAccessToken(): string | null {
  const state = store.getState();
  return state.auth.accessToken ?? null;
}

/**
 * Get current refresh token from Redux store
 */
export function getRefreshToken(): string | null {
  const state = store.getState();
  return state.auth.refreshToken ?? null;
}

/**
 * Update access token in Redux store
 */
export function updateAccessToken(accessToken: string): void {
  store.dispatch(
    updateAuthStore({
      accessToken,
    })
  );
}

/**
 * Get Redux store state
 */
export function getStoreState() {
  return store.getState();
}
