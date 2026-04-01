import { useState, useRef, useEffect } from 'react';
import { Divider, CircularProgress } from '@mui/material';
import { Bell, CheckCheck } from 'lucide-react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import QUERY_KEY from '@api/QueryKey';
import ApiNotification from '@api/ApiNotification';
import NotificationItem, { NotificationDetail } from './NotificationItem';
import type { INotification } from '@/types';
import { useDialog } from '@/context/DialogContext';

export default function NotificationPopover() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { createDialog } = useDialog();

  const handlePopoverInteractOutside = (
    event: CustomEvent<{ originalEvent: Event }>
  ) => {
    const target = event.target as HTMLElement | null;

    // Keep popover open when interaction happens inside global dialog.
    if (target?.closest('[role="dialog"]')) {
      event.preventDefault();
    }
  };

  // Fetch notifications
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      queryFn: ({ pageParam = 1 }) =>
        ApiNotification.getNotifications({ page: pageParam, limit: 20 }),
      getNextPageParam: (lastPage) => {
        const { metadata } = lastPage;
        return metadata?.hasNext ? (metadata.page || 0) + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
    queryFn: () => ApiNotification.getUnreadCount(),
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => ApiNotification.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
    },
  });
  const notifications: INotification[] =
    data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = unreadData?.unreadCount ?? 0;

  // Ref cho infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup IntersectionObserver cho infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleShowNotificationDetail = (notification: INotification) => {
    createDialog(NotificationDetail, {
      notification,
    });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button>
            <Bell size={22} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 p-0 overflow-hidden"
          onInteractOutside={handlePopoverInteractOutside}
        >
          <nav className="flex flex-col">
            <div className="p-[12px_16px]">
              <h2 className="font-semibold text-[20px]">Thông báo</h2>
              {unreadCount > 0 && (
                <Button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="flex gap-1.5"
                >
                  <CheckCheck size={16} />
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
            {/* Content */}
            <div className="max-h-[380px] overflow-y-auto hide-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <CircularProgress size={32} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-6">
                  <Bell size={48} strokeWidth={1.5} />
                  <h2 className="mt-2">Không có thông báo nào</h2>
                </div>
              ) : (
                <>
                  {notifications.map((notification, index) => (
                    <div key={notification.notificationId}>
                      <NotificationItem
                        notification={notification}
                        onClick={() =>
                          handleShowNotificationDetail(notification)
                        }
                      />
                      {index < notifications.length - 1 && <Divider />}
                    </div>
                  ))}
                  {/* Infinite scroll trigger */}
                  <div ref={loadMoreRef} style={{ height: '1px' }} />
                  {/* Loading indicator khi đang load thêm */}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-2">
                      <CircularProgress size={24} />
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    </>
  );
}
