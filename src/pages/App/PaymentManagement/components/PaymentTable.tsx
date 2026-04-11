import type { IPaymentListItem } from '@/api/ApiPayment';
import clsx from 'clsx';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface PaymentTableProps {
  payments: IPaymentListItem[];
}

const getStatusDisplay = (status: string) => {
  const statusMap: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    PAID: {
      label: 'Thành công',
      color: 'bg-green-100 text-green-700',
      icon: <CheckCircle size={16} />,
    },
    PENDING: {
      label: 'Đang xử lý',
      color: 'bg-amber-100 text-amber-700',
      icon: <Clock size={16} />,
    },
    UNPAID: {
      label: 'Chưa thanh toán',
      color: 'bg-yellow-100 text-yellow-700',
      icon: <AlertCircle size={16} />,
    },
    FAILED: {
      label: 'Thất bại',
      color: 'bg-red-100 text-red-700',
      icon: <XCircle size={16} />,
    },
    CANCELED: {
      label: 'Đã hủy',
      color: 'bg-gray-100 text-gray-700',
      icon: <XCircle size={16} />,
    },
    REFUNDED: {
      label: 'Đã hoàn tiền',
      color: 'bg-blue-100 text-blue-700',
      icon: <CheckCircle size={16} />,
    },
  };

  return statusMap[status] || statusMap.UNPAID;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatAmount = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 md:px-6">
              ID ĐƠN HÀNG
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 md:px-6">
              TÊN GÓI
            </th>
            <th className="hidden px-4 py-4 text-left text-sm font-semibold text-gray-900 md:px-6 lg:table-cell">
              NGÀY MUA
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 md:px-6">
              SỐ TIỀN
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900 md:px-6">
              TRẠNG THÁI
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((payment) => {
            const statusDisplay = getStatusDisplay(payment.paymentStatus);
            const packageName = payment.package?.name || 'N/A';
            const purchaseDate = formatDate(payment.createdAt);
            const amount = formatAmount(payment.amountPaid);

            return (
              <tr key={payment.orderId} className="hover:bg-gray-50 transition">
                {/* Order ID */}
                <td className="px-4 py-4 text-sm font-medium text-gray-900 md:px-6">
                  <code className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                    #{payment.code}
                  </code>
                </td>

                {/* Package Name */}
                <td className="px-4 py-4 text-sm text-gray-700 md:px-6">
                  <div className="max-w-xs">
                    <p className="font-medium">{packageName}</p>
                    <p className="text-xs text-gray-500 md:hidden">
                      {purchaseDate}
                    </p>
                  </div>
                </td>

                {/* Purchase Date (hidden on mobile) */}
                <td className="hidden px-4 py-4 text-sm text-gray-600 md:px-6 lg:table-cell">
                  {purchaseDate}
                </td>

                {/* Amount */}
                <td className="px-4 py-4 text-sm font-semibold text-gray-900 md:px-6">
                  {amount}
                </td>

                {/* Status */}
                <td className="px-4 py-4 md:px-6">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                      statusDisplay.color
                    )}
                  >
                    {statusDisplay.icon}
                    {statusDisplay.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
