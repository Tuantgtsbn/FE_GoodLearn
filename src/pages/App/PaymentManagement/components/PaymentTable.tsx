import clsx from 'clsx';
import type { IPaymentListItem } from '@/api/ApiPayment';

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'PAID':
      return {
        label: 'Thành công',
        className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      };
    case 'PENDING':
      return {
        label: 'Đang xử lý',
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      };
    case 'UNPAID':
      return {
        label: 'Chưa TT',
        className: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
      };
    case 'FAILED':
      return {
        label: 'Thất bại',
        className: 'bg-destructive/15 text-destructive',
      };
    case 'CANCELED':
      return { label: 'Đã hủy', className: 'bg-muted text-muted-foreground' };
    case 'REFUNDED':
      return {
        label: 'Hoàn tiền',
        className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      };
    default:
      return { label: status, className: 'bg-muted text-muted-foreground' };
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

interface PaymentTableProps {
  payments: IPaymentListItem[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mã đơn hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Gói
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Số tiền
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                Ngày mua
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => {
              const status = getStatusDisplay(payment.paymentStatus);

              return (
                <tr key={payment.orderId} className="transition hover:bg-muted">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">
                      {payment.code || '--'}
                    </p>
                    <code className="mt-0.5 inline-block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {payment.orderId}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      {payment.package?.name || '--'}
                    </p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {formatDateTime(payment.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(Number(payment.amountPaid))}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-left text-sm text-muted-foreground sm:table-cell">
                    {formatDateTime(payment.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={clsx(
                        'inline-block rounded-full px-2.5 py-1 text-xs font-semibold',
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
