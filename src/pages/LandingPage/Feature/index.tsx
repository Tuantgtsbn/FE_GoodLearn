import { useEffect } from 'react';
import './style.scss';

function FeatureLandingPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document
      .querySelectorAll('[data-purpose="feature-block"]')
      .forEach((el) => {
        el.classList.add(
          'transition-all',
          'duration-1000',
          'opacity-0',
          'translate-y-10'
        );
        observer.observe(el);
      });
  }, []);

  return (
    <div className="bg-graph-paper text-black font-sans selection:bg-brandYellow .mx_LandingPageFeature">
      <section className="relative overflow-hidden py-20 px-4">
        <div className="doodle-icon top-10 left-10 text-5xl opacity-80 animate-bounce">
          🚀
        </div>
        <div className="doodle-icon bottom-10 right-20 text-4xl opacity-80 rotate-12">
          ⭐
        </div>
        <div className="doodle-icon top-1/2 right-10 text-4xl opacity-80 -rotate-12">
          ✏️
        </div>
        <div className="doodle-icon bottom-20 left-20 text-4xl opacity-80">
          💡
        </div>
        <div
          className="max-w-4xl mx-auto text-center"
          data-purpose="hero-content"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-none">
            Vũ Khí Bí Mật Giúp Cậu{' '}
            <span className="bg-brandYellow px-2 border-4 border-black inline-block -rotate-1 transform">
              "Hack"
            </span>{' '}
            Điểm Số
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mb-10 max-w-2xl mx-auto">
            Khám phá các tính năng siêu ngầu của GoodLearn để biến việc học
            thành trò chơi. Không bao giờ nhàm chán, chỉ có những trải nghiệm
            học tập đỉnh cao giúp bạn bứt phá điểm số!
          </p>
          <div className="flex justify-center mb-8">
            <svg
              className="w-16 h-16 animate-pulse"
              fill="none"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 20V80M50 80L30 60M50 80L70 60"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="8"
              ></path>
            </svg>
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-32">
        <section
          className="flex flex-col md:flex-row items-center gap-12"
          data-purpose="feature-block"
          id="feature-1"
        >
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="inline-block bg-brandPurple neo-brutal-card px-4 py-1 font-black mb-4 -rotate-2">
              HỌC CÙNG AI 🤖
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Trợ lý AI thông minh, hài hước, cái gì cũng biết
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Học trên lớp không hiểu gì? Đừng lo, AI sẽ giải thích bằng ngôn
              ngữ đơn giản, ví dụ minh họa sinh động. Cần làm bài tập? AI sẽ
              hướng dẫn từng bước, còn pha trò cười để bạn không bị căng thẳng
              nữa!
            </p>
            <button className="bg-brandYellow px-6 py-2 border-2 border-black rounded-xl font-extrabold shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all active:translate-y-[2px] active:shadow-none">
              Thử AI ngay
            </button>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="bg-brandPurple neo-brutal-card p-6 aspect-square flex items-center justify-center relative overflow-hidden group">
              <div className="bg-white border-2 border-black rounded-xl p-4 w-full h-full shadow-brutal-sm flex flex-col gap-4">
                <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-sm font-bold">
                  Việt Nam có bao nhiêu dân tộc nhỉ?
                </div>
                <div className="bg-brandPurple/20 border-2 border-black rounded-lg p-3 text-sm font-bold self-end max-w-[80%]">
                  Chào cậu! Việt Nam có 54 dân tộc anh em, mỗi dân tộc đều có
                  những nét văn hóa đặc sắc riêng. Cậu muốn nghe thêm về dân tộc
                  nào không? Mình có thể kể chuyện cười về người Tày đấy! 😄
                </div>
                <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-sm font-bold">
                  Ồ, dễ hiểu quá!
                </div>
              </div>
              <div className="doodle-icon top-2 right-2 text-4xl group-hover:scale-110 transition-transform">
                ✨
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center rotate-12">
          <svg
            className="w-32 h-32"
            fill="none"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 50C20 50 80 10 180 80M180 80L160 80M180 80L180 60"
              stroke="black"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
          </svg>
        </div>
        <section
          className="flex flex-col md:flex-row items-center gap-12"
          data-purpose="feature-block"
          id="feature-2"
        >
          <div className="md:w-1/2">
            <div className="bg-brandCyan neo-brutal-card p-12 aspect-square flex items-center justify-center relative">
              <div className="relative w-48 h-64">
                <div className="absolute inset-0 bg-white border-4 border-black rounded-2xl rotate-6 shadow-brutal-sm flex items-center justify-center p-4">
                  <span className="font-black text-center">Mitosis là gì?</span>
                </div>
                <div className="absolute inset-0 bg-brandYellow border-4 border-black rounded-2xl -rotate-3 translate-x-4 shadow-brutal-sm flex items-center justify-center p-4">
                  <span className="font-black text-center">Nguyên phân 🧬</span>
                </div>
              </div>
              <div className="doodle-icon bottom-4 left-4 text-4xl">📚</div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="inline-block bg-brandCyan neo-brutal-card px-4 py-1 font-black mb-4 rotate-2">
              SIÊU TRÍ NHỚ 🧠
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Học thuộc lòng trong nháy mắt
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Quên đi cách học "vẹt" nhàm chán. AI sẽ tự động tóm tắt bài giảng
              thành bộ Flashcards sinh động. Công nghệ Spaced Repetition giúp
              bạn ghi nhớ kiến thức mãi mãi mà chỉ mất 5 phút mỗi ngày.
            </p>
            <button className="neo-brutal-btn bg-brandCyan">
              Tạo Flashcard
            </button>
          </div>
        </section>
        <div className="flex justify-center -rotate-12">
          <svg
            className="w-32 h-32"
            fill="none"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180 50C180 50 120 90 20 20M20 20L40 20M20 20L20 40"
              stroke="black"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
          </svg>
        </div>
        <section
          className="flex flex-col md:flex-row items-center gap-12"
          data-purpose="feature-block"
          id="feature-3"
        >
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="inline-block bg-brandPink neo-brutal-card px-4 py-1 font-black mb-4 -rotate-1">
              LUYỆN NÓI 🗣️
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Tám chuyện tiếng Anh không sợ quê
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Sợ nói sai bị cười? Thử ngay chế độ Voice AI để luyện giao tiếp
              1:1. Bạn chắc chắn sẽ tự tin bắn tiếng Anh như gió sau 2 tuần
              luyện tập!
            </p>
            <button className="neo-brutal-btn bg-brandPink">
              Gọi Voice AI Ngay
            </button>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="bg-brandPink neo-brutal-card p-12 aspect-square flex flex-col items-center justify-center gap-6 relative">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-black flex items-center justify-center text-6xl shadow-brutal-sm">
                🎤
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-8 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-16 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-12 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-20 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-14 bg-black rounded-full animate-bounce"></div>
              </div>
              <div className="doodle-icon top-5 right-5 text-4xl">🎵</div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <svg
            className="w-24 h-24"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 0V80M50 80L30 60M50 80L70 60"
              stroke="black"
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
          </svg>
        </div>
        <section
          className="flex flex-col md:flex-row items-center gap-12 pb-20"
          data-purpose="feature-block"
          id="feature-4"
        >
          <div className="md:w-1/2">
            <div className="bg-brandYellow neo-brutal-card p-8 aspect-square flex items-center justify-center relative">
              <div className="w-full space-y-4">
                <div className="bg-white border-2 border-black p-3 font-black rounded-lg">
                  Câu 1: Chiến dịch Điện Biên Phủ diễn ra năm nào?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border-2 border-black p-2 rounded-lg text-center font-bold hover:bg-brandCyan cursor-pointer">
                    A. 1945
                  </div>
                  <div className="bg-brandCyan border-2 border-black p-2 rounded-lg text-center font-bold relative">
                    B. 1954
                    <span className="absolute -top-2 -right-2 text-xl">✅</span>
                  </div>
                  <div className="bg-white border-2 border-black p-2 rounded-lg text-center font-bold hover:bg-brandCyan cursor-pointer">
                    C. 1975
                  </div>
                  <div className="bg-white border-2 border-black p-2 rounded-lg text-center font-bold hover:bg-brandCyan cursor-pointer">
                    D. 1930
                  </div>
                </div>
              </div>
              <div className="doodle-icon -bottom-2 -left-2 text-4xl rotate-12">
                💯
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="inline-block bg-brandYellow neo-brutal-card px-4 py-1 font-black mb-4 rotate-1">
              ĐẤU TRƯỜNG ⚔️
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Test kiến thức, kỹ năng trước giờ G
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Đấu trường thi cử giúp bạn làm quen với áp lực thời gian và câu
              hỏi khó. Cạnh tranh với bạn bè, leo lên bảng xếp hạng và chuẩn bị
              sẵn sàng cho ngày thi thật! Cày top càng nhiều, nhận phần thưởng
              càng xịn!
            </p>
            <button className="neo-brutal-btn bg-brandYellow">
              Vào Đấu Trường
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FeatureLandingPage;
