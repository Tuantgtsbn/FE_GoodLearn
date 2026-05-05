import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface IModalWarningChatProps {
  onClose?: () => void;
}

export default function ModalWarningChat({ onClose }: IModalWarningChatProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Thông báo
      </h3>
      <ol className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          1. Hiện tại chức năng tạo video đang chưa tốt. Bạn muốn trải nhiệm
          video được tạo bởi AI thì có thể truy cập trang{' '}
          <span
            className="font-bold text-blue-500 underline cursor-pointer"
            onClick={() => {
              onClose?.();
              navigate('/app/library');
            }}
          >
            thư viện
          </span>
          .
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          2. Khi tạo flashcard, nếu phải chờ đợi lâu, bạn hãy load lại trang.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          3. Bạn hãy truy cập{' '}
          <span
            className="font-bold text-blue-500 underline cursor-pointer"
            onClick={() => {
              onClose?.();
              navigate('/app/usage');
            }}
          >
            hướng dẫn
          </span>{' '}
          để biết thêm chi tiết cách sử dụng đúng cách.
        </p>
      </ol>

      <div className="flex justify-end">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </div>
  );
}
