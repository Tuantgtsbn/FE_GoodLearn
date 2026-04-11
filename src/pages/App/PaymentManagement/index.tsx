import ApiPayment, { type IPaymentListApiQuery } from '@/api/ApiPayment';
import QUERY_KEY from '@/api/QueryKey';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import PaymentTable from './components/PaymentTable';
import CommonInput from '@/components/CommonInput';
import './index.scss';

const ITEMS_PER_PAGE = 10;

const PAYMENT_STATUS_OPTIONS = [
  { value: '_all', label: 'Tất cả trạng thái' },
  { value: 'PAID', label: 'Thành công' },
  { value: 'PENDING', label: 'Đang xử lý' },
  { value: 'UNPAID', label: 'Chưa thanh toán' },
  { value: 'CANCELED', label: 'Đã hủy' },
  { value: 'FAILED', label: 'Thất bại' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

export default function PaymentManagement() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams: IPaymentListApiQuery = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(paymentStatus &&
      paymentStatus !== '_all' && {
        paymentStatus: paymentStatus as any,
      }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { data, isPending, isError } = useQuery({
    queryKey: [QUERY_KEY.PAYMENT.LIST_PAYMENTS, queryParams],
    queryFn: () => ApiPayment.getPaymentsList(queryParams),
    placeholderData: (prev) => prev,
  });

  const payments = data?.data || [];
  const metadata = data?.metadata;
  const totalPages = metadata?.totalPages ?? 1;

  const handleReset = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPaymentStatus('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen p-4 md:p-8 w-[90%] mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý thanh toán
          </h1>
          <p className="mt-1 text-gray-600">
            Xem và quản lý lịch sử giao dịch khóa học của bạn
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-4 sm:grid-cols-12">
            {/* Search */}
            <div className="sm:col-span-6 md:col-span-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <CommonInput
                  type="text"
                  placeholder="Tìm ID đơn hàng..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-6 md:col-span-4 mx_selector">
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {debouncedSearch && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                ID: "{debouncedSearch}"
              </span>
            )}
            {paymentStatus && paymentStatus !== '_all' && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {
                  PAYMENT_STATUS_OPTIONS.find(
                    (opt) => opt.value === paymentStatus
                  )?.label
                }
              </span>
            )}
            {(debouncedSearch || paymentStatus) && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {isPending ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
            <div className="inline-block">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : isError || (payments.length === 0 && !isPending) ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Không tìm thấy giao dịch nào
            </h3>
            <p className="mt-2 text-gray-600">
              {isError
                ? 'Có lỗi khi tải dữ liệu. Vui lòng thử lại.'
                : 'Hãy điều chỉnh bộ lọc để xem danh sách giao dịch của bạn.'}
            </p>
            {(debouncedSearch || paymentStatus) && (
              <Button onClick={handleReset} className="mt-4" variant="outline">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <PaymentTable payments={payments} />
        )}

        {/* Pagination */}
        {payments.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              Đang hiển thị{' '}
              {Math.min(
                (page - 1) * ITEMS_PER_PAGE + 1,
                metadata?.totalItems ?? 0
              )}{' '}
              đến {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)}{' '}
              trong {metadata?.totalItems ?? 0} giao dịch
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-lg border transition',
                  page === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                )}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={clsx(
                        'h-9 w-9 rounded-lg font-medium transition',
                        pageNum === page
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-lg border transition',
                  page === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                )}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
