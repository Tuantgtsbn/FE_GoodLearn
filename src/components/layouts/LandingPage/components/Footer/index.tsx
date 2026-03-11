export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div data-purpose="footer-brand">
          <div className="text-2xl font-black italic neo-border bg-neo-yellow text-black px-4 py-1 rounded-lg inline-block mb-4">
            HọcTậpAI
          </div>
          <p className="font-bold text-gray-400">
            Học tập thông minh hơn cùng công nghệ AI hàng đầu.
          </p>
        </div>
        <div className="flex gap-8 font-bold">
          <a className="hover:text-neo-cyan transition-colors" href="#">
            Điều khoản
          </a>
          <a className="hover:text-neo-pink transition-colors" href="#">
            Bảo mật
          </a>
          <a className="hover:text-neo-yellow transition-colors" href="#">
            Liên hệ
          </a>
        </div>
        <div className="text-gray-500 font-bold">
          © 2024 HọcTậpAI. Made with ❤️ for GenZ.
        </div>
      </div>
    </footer>
  );
}
