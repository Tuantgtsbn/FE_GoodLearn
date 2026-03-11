import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header
      className="max-w-7xl mx-auto flex sticky top-5 z-10 items-center justify-between bg-white border-2 border-black rounded-2xl p-4 shadow-brutal"
      data-purpose="main-nav"
    >
      <div className="flex items-center gap-2">
        <span className="font-heading text-2xl tracking-tight">GoodLearn</span>
      </div>
      <ul className="hidden md:flex gap-8 font-extrabold text-sm uppercase tracking-wide">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-brandPurple transition-colors ${isActive ? 'text-brandPurple' : ''}`
            }
          >
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feature"
            className={({ isActive }) =>
              `hover:text-brandPurple transition-colors ${isActive ? 'text-brandPurple' : ''}`
            }
          >
            Tính năng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/price"
            className={({ isActive }) =>
              `hover:text-brandPurple transition-colors ${isActive ? 'text-brandPurple' : ''}`
            }
          >
            Bảng giá
          </NavLink>
        </li>
      </ul>
      <button className="bg-brandYellow px-6 py-2 border-2 border-black rounded-xl font-extrabold shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all active:translate-y-[2px] active:shadow-none">
        Vào Học Ngay
      </button>
    </header>
  );
}
