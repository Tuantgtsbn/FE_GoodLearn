import ICLogo from '@/components/Icon/ICLogo';
import { useAuthAction } from '@/hooks/useAuthAction';
import { Drawer, useMediaQuery } from '@mui/material';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const handleClickLogin = useAuthAction(() => {
    navigate('/app');
  });
  const isMobile = useMediaQuery('(max-width:768px)');
  const [openDrawer, setOpenDrawer] = useState(false);

  const menus = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tính năng', path: '/feature' },
    { name: 'Bảng giá', path: '/price' },
    { name: 'Hướng dẫn sử dụng', path: '/usage' },
  ];

  return (
    <header
      className="max-w-[95%] lg:max-w-7xl mx-auto flex gap-4 sticky top-5 z-10 items-center justify-between bg-white border-2 border-black rounded-2xl p-4 shadow-brutal"
      data-purpose="main-nav"
    >
      <div
        className="flex gap-3 items-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <ICLogo />
        <p className="text-xl font-bold">GoodLearn</p>
      </div>
      <ul className="hidden md:flex gap-8 font-extrabold text-sm uppercase tracking-wide">
        {menus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              title={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `hover:text-brandPurple transition-colors ${isActive ? 'text-brandPurple' : ''}`
              }
            >
              {menu.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <button
          onClick={handleClickLogin}
          className="bg-brandYellow px-3 md:px-6 py-2 border-2 border-black rounded-xl font-extrabold shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all active:translate-y-[2px] active:shadow-none"
        >
          Vào Học Ngay
        </button>
        {isMobile && (
          <button
            className="bg-brandYellow p-2 border-2 border-black rounded-xl font-extrabold shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all active:translate-y-[2px] active:shadow-none"
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: 256 } }}
      >
        <div className="p-5">
          <ul className="flex flex-col gap-8 font-extrabold text-sm uppercase tracking-wide">
            {menus.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  onClick={() => setOpenDrawer(false)}
                  title={menu.name}
                  to={menu.path}
                  className={({ isActive }) =>
                    `hover:text-brandPurple truncate transition-colors ${isActive ? 'text-brandPurple' : ''}`
                  }
                >
                  {menu.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </Drawer>
    </header>
  );
}
