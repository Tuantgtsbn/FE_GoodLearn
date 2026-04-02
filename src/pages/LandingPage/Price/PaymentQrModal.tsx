import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import ApiPayment from '@/api/ApiPayment';
import type { ICreatePaymentResponse } from '@/api/ApiPayment';
import { Clapperboard, Coins, Mic, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type PaymentModalData = ICreatePaymentResponse & {
  packageInfo?: {
    name: string;
    type: string;
    maxCredits: number;
    maxCreateVideos: number;
    maxVoiceCalls: number;
  };
};

type PaymentQrModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentModalData | null;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });
};

function PaymentQrModal({ open, onOpenChange, payment }: PaymentQrModalProps) {
  const [qrLoadErrorOrderId, setQrLoadErrorOrderId] = useState<string | null>(
    null
  );
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  if (!payment) {
    return null;
  }

  const isQrLoadError = qrLoadErrorOrderId === payment.orderId;
  const packageName = payment.packageInfo?.name || 'Gói học tập';
  const packageType = payment.packageInfo?.type || 'PREMIUM';
  const maxCredits = payment.packageInfo?.maxCredits || 0;
  const maxCreateVideos = payment.packageInfo?.maxCreateVideos || 0;
  const maxVoiceCalls = payment.packageInfo?.maxVoiceCalls || 0;

  const handleCheckPaymentStatusAndClose = async () => {
    if (isCheckingStatus) {
      return;
    }

    setIsCheckingStatus(true);

    try {
      const response = await ApiPayment.getPaymentStatus(payment.orderId);

      if (response.paymentStatus === 'PAID') {
        toast.success('Thanh toán thành công. Gói của bạn đã được kích hoạt.');
      } else if (response.paymentStatus === 'PENDING') {
        toast.info('Thanh toán đang được xử lý. Vui lòng kiểm tra lại sau.');
      } else if (response.paymentStatus === 'FAILED') {
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      } else {
        toast.info(`Trạng thái thanh toán hiện tại: ${response.paymentStatus}`);
      }
    } catch {
      toast.error(
        'Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.'
      );
    } finally {
      setIsCheckingStatus(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="w-[calc(90%-2rem)] border-[3px] gap-0 overflow-hidden rounded-md border-black bg-white p-0 sm:max-w-4xl"
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-1 md:grid-cols-[400px_minmax(0,1fr)]">
          <div className="border-r-[3px] border-black bg-[#efefef] px-6 py-8">
            <div className="rounded-sm border border-black bg-white p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.15)]">
              <div className="rounded-sm border border-black bg-[#101923] p-4">
                {!isQrLoadError ? (
                  <img
                    src={payment.linkQR}
                    alt="Mã QR thanh toán"
                    className="mx-auto h-60 w-60 rounded-sm bg-white object-contain p-2"
                    onError={() => setQrLoadErrorOrderId(payment.orderId)}
                  />
                ) : (
                  <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-sm bg-white p-2 text-center text-xs font-semibold text-slate-600">
                    Không thể hiển thị QR
                  </div>
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-[9px] font-semibold uppercase tracking-widest text-slate-600">
              Mã thanh toán
            </p>
            <p className="mt-1 text-center text-xs font-bold tracking-wide text-slate-900">
              {payment.orderId}
            </p>
          </div>

          <div className="relative min-w-0 px-5 py-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-sm text-black hover:bg-slate-100"
              aria-label="Đóng modal thanh toán"
            >
              <X size={14} />
            </button>

            <DialogTitle className="pr-8 text-xl font-black text-black">
              Thanh toán khóa học
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-slate-500">
              Quét mã QR dưới đây để hoàn tất việc mua gói học tập.
            </DialogDescription>

            <div className="mt-3 rounded-sm border border-black p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Tên gói
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-lg font-medium leading-none text-black">
                  {packageName}
                </p>
                <span className="rounded-sm border border-black px-2 py-0.5 text-[10px] font-bold uppercase">
                  {packageType}
                </span>
              </div>

              <div className="mt-3 space-y-2 border-y border-slate-200 py-3 text-xs">
                <p className="flex items-center gap-2 text-slate-700">
                  <Coins size={13} />
                  {maxCredits} credits
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Clapperboard size={13} />
                  {maxCreateVideos} AI video generations
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Mic size={13} />
                  {maxVoiceCalls} AI voice calls
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
                <span>Tổng cộng</span>
                <span className="text-lg font-black text-black normal-case">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingStatus}
              onClick={() => void handleCheckPaymentStatusAndClose()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-black bg-black px-4 py-2.5 text-sm font-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCheckingStatus ? 'Đang kiểm tra...' : 'Tôi đã thanh toán'}
            </button>
            <button
              type="button"
              disabled={isCheckingStatus}
              onClick={() => void handleCheckPaymentStatusAndClose()}
              className="mt-2 inline-flex w-full items-center justify-center rounded-sm border border-black bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Hủy
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentQrModal;
