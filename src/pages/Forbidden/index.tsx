import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type IRootState } from '@/redux/store';
import { ERole } from '@/types';

export default function Forbidden() {
  const navigate = useNavigate();
  const { user } = useSelector((state: IRootState) => state.auth);

  const handleGoBack = () => {
    if (user?.role === ERole.USER) {
      navigate('/app', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex gap-4 flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="gap-2 text-red-500">
        <ShieldAlert className="w-32 h-32 md:w-48 md:h-48" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800">403</h1>
      <span className="text-gray-600 md:text-2xl text-sm font-medium">
        Bạn không có quyền truy cập vào trang này.
      </span>
      <Button className="font-bold pl-6 pr-6 mt-4" onClick={handleGoBack}>
        Quay lại trang chủ
      </Button>
    </div>
  );
}
