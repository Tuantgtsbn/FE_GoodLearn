import { X, AlertCircle, Info } from 'lucide-react';

interface PaymentIntroductionProps {
  onClose: (id: unknown) => void;
}

export default function PaymentIntroduction({
  onClose,
}: PaymentIntroductionProps) {
  return (
    <div
      className="w-full max-w-lg bg-white neo-border rounded-2xl shadow-brutal overflow-hidden transform duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-neo-yellow p-5 border-b-4 border-black flex justify-between items-center relative">
        <h2 className="text-2xl font-black">Lưu ý khi thanh toán</h2>
        <button
          title="Đóng"
          onClick={() => onClose(false)}
          className="w-8 h-8 flex items-center justify-center neo-border bg-white rounded hover:bg-neo-pink transition-colors"
        >
          <X size={20} className="font-bold stroke-[3]" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-4 p-4 bg-blue-50 neo-border rounded-xl items-start shadow-brutal-sm">
          <div className="bg-blue-200 p-2 rounded-lg neo-border shadow-brutal-sm shrink-0">
            <Info size={24} className="text-blue-800" />
          </div>
          <div>
            <h3 className="text-xl font-black mb-2 text-blue-900">
              1. Chuyển khoản chính xác
            </h3>
            <p className="text-gray-800 font-bold leading-relaxed">
              Vui lòng quét mã QR hoặc nhập chính xác <strong>Số tiền</strong>{' '}
              và <strong>Nội dung chuyển khoản</strong> để hệ thống tự động xác
              nhận siêu tốc.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-red-50 neo-border rounded-xl items-start shadow-brutal-sm">
          <div className="bg-red-200 p-2 rounded-lg neo-border shadow-brutal-sm shrink-0">
            <AlertCircle size={24} className="text-red-800" />
          </div>
          <div>
            <h3 className="text-xl font-black mb-2 text-red-900">
              2. Hỗ trợ sự cố
            </h3>
            <p className="text-gray-800 font-bold leading-relaxed">
              Nếu gặp lỗi hoặc tiền đã trừ mà hệ thống chưa duyệt liền (sau 1-2
              phút), hãy nhẫn nại một chút hoặc liên hệ CSKH ngay để tụi mình hỗ
              trợ bạn nha!
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 border-t-4 border-black bg-gray-50 flex justify-end">
        <button
          onClick={() => onClose(true)}
          className="px-8 py-3 bg-black text-white border-2 border-black rounded-xl font-black text-lg hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Đã hiểu rùi!
        </button>
      </div>
    </div>
  );
}
