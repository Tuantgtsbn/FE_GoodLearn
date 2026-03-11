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
      className="flex gap-4 flex-col items-center justify-center"
    >
      <div className="flex flex-col justify-center items-center gap-2 sm:w-[500px]">
        <IC404 className="w-full h-full" />
        <span className="text-[#2d2d2d] md:text-2xl text-sm">
          Trang bạn đang tìm kiếm không tồn tại.
        </span>
      </div>
      <Button
        className="sm:text-2xl text-sm"
        onClick={() => navigate(fallbackUrl)}
      >
        Quay lại trang chủ
      </Button>
    </div>
  );
}
