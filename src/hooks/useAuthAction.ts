import ModalRequiredLogin from '@/components/ModalRequiredLogin';
import { useDialog } from '@/context/DialogContext';
import type { IRootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export function useAuthAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => void
) {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const { createDialog } = useDialog();

  const openLoginModal = () => {
    createDialog(ModalRequiredLogin, {}, 'exclusive');
  };

  return (...args: TArgs) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    action(...args);
  };
}
