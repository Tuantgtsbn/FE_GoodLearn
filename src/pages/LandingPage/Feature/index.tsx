import './style.scss';

function FeatureLandingPage() {
  return (
    <div className="bg-graph-paper text-black font-sans selection:bg-brandYellow featureLandingPage-wrapper">
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
            Khám phá các tính năng siêu ngầu của HọcTậpAI để biến việc học thành
            trò chơi. Không lo bài khó, chỉ lo không có đối thủ!
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="8"
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
              Hỏi gì đáp nấy, không quạu bao giờ
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Gặp bài Toán "khoai", hay Lý/Hóa đau đầu? Gửi đề bài cho AI Tutor,
              bạn sẽ nhận được gợi ý từng bước cực dễ hiểu. Không chỉ đưa kết
              quả, HọcTậpAI dạy bạn cách tư duy để lần sau tự giải được luôn!
            </p>
            <button className="neo-brutal-btn bg-brandYellow">
              Thử Chat Ngay
            </button>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="bg-brandPurple neo-brutal-card p-6 aspect-square flex items-center justify-center relative overflow-hidden group">
              <div className="bg-white border-2 border-black rounded-xl p-4 w-full h-full shadow-brutal-sm flex flex-col gap-4">
                <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-sm font-bold">
                  Làm sao để tính đạo hàm hàm số này ạ?
                </div>
                <div className="bg-brandPurple/20 border-2 border-black rounded-lg p-3 text-sm font-bold self-end max-w-[80%]">
                  Chào cậu! Đầu tiên ta áp dụng quy tắc đạo hàm hợp... 📝
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
        <div className="flex justify-center -my-16 rotate-12">
          <svg
            className="w-32 h-32"
            fill="none"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 50C20 50 80 10 180 80M180 80L160 80M180 80L180 60"
              stroke="black"
              stroke-linecap="round"
              stroke-width="4"
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
        <div className="flex justify-center -my-16 -rotate-12">
          <svg
            className="w-32 h-32"
            fill="none"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180 50C180 50 120 90 20 20M20 20L40 20M20 20L20 40"
              stroke="black"
              stroke-linecap="round"
              stroke-width="4"
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
              Sợ nói sai bị cười? Gọi ngay cho AI tutor để luyện giao tiếp 1:1.
              AI sẽ sửa phát âm, gợi ý từ vựng "xịn xò" như người bản xứ. Tự tin
              bắn tiếng Anh như gió sau 2 tuần luyện tập!
            </p>
            <button className="neo-brutal-btn bg-brandPink">Gọi AI Ngay</button>
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
        <div className="flex justify-center -my-16">
          <svg
            className="w-24 h-24"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 0V80M50 80L30 60M50 80L70 60"
              stroke="black"
              stroke-linecap="round"
              stroke-width="4"
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
              Test nhân phẩm trước giờ G
            </h2>
            <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
              Tự tạo đề ôn tập 15 phút từ chính nội dung bạn vừa chat với AI.
              Đối đầu cùng bạn bè để xem ai là "trùm" kiến thức. Cày Rank mệt
              nghỉ, nhận quà cực hịn!
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
