import './style.scss';

export default function TermOfUse() {
  return (
    <main
      className="flex-grow max-w-4xl mx-auto px-4 py-12 mx_TermsOfUse mt-[50px]"
      data-purpose="terms-content"
    >
      <header className="mb-12 text-center" data-purpose="hero-header">
        <div className="inline-block bg-brandYellow brutal-border rounded-2xl px-8 py-6 shadow-brutal mb-6 transform -rotate-1">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Điều Khoản Sử Dụng
          </h1>
        </div>
        <p className="text-lg font-medium max-w-2xl mx-auto">
          Chào mừng bạn đến với GoodLearn! Vui lòng đọc kỹ các điều khoản bên
          dưới để quá trình học tập của chúng mình diễn ra suôn sẻ nhất nhé. 📝
        </p>
      </header>
      <section
        className="mb-10 bg-white brutal-border rounded-2xl p-8 shadow-brutal"
        data-purpose="section-acceptance"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✅</span>
          <h2 className="text-2xl font-bold bg-brandCyan px-2">
            1. Chấp nhận điều khoản
          </h2>
        </div>
        <div className="space-y-4 text-gray-800 leading-relaxed font-medium">
          <p>
            Bằng việc truy cập và sử dụng GoodLearn, bạn đồng ý tuân thủ các
            điều khoản này. Nếu bạn không đồng ý, rất tiếc là chúng mình không
            thể cung cấp dịch vụ cho bạn.
          </p>
          <p>
            Chúng mình có thể cập nhật điều khoản này theo thời gian và sẽ thông
            báo cho bạn trên trang web.
          </p>
        </div>
      </section>
      <section
        className="mb-10 bg-white brutal-border rounded-2xl p-8 shadow-brutal"
        data-purpose="section-ip"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💡</span>
          <h2 className="text-2xl font-bold bg-brandYellow px-2">
            2. Quyền sở hữu trí tuệ
          </h2>
        </div>
        <div className="space-y-4 text-gray-800 leading-relaxed font-medium">
          <p>
            Tất cả nội dung trên GoodLearn bao gồm bài giảng, mã nguồn, hình ảnh
            và logo đều thuộc sở hữu của chúng mình.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Bạn chỉ được sử dụng nội dung cho mục đích học tập cá nhân.</li>
            <li>
              Nghiêm cấm việc sao chép, phân phối hoặc bán lại nội dung khi chưa
              có sự đồng ý.
            </li>
          </ul>
        </div>
      </section>
      <section
        className="mb-10 bg-white brutal-border rounded-2xl p-8 shadow-brutal"
        data-purpose="section-responsibility"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✏️</span>
          <h2 className="text-2xl font-bold bg-brandCyan px-2">
            3. Trách nhiệm người dùng
          </h2>
        </div>
        <div className="space-y-4 text-gray-800 leading-relaxed font-medium">
          <p>Khi tham gia học tập cùng GoodLearn, bạn cam kết:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 brutal-border rounded-xl">
              <p className="font-bold mb-1">Cung cấp thông tin chính xác</p>
              <p className="text-sm">Đảm bảo tài khoản cá nhân được bảo mật.</p>
            </div>
            <div className="p-4 bg-gray-50 brutal-border rounded-xl">
              <p className="font-bold mb-1">Ứng xử văn minh</p>
              <p className="text-sm">
                Không sử dụng ngôn từ kích động hoặc gây hấn.
              </p>
            </div>
            <div className="p-4 bg-gray-50 brutal-border rounded-xl">
              <p className="font-bold mb-1">Sử dụng đúng mục đích</p>
              <p className="text-sm">
                Không tìm cách phá hoại hệ thống hoặc can thiệp kỹ thuật.
              </p>
            </div>
            <div className="p-4 bg-gray-50 brutal-border rounded-xl">
              <p className="font-bold mb-1">Tự chịu trách nhiệm</p>
              <p className="text-sm">
                Bảo quản tài khoản của mình, không chia sẻ cho người khác.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div
        className="text-center p-6 bg-white brutal-border rounded-2xl shadow-brutal-sm"
        data-purpose="contact-note"
      >
        <p className="font-bold italic">
          Bạn có thắc mắc? Đừng ngần ngại liên hệ qua{' '}
          <a
            className="text-blue-600 underline"
            href="mailto:support@hoctapai.edu.vn"
          >
            support@goodlearn.edu.vn
          </a>
        </p>
      </div>
    </main>
  );
}
