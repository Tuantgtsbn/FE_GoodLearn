import PaymentIntroduction from '@/components/PaymentIntroduction';
import { useDialog } from '@/context/DialogContext';
import type { IPackage } from '@/types';

type PackageItemProps = {
  pkg: IPackage;
  index: number;
  isBuying: boolean;
  onBuy: (packageId: string) => void;
};

const CARD_STYLES = [
  'bg-white',
  'bg-neo-yellow relative transform md:scale-105',
  'bg-neo-cyan',
] as const;

const ICONS = ['✅', '🔥', '🔥'] as const;

const formatPrice = (price: number) => {
  if (!price) {
    return 'Miễn phí';
  }

  return `${price.toLocaleString('vi-VN')} VND`;
};

function PackageItem({ pkg, index, isBuying, onBuy }: PackageItemProps) {
  const { createDialog } = useDialog();
  const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
  const icon = ICONS[index % ICONS.length];
  const finalPrice = pkg.price - (pkg?.discountPrice || 0);
  const hasPaidPlan = finalPrice > 0;

  const handleClickBuyPackage = async (packageId: string) => {
    const result = await createDialog(PaymentIntroduction, {}, 'exclusive');
    if (result) {
      onBuy(packageId);
    }
  };

  const featureRows = [
    `${pkg.maxCredits} credit`,
    pkg.maxChatMessages
      ? `${pkg.maxChatMessages} lượt chat`
      : 'Không giới hạn chat',
    pkg.maxFlashcards
      ? `${pkg.maxFlashcards} lượt flashcard`
      : 'Không giới hạn',
    pkg.maxCreateVideos
      ? `${pkg.maxCreateVideos} lượt tạo video`
      : 'Không giới hạn',
    pkg.maxVoiceCalls
      ? `${pkg.maxVoiceCalls} lượt voice call`
      : 'Không giới hạn',
  ];

  return (
    <article
      className={`${cardStyle} neo-border rounded-2xl p-8 flex flex-col shadow-brutal`}
      data-purpose={pkg.isPopular ? 'pricing-card-featured' : 'pricing-card'}
    >
      {pkg.isPopular ? (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest neo-border">
          PHỔ BIẾN NHẤT
        </div>
      ) : null}

      <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
      <p className="font-bold text-black/60 mb-6">{pkg.description}</p>

      <div className="text-4xl font-black mb-8">{formatPrice(finalPrice)}</div>

      {hasPaidPlan ? (
        <button
          type="button"
          // disabled={isBuying}
          disabled={true}
          onClick={() => handleClickBuyPackage(pkg.packageId)}
          className="w-full py-4 bg-black text-white neo-border rounded-xl font-black text-lg shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isBuying ? 'Đang tạo thanh toán...' : 'Nâng cấp ngay'}
        </button>
      ) : (
        <div className="w-full py-4 bg-white neo-border rounded-xl font-black text-center text-lg">
          Gói miễn phí
        </div>
      )}

      <ul className="space-y-4 mt-10 grow">
        {featureRows.map((feature) => (
          <li key={feature} className="flex items-center gap-3 font-bold">
            <span className="text-xl">{icon}</span> {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default PackageItem;
