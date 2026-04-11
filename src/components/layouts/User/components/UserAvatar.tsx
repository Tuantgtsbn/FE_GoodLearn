import ApiUser from '@/api/ApiUser';
import QUERY_KEY from '@/api/QueryKey';
import ModalConfirmLogout from '@/components/ModalConfirmLogout';
import ModalReviewApp from '@/components/ModalReviewApp';
import ModalUserQuota from '@/components/ModalUserQuota';
import UserSetting from '@/components/Settings';
import Avatar from '@/components/ui/Avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDialog } from '@/context/DialogContext';
import type { IRootState } from '@/redux/store';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  CirclePoundSterling,
  Coins,
  CreditCard,
  LogOut,
  Package,
  Settings,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function UserAvatar() {
  const { user } = useSelector((state: IRootState) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { createDialog } = useDialog();

  const { data: userQuota, isLoading } = useQuery({
    queryKey: [QUERY_KEY.USER.GET_USER_QUOTA],
    queryFn: ApiUser.getUserQuota,
    staleTime: 1000 * 60 * 5,
  });

  const handleClickMenu = (action: () => void) => {
    action();
    setOpen(false);
  };

  const handleClickBuyPackage = () => {
    navigate('/price');
  };

  const handleClickQuota = () => {
    createDialog(ModalUserQuota, {}, 'exclusive');
  };

  const handleClickSetting = () => {
    createDialog(UserSetting, {}, 'exclusive');
  };

  const handleClickRating = () => {
    createDialog(ModalReviewApp, {}, 'exclusive');
  };

  const handleLogout = async () => {
    createDialog(ModalConfirmLogout as React.FC, {}, 'exclusive');
  };

  const handleClickPaymentManagement = () => {
    navigate('/app/payments');
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 cursor-pointer">
      <div>
        <p className="text-[14px] font-bold text-foreground leading-none">
          {user?.username}
        </p>
        <p className="text-[12px] text-zinc-400 mt-1">{user?.email}</p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Avatar
            src={user?.avatarUrl}
            name={user?.fullName || user?.username || 'User'}
            size="xs"
            className="cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-70 p-0 overflow-hidden">
          <nav className="flex flex-col">
            <div className="flex flex-col px-[25px] pt-[25px] py-4">
              <h2 className="text-xl font-extrabold text-foreground uppercase tracking-tight leading-none">
                {user?.username}
              </h2>
              <div className="mt-1 flex items-center gap-1">
                <CirclePoundSterling size={16} className="text-yellow-500" />
                <p className="text-sm font-medium text-foreground/90">
                  {isLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    `${userQuota?.quota?.remainingCredits || 0} Credits`
                  )}
                </p>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleClickQuota)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <Coins />
                <span className="text-base font-bold uppercase tracking-wide">
                  Chi tiết hạn mức
                </span>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleClickPaymentManagement)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <CreditCard />
                <span className="text-base font-bold uppercase tracking-wide">
                  Quản lý thanh toán
                </span>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleClickBuyPackage)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <Package />
                <span className="text-base font-bold uppercase tracking-wide">
                  Mua gói
                </span>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleClickSetting)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <Settings />
                <span className="text-base font-bold uppercase tracking-wide">
                  Cài đặt
                </span>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleClickRating)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <Star />
                <span className="text-base font-bold uppercase tracking-wide">
                  Đánh giá website
                </span>
              </div>
            </div>
            <div
              onClick={() => handleClickMenu(handleLogout)}
              className="group cursor-pointer flex items-center justify-between px-[25px] py-4 hover:bg-[#efebeb] dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <LogOut />
                <span className="text-base font-bold uppercase tracking-wide">
                  Đăng xuất
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rouned border-t border-slate-100 flex justify-center italic text-[10px] text-slate-400 uppercase tracking-widest">
              GoodLearn AI - Học là nhất
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    </div>
  );
}
