import { Button } from '@/components/ui/button';
import IC404 from '@components/Icon/IC404';
import { useNavigate } from 'react-router-dom';

interface INotFoundProps {
  fallbackUrl: string;
}

export default function NotFound({ fallbackUrl }: INotFoundProps) {
  const navigate = useNavigate();
  return (
    <div
      id="error-page"
      className="flex gap-4 flex-col items-center justify-center min-h-screen"
    >
      <div className="gap-2">
        <IC404 className="w-[400px]" />
      </div>
      <span className="text-[#2d2d2d] md:text-2xl text-sm">
        Trang bạn đang tìm kiếm không tồn tại.
      </span>
      <Button
        className="font-bold pl-6 pr-6"
        onClick={() => navigate(fallbackUrl)}
      >
        Quay lại trang chủ
      </Button>
    </div>
  );
}
