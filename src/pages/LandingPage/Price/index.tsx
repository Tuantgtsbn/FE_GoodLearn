import ApiPackage from '@/api/ApiPackage';
import ApiPayment from '@/api/ApiPayment';
import QUERY_KEY from '@/api/QueryKey';
import { useAuthAction } from '@/hooks/useAuthAction';
import type { IPackage } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PackageItem from './PackageItem';
import PaymentQrModal from './PaymentQrModal';
import './style.scss';

type PaymentModalData = Awaited<ReturnType<typeof ApiPayment.createPayment>> & {
  packageInfo?: Pick<
    IPackage,
    'name' | 'type' | 'maxCredits' | 'maxCreateVideos' | 'maxVoiceCalls'
  >;
};

function PriceLandingPage() {
  const [buyingPackageId, setBuyingPackageId] = useState<string | null>(null);
  const [paymentModalData, setPaymentModalData] =
    useState<PaymentModalData | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    data: packages = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.PACKAGE.LIST_PACKAGES],
    queryFn: () => ApiPackage.getPackageList(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Không thể tải danh sách gói. Vui lòng thử lại sau.');
    }
  }, [isError]);

  const handleClickBuyPackage = useAuthAction(async (packageId: string) => {
    try {
      setBuyingPackageId(packageId);
      const selectedPackage = packages.find(
        (pkg) => pkg.packageId === packageId
      );
      const payment = await ApiPayment.createPayment({ packageId });
      setPaymentModalData({
        ...payment,
        packageInfo: selectedPackage
          ? {
              name: selectedPackage.name,
              type: selectedPackage.type,
              maxCredits: selectedPackage.maxCredits,
              maxCreateVideos: selectedPackage.maxCreateVideos,
              maxVoiceCalls: selectedPackage.maxVoiceCalls,
            }
          : undefined,
      });
      setIsPaymentModalOpen(true);
      toast.success('Đã tạo thanh toán. Vui lòng quét mã QR để hoàn tất.');
    } catch {
      toast.error('Không thể tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setBuyingPackageId(null);
    }
  });

  return (
    <div className="min-neo-screen text-black font-heading mx_LandingPagePrice">
      <header className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl transform -rotate-12 hidden md:block">
          💰
        </div>
        <div className="absolute bottom-10 left-20 text-4xl transform rotate-12 hidden md:block">
          ✨
        </div>
        <div className="absolute top-20 right-20 text-4xl transform -rotate-6 hidden md:block">
          💳
        </div>
        <div className="absolute bottom-0 right-10 text-4xl transform rotate-45 hidden md:block">
          ⭐
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Chọn Gói Liền Ngay, <br />
            <span className="bg-neo-pink px-4 neo-border shadow-brutal-sm inline-block transform -rotate-2">
              'Hack' Điểm Cực Hay! 🚀
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 mt-8">
            Nâng cấp trải nghiệm học tập trong kỷ nguyên số.
          </p>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 py-16">
        {isPending ? (
          <div className="neo-border rounded-2xl bg-white p-8 text-center font-black text-xl shadow-brutal-sm">
            Đang tải danh sách gói...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {packages.map((pkg, index) => (
              <PackageItem
                key={pkg.packageId}
                pkg={pkg}
                index={index}
                isBuying={buyingPackageId === pkg.packageId}
                onBuy={handleClickBuyPackage}
              />
            ))}
          </div>
        )}
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-black mb-12 text-center underline decoration-neo-purple decoration-8 underline-offset-13">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-6">
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Credit dùng để làm gì?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-2 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Credit được dùng để sử dụng các dịch vụ cao cấp như Trò chuyện hỏi
              đáp với AI, Tạo Video bài giảng, Voice AI (gọi điện luyện tiếng
              anh). Mỗi tính năng sẽ tiêu tốn một lượng credit nhất định.
            </div>
          </details>
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Tôi có thể hủy gói không?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-2 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Sau khi đăng ký, bạn không thể hủy gói đã mua. Tuy nhiên, chúng
              mình cam kết mang đến giá trị xứng đáng với số tiền bạn bỏ ra. Nếu
              có bất kỳ vấn đề nào, đừng ngần ngại liên hệ với đội ngũ hỗ trợ
              của chúng mình để được giải quyết nhanh chóng nhé!
            </div>
          </details>
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Có ưu đãi cho học sinh, sinh viên không?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-2 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Chúng mình luôn có những đợt flash sale vào các dịp như đầu năm
              học, Giáng sinh, Tết, Black Friday. Hãy theo dõi Fanpage hoặc đăng
              ký email để không bỏ lỡ voucher ưu đãi nhé!
            </div>
          </details>
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Tôi có thể mua thêm credit không?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-2 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Hoàn toàn có thể!. Khi bạn đăng ký một gói trả phí, bạn sẽ nhận
              được một lượng credit nhất định. Nếu bạn sử dụng hết credit đó và
              muốn tiếp tục trải nghiệm các tính năng cao cấp, bạn có thể mua
              thêm credit thông qua trang quản lý tài khoản của mình. Chúng mình
              cung cấp nhiều gói credit với mức giá linh hoạt để bạn dễ dàng lựa
              chọn phù hợp với nhu cầu học tập của mình nhé!
            </div>
          </details>
        </div>
      </section>

      <PaymentQrModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        payment={paymentModalData}
      />
    </div>
  );
}

export default PriceLandingPage;
