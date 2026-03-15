import './style.scss';

export default function ContactPage() {
  return (
    <>
      <header className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="grid-pattern absolute inset-0 -z-10"></div>
        <div className="container mx-auto text-center relative">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 bg-white border-4 border-black p-6 rounded-brutal shadow-brutal relative">
              Liên Hệ <span className="text-brandCyan">Ngay!</span>
            </h1>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-brandYellow border-4 border-black rounded-full z-20 flex items-center justify-center font-black animate-bounce">
              !
            </div>
          </div>
          <p className="mt-8 text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
            Có câu hỏi nào không? Đừng ngần ngại, đội ngũ GoodLearn luôn sẵn
            sàng hỗ trợ bạn 24/7!
          </p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
              <div className="bg-brandCyan border-4 border-black p-8 rounded-brutal shadow-brutal h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white border-4 border-black p-3 rounded-brutal shadow-brutal-sm">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black uppercase">Kết nối</h2>
                </div>
                <div className="space-y-8">
                  <div className="group">
                    <p className="text-sm font-black uppercase tracking-widest text-black/60 mb-1">
                      Email của chúng tớ
                    </p>
                    <p className="text-2xl font-black break-all group-hover:underline cursor-pointer">
                      support@goodlearn.edu.vn
                    </p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-black uppercase tracking-widest text-black/60 mb-1">
                      Đường dây nóng
                    </p>
                    <p className="text-2xl font-black group-hover:underline cursor-pointer">
                      1900-123-456
                    </p>
                  </div>
                  <div className="group">
                    <p className="text-sm font-black uppercase tracking-widest text-black/60 mb-1">
                      Văn phòng
                    </p>
                    <p className="text-2xl font-black leading-tight group-hover:underline cursor-pointer">
                      Tòa nhà Trí Tuệ, <br />
                      Quận Cầu Giấy, Hà Nội
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <section
                className="bg-white border-4 border-black p-8 md:p-10 rounded-brutal shadow-brutal"
                data-purpose="contact-form-container"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="bg-brandYellow border-4 border-black p-3 rounded-brutal shadow-brutal-sm">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-4xl font-black uppercase">
                    Gửi tin nhắn
                  </h2>
                </div>
                <form action="#" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <label
                        className="text-lg font-black mb-3 uppercase tracking-tight"
                        htmlFor="name"
                      >
                        Tên của bạn
                      </label>
                      <input
                        className="border-4 border-black p-4 rounded-brutal focus:ring-0 focus:bg-brandYellow/10 transition-all shadow-brutal-sm outline-none font-bold placeholder:text-black/30"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="text-lg font-black mb-3 uppercase tracking-tight"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="border-4 border-black p-4 rounded-brutal focus:ring-0 focus:bg-brutal-blue/10 transition-all shadow-brutal-sm outline-none font-bold placeholder:text-black/30"
                        id="email"
                        placeholder="example@email.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="text-lg font-black mb-3 uppercase tracking-tight"
                      htmlFor="message"
                    >
                      Lời nhắn cho chúng tớ
                    </label>
                    <textarea
                      className="border-4 border-black p-4 rounded-brutal focus:ring-0 focus:bg-brandYellow/10 transition-all shadow-brutal-sm outline-none font-bold placeholder:text-black/30 min-h-[160px]"
                      id="message"
                      placeholder="Bạn muốn hỏi gì về AI?"
                      rows={5}
                    ></textarea>
                  </div>
                  <button
                    className="w-full bg-brandYellow border-4 border-black py-5 rounded-brutal text-2xl font-black shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all uppercase tracking-wider"
                    type="submit"
                  >
                    Gửi
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
