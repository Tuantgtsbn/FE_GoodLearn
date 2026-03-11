import './style.scss';

function PriceLandingPage() {
  return (
    <div className="min-neo-screen text-black font-heading priceLandingPage-wrapper">
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
            Chọn Gói Của Cậu, <br />
            <span className="bg-neo-pink px-4 neo-border shadow-brutal-sm inline-block transform -rotate-2">
              'Hack' Điểm Cực Dễ! 🚀
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 mt-8">
            Nâng cấp trải nghiệm học tập không giới hạn cùng trợ lý AI siêu cấp.
          </p>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          <article
            className="bg-white neo-border rounded-2xl p-8 flex flex-col shadow-brutal"
            data-purpose="pricing-card"
          >
            <h3 className="text-2xl font-black mb-2">Gói Cơ Bản</h3>
            <p className="font-bold text-gray-500 mb-6">Dành cho người mới</p>
            <div className="text-4xl font-black mb-8">Miễn phí</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">✅</span> 5 lượt chat/ngày
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">✅</span> 1 bộ flashcard
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">✅</span> Video 1 phút
              </li>
            </ul>
            <button className="w-full py-4 bg-white neo-border rounded-xl font-black text-lg shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Dùng thử ngay
            </button>
          </article>
          <article
            className="bg-neo-yellow neo-border rounded-2xl p-8 flex flex-col shadow-brutal relative transform md:scale-105"
            data-purpose="pricing-card-featured"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest neo-border">
              PHỔ BIẾN NHẤT
            </div>
            <h3 className="text-2xl font-black mb-2">Gói Học Bá</h3>
            <p className="font-bold text-black/60 mb-6">Tăng tốc học tập</p>
            <div className="text-4xl font-black mb-8">
              300,000 <span className="text-xl">VND</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">🔥</span> 300 credit hàng tháng
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">🔥</span> 10 lượt tạo video
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">🔥</span> 10 lượt voice call
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">🔥</span> Chat không giới hạn
              </li>
            </ul>
            <button className="w-full py-4 bg-black text-white neo-border rounded-xl font-black text-lg shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Nâng cấp ngay
            </button>
          </article>
          <article
            className="bg-neo-cyan neo-border rounded-2xl p-8 flex flex-col shadow-brutal"
            data-purpose="pricing-card"
          >
            <h3 className="text-2xl font-black mb-2">Gói Siêu Cấp</h3>
            <p className="font-bold text-black/60 mb-6">Đỉnh cao trí tuệ</p>
            <div className="text-4xl font-black mb-8">
              600,000 <span className="text-xl">VND</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">⚡</span> 1000 credit hàng tháng
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">⚡</span> Video không giới hạn
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">⚡</span> Voice AI không giới hạn
              </li>
              <li className="flex items-center gap-3 font-bold">
                <span className="text-xl">⚡</span> Ưu tiên hỗ trợ 24/7
              </li>
            </ul>
            <button className="w-full py-4 bg-white neo-border rounded-xl font-black text-lg shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Chọn gói này
            </button>
          </article>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-black mb-12 text-center underline decoration-neo-purple decoration-8 underline-offset-8">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-6">
          <details
            className="group neo-border rounded-2xl bg-white shadow-brutal-sm"
            open=""
          >
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Credit dùng để làm gì?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-0 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Credit được dùng để đổi các dịch vụ cao cấp như Tạo Video bài
              giảng, Voice AI (gọi điện luyện tiếng anh) và giải các bài tập
              chuyên sâu. Mỗi tính năng sẽ tiêu tốn một lượng credit nhất định.
            </div>
          </details>
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Tôi có thể hủy gói không?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-0 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Hoàn toàn có thể! Bạn có thể hủy gia hạn bất cứ lúc nào trong cài
              đặt tài khoản. Quyền lợi của gói vẫn sẽ được giữ cho đến hết chu
              kỳ thanh toán hiện tại.
            </div>
          </details>
          <details className="group neo-border rounded-2xl bg-white shadow-brutal-sm">
            <summary className="flex justify-between items-center p-6 cursor-pointer font-black text-xl list-none">
              Có ưu đãi cho học sinh, sinh viên không?
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="p-6 pt-0 font-bold text-gray-700 leading-relaxed border-t-2 border-black">
              Chúng mình luôn có những đợt flash sale dành riêng cho mùa thi.
              Hãy theo dõi Fanpage hoặc đăng ký email để không bỏ lỡ voucher 50%
              nhé!
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default PriceLandingPage;
