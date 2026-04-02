import { useNavigate } from 'react-router-dom';
import './style.scss';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="mx_Privacy">
      <header className="max-w-4xl mx-auto mt-12 mb-16 px-4 text-center">
        <div className="inline-block bg-neo-purple brutal-border px-4 py-1 rounded-full mb-6 font-bold uppercase tracking-widest text-sm brutal-shadow">
          Quyền riêng tư là trên hết
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Chính Sách{' '}
          <span className="bg-neo-pink brutal-border px-4 py-2">Bảo Mật</span>
        </h1>
        <p className="text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Tại GoodLearn, chúng mình cam kết bảo vệ dữ liệu của các bạn học sinh
          như cách các bạn bảo vệ điểm số của mình vậy!
        </p>
      </header>
      <main className="max-w-4xl mx-auto px-4 pb-24 space-y-12">
        <section
          className="bg-white brutal-border rounded-2xl p-8 brutal-shadow relative overflow-hidden"
          data-purpose="privacy-section"
        >
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-neo-pink rounded-full brutal-border flex items-center justify-center -rotate-12">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
              01
            </span>
            Thông tin chúng tôi thu thập
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              Để mang lại trải nghiệm học tập tốt nhất, GoodLearn chỉ thu thập
              những thông tin thực sự cần thiết:
            </p>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span>
                  <strong>Thông tin tài khoản:</strong> Tên đăng nhập, email để
                  bạn có thể lưu trữ tiến độ học tập.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span>
                  <strong>Nội dung học tập:</strong> Các câu hỏi bạn gửi cho AI
                  để chúng mình cải thiện độ chính xác của câu trả lời.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span>
                  <strong>Dữ liệu thiết bị:</strong> Thông tin cơ bản về trình
                  duyệt để giao diện luôn hiển thị đẹp nhất trên máy của bạn.
                </span>
              </li>
            </ul>
          </div>
        </section>
        <section
          className=" bg-white brutal-border rounded-2xl p-8 brutal-shadow relative"
          data-purpose="privacy-section"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
              02
            </span>
            Cách chúng tôi sử dụng thông tin
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neo-purple/30 p-6 rounded-xl brutal-border">
              <h3 className="font-bold text-xl mb-2">Cá nhân hóa</h3>
              <p>
                Giúp AI hiểu được phong cách học tập của bạn để đưa ra gợi ý bài
                giảng phù hợp nhất.
              </p>
            </div>
            <div className="bg-neo-pink/30 p-6 rounded-xl brutal-border">
              <h3 className="font-bold text-xl mb-2">Cải thiện dịch vụ</h3>
              <p>
                Phát hiện lỗi và nâng cấp các tính năng giải bài tập thông minh
                hơn mỗi ngày.
              </p>
            </div>
          </div>
          <p className="mt-6 font-medium italic">
            Chúng mình cam kết không bao giờ bán dữ liệu của bạn cho bất kỳ bên
            thứ ba nào!
          </p>
        </section>
        <section
          className="bg-white brutal-border rounded-2xl p-8 brutal-shadow relative overflow-hidden"
          data-purpose="privacy-section"
        >
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-neo-purple rounded-2xl brutal-border flex items-center justify-center rotate-12">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
              03
            </span>
            Bảo mật dữ liệu
          </h2>
          <div className="space-y-4 text-lg">
            <p>Hệ thống của chúng mình sử dụng các lớp bảo mật mạnh mẽ:</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-black text-white px-4 py-2 rounded-lg font-bold">
                Mã hóa SSL
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg font-bold">
                Xác thực 2 lớp
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg font-bold">
                Giám sát 24/7
              </div>
            </div>
            <p className="mt-4 pr-15">
              Nếu có bất kỳ sự cố nào xảy ra, chúng mình sẽ thông báo ngay lập
              tức cho bạn qua email trong vòng 24 giờ.
            </p>
          </div>
        </section>
        <section
          className="bg-neo-pink brutal-border rounded-2xl p-10 brutal-shadow text-center"
          data-purpose="contact-card"
        >
          <h2 className="text-4xl font-bold mb-4">Bạn còn thắc mắc?</h2>
          <p className="text-xl mb-8 font-medium">
            Đừng ngần ngại gửi thư cho chúng mình nếu bạn cần giải đáp thêm về
            bảo mật.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="inline-block bg-white brutal-border px-8 py-4 rounded-2xl font-black text-2xl brutal-shadow brutal-shadow-hover transition-all"
          >
            Gửi Email Ngay!
          </button>
        </section>
      </main>
    </div>
  );
}
