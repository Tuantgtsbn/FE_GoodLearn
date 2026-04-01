import type { INotification } from '@/types';
import { fetcher, fetcherWithMetadata } from './Fetcher';

const path = {
  notifications: '/notifications',
  unreadCount: '/notifications/unread-count',
  getById: (id: string) => `/notifications/${id}`,
  markAsRead: (id: string) => `/notifications/${id}/read`,
  markAllAsRead: '/notifications/read-all',
  delete: (id: string) => `/notifications/${id}`,
};

const ApiNotification = {
  // GET /notifications - Lấy danh sách thông báo
  getNotifications: (params: { page: number; limit: number }) => {
    return fetcherWithMetadata<INotification[]>({
      url: path.notifications,
      method: 'GET',
      params,
    });
  },
  // GET /notifications/unread-count - Đếm chưa đọc
  getUnreadCount: () => {
    return fetcher<{ unreadCount: number }>({
      url: path.unreadCount,
      method: 'GET',
    });
  },
  // GET /notifications/:id - Chi tiết một thông báo
  getNotificationById: (id: string) => {
    return fetcher<INotification>({
      url: path.getById(id),
      method: 'GET',
    });
  },
  // PATCH /notifications/:id/read - Đánh dấu đã đọc
  markAsRead: (id: string) => {
    return fetcher<void>({
      url: path.markAsRead(id),
      method: 'PATCH',
    });
  },
  // PATCH /notifications/read-all - Đánh dấu tất cả đã đọc
  markAllAsRead: () => {
    return fetcher<void>({
      url: path.markAllAsRead,
      method: 'PATCH',
    });
  },
  // DELETE /notifications/:id - Xóa thông báo (soft delete)
  deleteNotification: (id: string) => {
    return fetcher<void>({
      url: path.delete(id),
      method: 'DELETE',
    });
  },
};
export default ApiNotification;
