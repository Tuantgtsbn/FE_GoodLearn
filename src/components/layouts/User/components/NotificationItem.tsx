import { X, Bell, FileText, Clock, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import './NotificationItem.css';
import type { INotification } from '@/types';
import type { IDataWithMeta } from '@/api/Fetcher';
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import ApiNotification from '@api/ApiNotification';
import QUERY_KEY from '@api/QueryKey';
import { formatDateTimeFromIso } from '@/utils/datetime';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: INotification;
  onClick: () => void;
  onClose?: () => void;
}

const updateUnreadCountCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (currentCount: number) => number
) => {
  queryClient.setQueryData<{ unreadCount: number }>(
    [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
    (oldData) => {
      const currentCount = oldData?.unreadCount ?? 0;
      return { unreadCount: Math.max(0, updater(currentCount)) };
    }
  );
};

const updateNotificationListCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (notifications: INotification[]) => INotification[]
) => {
  queryClient.setQueryData<InfiniteData<IDataWithMeta<INotification[]>>>(
    [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
    (oldData) => {
      if (!oldData) {
        return oldData;
      }

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: updater(page.data),
        })),
      };
    }
  );
};

// Format relative time (2 phút trước, 1 giờ trước...)
const formatRelativeTime = (dateString: string | Date): string => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return formatDateTimeFromIso(dateString);
};

// Get icon based on notification title/content
const getNotificationIcon = (
  notification: INotification,
  className: string
) => {
  const notificationType = notification.notificationType.toLowerCase();
  switch (notificationType) {
    case 'quiz_result':
      return <FileText className={className} size={20} />;
    case 'system_alert':
      return <CircleAlert className={className} size={20} />;
    case 'reminder':
      return <Clock className={className} size={20} />;
    default:
      return <Bell className={className} size={20} />;
  }
};

type NotificationDetailProps = {
  notification: INotification;
  onClose: () => void;
};

export function NotificationDetail({
  notification,
  onClose,
}: NotificationDetailProps) {
  const queryClient = useQueryClient();
  const [isReadLocal, setIsReadLocal] = useState(notification.isRead);

  const markAsReadMutation = useMutation({
    mutationFn: () => ApiNotification.markAsRead(notification.notificationId),
    onSuccess: () => {
      updateNotificationListCache(queryClient, (notifications) =>
        notifications.map((item) =>
          item.notificationId === notification.notificationId
            ? { ...item, isRead: true }
            : item
        )
      );

      if (!notification.isRead) {
        updateUnreadCountCache(queryClient, (count) => count - 1);
      }

      setIsReadLocal(true);
    },
  });

  const handleMarkAsRead = () => {
    if (!isReadLocal && !markAsReadMutation.isPending) {
      markAsReadMutation.mutate();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getNotificationIcon(notification, 'stroke-[#000]')}
            </div>
            <div>
              <div
                style={{
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                }}
              >
                Thông báo
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: -4,
              marginRight: -4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        {notification.title && (
          <div
            style={{
              marginBottom: 12,
              fontWeight: 600,
              color: 'rgba(0, 0, 0, 0.87)',
              fontSize: '1.25rem',
            }}
          >
            {notification.title}
          </div>
        )}

        {/* Message */}
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.87)',
            lineHeight: 1.6,
            marginBottom: 16,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {notification.message}
        </div>

        {/* Timestamp */}
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.6)',
            display: 'block',
            marginBottom: 16,
            fontSize: '0.75rem',
          }}
        >
          {formatDateTimeFromIso(notification.createdAt)}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: '#e0e0e0',
            marginTop: 16,
            marginBottom: 16,
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          {!isReadLocal && (
            <Button
              className=" hover:text-black hover:bg-white! flex-1 p-[6px_14px] border border-gray-300 rounded-md transition-colors duration-200"
              onClick={handleMarkAsRead}
              disabled={markAsReadMutation.isPending}
            >
              Đánh dấu đã đọc
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-white  text-black hover:text-white hover:bg-black! flex-1 p-[6px_14px] border border-gray-300 rounded-md transition-colors duration-200"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const queryClient = useQueryClient();
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () =>
      ApiNotification.deleteNotification(notification.notificationId),
    onSuccess: () => {
      updateNotificationListCache(queryClient, (notifications) =>
        notifications.filter(
          (item) => item.notificationId !== notification.notificationId
        )
      );

      if (!notification.isRead) {
        updateUnreadCountCache(queryClient, (count) => count - 1);
      }
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate();
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      onClick={handleItemClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        cursor: 'pointer',
        backgroundColor: notification.isRead
          ? 'transparent'
          : 'rgba(59, 130, 246, 0.05)',
        position: 'relative',
      }}
      className={`notification-item-root ${notification.isRead ? 'read' : 'unread'}`}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: '#efefef',
        }}
      >
        {getNotificationIcon(notification, 'text-[#000]')}
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {notification.title && (
          <div
            style={{
              color: 'black',
              marginBottom: 4,
              lineHeight: 1.4,
              fontWeight: notification.isRead ? 400 : 600,
            }}
          >
            {notification.title}
          </div>
        )}
        <div
          style={{
            color: 'rgba(107, 114, 128, 1)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {notification.message}
        </div>
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.38)',
            display: 'block',
            marginTop: 4,
            fontSize: '0.75rem',
          }}
        >
          {formatRelativeTime(notification.createdAt)}
        </div>
      </div>
      {/* Unread indicator */}
      {!notification.isRead && (
        <div
          className="notification-unread-indicator"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            flexShrink: 0,
            marginTop: 4,
            opacity: 1,
            transition: 'opacity 0.2s',
          }}
        />
      )}
      {/* Delete button */}
      <button
        type="button"
        className="notification-delete-button"
        onClick={handleDelete}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0,
          transition: 'opacity 0.2s',
          background: 'transparent',
          border: 'none',
          padding: 2,
          cursor: 'pointer',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
