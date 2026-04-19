import { useNavigate } from 'react-router-dom';
import './style.scss';
import ModalReviewApp from '@/components/ModalReviewApp';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { IRootState } from '@/redux/store';
import { toast } from 'react-toastify';

function HomeLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const [inputEmail, setInputEmail] = useState('');

  const handleClickRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAuthenticated) {
      toast.info('Bạn đã đăng xuất để đăng ký tài khoản mới nhé!');
    } else {
      e.preventDefault();
      navigate(`/auth/register?email=${encodeURIComponent(inputEmail)}`);
    }
  };

  return (
    <div className="font-body text-slate-900 overflow-x-hidden mx_LandingPageHome">
      <main
        className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12"
        data-purpose="hero-section"
      >
        <section className="flex-1 space-y-8">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-heading leading-tight">
              Học Giỏi Hơn <br /> Cùng AI -{' '}
              <span className="bg-brandCyan px-2 border-2 border-black text-[50px]">
                Không Lo
              </span>{' '}
              Buồn Ngủ!
            </h1>
            <span className="absolute -top-10 -right-8 font-hand text-2xl text-brandPink transform rotate-12 hidden lg:block">
              Dễ như ăn bánh! 🍰
            </span>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-slate-700 max-w-xl">
            Gia sư AI đồng hành cùng bạn 24/7. Giải đáp mọi thắc mắc, tóm tắt
            kiến thức trong 1 nốt nhạc.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/app')}
              className="bg-black text-white px-8 py-4 border-2 border-black rounded-2xl font-extrabold text-lg shadow-brutal hover:bg-brandPurple transition-colors"
            >
              Bắt đầu miễn phí
            </button>
            <button
              onClick={() => {
                navigate('/feature');
              }}
              className="bg-white px-8 py-4 border-2 border-black rounded-2xl font-extrabold text-lg shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </section>
        <section
          className="flex-1 relative w-full max-w-md md:max-w-none"
          data-purpose="hero-illustration"
        >
          <div className="bg-brandPink border-2 border-black rounded-2xl p-6 shadow-brutal relative z-[9]">
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-3 rounded-xl max-w-[80%] shadow-brutal-sm">
                <p className="font-bold">AI ơi, định lý Pi-ta-go là gì? 🤔</p>
              </div>
              <div className="bg-brandCyan border-2 border-black p-3 rounded-xl max-w-[80%] ml-auto shadow-brutal-sm">
                <p className="font-bold">
                  Dễ thôi! Để mình hướng dẫn bạn nhé... ✨
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-brandYellow border-2 border-black rounded-full flex items-center justify-center text-3xl shadow-brutal-sm z-9 animate-bounce">
            💡
          </div>
          <div className="absolute -bottom-4 right-4 w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center text-2xl shadow-brutal-sm z-20">
            ✍️
          </div>
          <div className="absolute top-1/2 -right-8 w-14 h-14 bg-brandPurple border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-brutal-sm z-20">
            ⭐
          </div>
        </section>
      </main>
      <section
        className="bg-black py-8 overflow-hidden border-y-4 border-black"
        data-purpose="social-proof"
      >
        <div className="flex whitespace-nowrap gap-12 animate-marquee items-center text-white font-heading text-xl md:text-3xl uppercase tracking-widest">
          <span className="flex items-center gap-4">
            <span className="text-brandYellow">★</span> 10,000+ Câu hỏi được
            giải
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brandCyan">★</span> 50,000+ Học sinh tin dùng
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brandPink">★</span> Top 1 Web Giáo Dục AI
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brandPurple">★</span> 98% Phụ huynh hài lòng
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brandYellow">★</span> 10,000+ Câu hỏi được
            giải
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brandCyan">★</span> 50,000+ Học sinh tin dùng
          </span>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-20" data-purpose="features">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Mọi thứ bạn cần để học tốt
          </h2>
          <p className="font-hand text-2xl text-brandPink">
            Tất cả trong một nền tảng duy nhất
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="brutal-card bg-brandYellow border-2 border-black p-8 rounded-2xl shadow-brutal">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-heading mb-2">Hỏi đáp AI</h3>
            <p className="font-semibold opacity-80">
              Hỏi đáp mọi môn học, mọi cấp độ, AI sẽ giải thích cho bạn chi tiết
              dễ hiểu trong tích tắc.
            </p>
          </div>
          <div className="brutal-card bg-brandPink border-2 border-black p-8 rounded-2xl shadow-brutal">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-heading mb-2">Quiz Tương Tác</h3>
            <p className="font-semibold opacity-80">
              Tự động tạo bộ câu hỏi trắc nghiệm từ bài học, giúp bạn ôn tập
              hiệu quả và kiểm tra kiến thức ngay lập tức.
            </p>
          </div>
          <div className="brutal-card bg-white border-2 border-black p-8 rounded-2xl shadow-brutal">
            <div className="text-4xl mb-4">📹</div>
            <h3 className="text-2xl font-heading mb-2">Flashcards, Video</h3>
            <p className="font-semibold opacity-80">
              Ghi nhớ kiến thức qua các thẻ Flashcard và video ngắn sinh động,
              dễ hiểu, dễ thuộc.
            </p>
          </div>
          <div className="brutal-card bg-brandCyan border-2 border-black p-8 rounded-2xl shadow-brutal">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-2xl font-heading mb-2">Giải trí</h3>
            <p className="font-semibold opacity-80">
              Website cung cấp nhiều gameshow, trò chơi vui nhộn giúp các em có
              thể thư giãn giải trí sau những giờ học căng thẳng, vừa học vừa
              chơi cực kỳ hiệu quả.
            </p>
          </div>
        </div>
      </section>
      <section
        className="max-w-7xl mx-auto px-4 py-20 bg-slate-50/50 border-y-2 border-black border-dashed"
        data-purpose="testimonials"
      >
        <h2 className="text-4xl font-heading text-center mb-16 underline decoration-brandCyan decoration-8 underline-offset-8">
          Phản hồi từ bạn học
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          <div className="relative bg-yellow-100 border-2 border-black p-6 rounded-sm shadow-brutal -rotate-2 hover:rotate-0 transition-transform">
            <div className="sticky-note-tape"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brandPink border-2 border-black rounded-full overflow-hidden">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQr0uwuFTBe9Z9thRAj3zHEy6OeMZkpDXzm1J7qqB8krz058JSYzDlAApAx80HgCO7GC7R3bjMhcobydX0PWiDQ9T_V2_qd1MjzIt6xCCgfAyg8xB2HYaiOijvKLJC8cthtdaUUq_eZkn6gQMcrRTcfYuLRrkCYuPLa3JIxMoqh6oScCQo0feORdTlNuTXVhSFiBQm0cAklJvkNMh649B9EdlRAf-czU-ld8x8gWv_bTpgPrD6ZQLrG6WvPHrz-3fphHZHCSJoAfc"
                />
              </div>
              <div>
                <p className="font-bold">Minh Anh</p>
                <p className="text-yellow-600">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <p className="font-hand text-xl">
              "Từ khi dùng GoodLearn, mình không còn sợ môn Toán nữa, mình tiến
              bộ lên rất nhiều. Giải thích rất dễ hiểu!"
            </p>
          </div>
          <div className="relative bg-emerald-100 border-2 border-black p-6 rounded-sm shadow-brutal rotate-3 hover:rotate-0 transition-transform">
            <div className="sticky-note-tape"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brandCyan border-2 border-black rounded-full overflow-hidden">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBJ-AoLUtG5DeG53q9TOqimEOyqXsv6Lno95bg2SV3s84rQszjGr57lcAqvmAz25_7iTwK2FNmh8re4Ma3nTSkzZJMv-WIOhGnlFzUkO-L-cZz4JN0a8ehf1kVtZ7Qd3w6cw4pNlbbtkjSSDeGZU0iDqaxfHdf-n12ecGFAgyUtjXY8bggG7jk6qIMFusaCFiPNT5Vqbbr0o37EMeXgBva2VSpYq5w4d2P4H36PTiQ0yi6uT2fshaTL2rcaEtetN9R2KVuKskC5mo"
                />
              </div>
              <div>
                <p className="font-bold">Tuấn Kiệt</p>
                <p className="text-yellow-600">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <p className="font-hand text-xl">
              "Website xịn thực sự, nhất là phần tạo video. Mình đã tạo các
              video nói về môn Lịch sử để ôn tập, rất hữu ích!"
            </p>
          </div>
          <div className="relative bg-pink-100 border-2 border-black p-6 rounded-sm shadow-brutal -rotate-1 hover:rotate-0 transition-transform">
            <div className="sticky-note-tape"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brandPurple border-2 border-black rounded-full overflow-hidden">
                <img
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABILYMYdF0lbRdLTI4s4bCwJ9oYcAJZIC9fdv-fX14GDLdYD-1Yf-ZAV-l1ZFSN3sJ0jXcPukkjrsEwHNn7pcRewTpwpuO8ykRllNMZuN-vKbqeiiHeOsZyn28i1wZIZCJTSUK0aYk5AgOmJO5oU9yDE9kHFrtyCelHdISuaeepR_8B2J9YApGeKXBl1uTTD_tBXNtufM8ktzI_Qp0QgJu6rjrOEm2n10_2kJOQyUOhSdO-SF0lkwQDyoygdGS9FmO3kMhmwHum5w"
                />
              </div>
              <div>
                <p className="font-bold">Lan Hương</p>
                <p className="text-yellow-600">⭐⭐⭐⭐⭐</p>
              </div>
            </div>
            <p className="font-hand text-xl">
              "Giao diện cute xỉu, tạo động lực học bài mỗi ngày luôn. Highly
              recommend nhé!"
            </p>
          </div>
        </div>
      </section>
      <section
        className="max-w-7xl mx-auto px-4 py-20 bg-slate-50/50 border-b-2 border-black border-dashed"
        data-purpose="cta-block"
      >
        <div className="bg-brandYellow border-4 border-black rounded-3xl p-8 md:p-16 text-center shadow-brutal relative overflow-hidden">
          <div className="absolute -bottom-4 -left-4 opacity-20 pointer-events-none">
            <svg
              fill="none"
              height="200"
              viewBox="0 0 200 200"
              width="200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 180Q50 150 80 180T140 180"
                stroke="black"
                strokeLinecap="round"
                strokeWidth="8"
              ></path>
              <path
                d="M50 50L80 80M80 50L50 80"
                stroke="black"
                strokeLinecap="round"
                strokeWidth="8"
              ></path>
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading mb-6">
            Sẵn sàng nhận điểm A+ chưa?
          </h2>
          <p className="text-xl font-bold mb-10 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học sinh đang bứt phá điểm số mỗi ngày với
            GoodLearn nào.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              className="flex-1 px-6 py-4 border-2 border-black rounded-2xl font-bold shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Email của bạn là..."
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={handleClickRegister}
              className="bg-black text-white px-8 py-4 border-2 border-black rounded-2xl font-extrabold shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all"
            >
              Đăng ký ngay
            </button>
          </form>
          <p className="mt-6 font-hand italic font-bold">
            * Đăng ký ngay, nhận nhiều ưu đãi miễn phí! 🚀
          </p>
        </div>
      </section>
      <section className="px-4 py-20 flex flex-col items-center">
        <ModalReviewApp isOpen={true} />
      </section>
    </div>
  );
}

export default HomeLandingPage;
