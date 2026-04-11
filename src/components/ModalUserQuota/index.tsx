import { useQuery } from '@tanstack/react-query';
import {
  BookOpenText,
  CirclePoundSterling,
  MessageSquareText,
  Mic,
  XIcon,
} from 'lucide-react';

import ApiUser from '@/api/ApiUser';
import QUERY_KEY from '@/api/QueryKey';
import { Button } from '@/components/ui/button';

interface ModalUserQuotaProps {
  id?: string;
  onClose?: () => void;
}

function QuotaItem({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold ">{title}</span>
        </div>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}

export default function ModalUserQuota({ onClose }: ModalUserQuotaProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.USER.GET_USER_QUOTA],
    queryFn: ApiUser.getUserQuota,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div
      className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-gray-200 bg-white p-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Hạn mức của bạn
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Xem lại số lần sử dụng còn lại của bạn.
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Đóng</span>
        </Button>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500">
            Đang tải thông tin quota...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Không thể tải quota. Vui lòng thử lại sau.
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Không có dữ liệu quota.
          </div>
        ) : (
          <div className="space-y-4">
            <QuotaItem
              title="Tổng credit còn lại"
              value={data.quota.remainingCredits}
              icon={<CirclePoundSterling size={16} />}
            />
            <QuotaItem
              title="Lượt chat còn lại"
              value={data.quota.remainingChatMessages}
              icon={<MessageSquareText size={16} />}
            />
            <QuotaItem
              title="Lượt tạo flashcard còn lại"
              value={data.quota.remainingFlashcards}
              icon={<BookOpenText size={16} />}
            />
            <QuotaItem
              title="Lượt voicecall còn lại"
              value={data.quota.remainingVoiceCalls}
              icon={<Mic size={16} />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
