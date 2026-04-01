import { Box, Typography, IconButton } from '@mui/material';
import { X, Bell, FileText, Clock, CircleAlert } from 'lucide-react';
import type { INotification } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiNotification from '@api/ApiNotification';
import QUERY_KEY from '@api/QueryKey';
import { formatDateTimeFromIso } from '@/utils/datetime';

interface NotificationItemProps {
  notification: INotification;
  onClick: () => void;
  onClose?: () => void;
}

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
const getNotificationIcon = (notification: INotification) => {
  const notificationType = notification.notificationType.toLowerCase();
  switch (notificationType) {
    case 'quiz_result':
      return <FileText size={20} />;
    case 'system_alert':
      return <CircleAlert size={20} />;
    case 'reminder':
      return <Clock size={20} />;
    default:
      return <Bell size={20} />;
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

  const markAsReadMutation = useMutation({
    mutationFn: () => ApiNotification.markAsRead(notification.notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
    },
  });

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate();
    }
  };

  return (
    <Box
      sx={{
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
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 3,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getNotificationIcon(notification)}
            </Box>
            <Box>
              <Typography variant="h6">Thông báo</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ mt: -1, mr: -1 }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Title */}
        {notification.title && (
          <Typography
            variant="h6"
            sx={{
              mb: 1.5,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {notification.title}
          </Typography>
        )}

        {/* Message */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            mb: 2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {notification.message}
        </Typography>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            display: 'block',
            mb: 2,
          }}
        >
          {formatDateTimeFromIso(notification.createdAt)}
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            height: 1,
            backgroundColor: 'divider',
            my: 2,
          }}
        />

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          {!notification.isRead && (
            <button
              onClick={handleMarkAsRead}
              style={{
                flex: 1,
                padding: '8px 14px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#2563eb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#3b82f6')
              }
            >
              Đánh dấu đã đọc
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-white hover:text-white hover:bg-black! flex-1 p-[8px_14px] border border-gray-300 rounded-md transition-colors duration-200"
          >
            Đóng
          </button>
        </Box>
      </Box>
    </Box>
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
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
    <Box
      onClick={handleItemClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        cursor: 'pointer',
        backgroundColor: notification.isRead
          ? 'transparent'
          : 'rgba(59, 130, 246, 0.05)',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: notification.isRead
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(59, 130, 246, 0.1)',
        },
        '&:hover .notification-unread-indicator': {
          opacity: 0,
        },
        '&:hover .notification-delete-button': {
          opacity: 1,
        },
        position: 'relative',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {getNotificationIcon(notification)}
      </Box>
      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {notification.title && (
          <Typography
            variant="body2"
            fontWeight={notification.isRead ? 400 : 600}
            sx={{
              color: 'text.primary',
              mb: 0.5,
              lineHeight: 1.4,
            }}
          >
            {notification.title}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {notification.message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            display: 'block',
            mt: 0.5,
          }}
        >
          {formatRelativeTime(notification.createdAt)}
        </Typography>
      </Box>
      {/* Unread indicator */}
      {!notification.isRead && (
        <Box
          className="notification-unread-indicator"
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            flexShrink: 0,
            mt: 0.5,
            opacity: 1,
            transition: 'opacity 0.2s',
          }}
        />
      )}
      {/* Delete button */}
      <IconButton
        className="notification-delete-button"
        size="small"
        onClick={handleDelete}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        <X size={16} />
      </IconButton>
    </Box>
  );
}
