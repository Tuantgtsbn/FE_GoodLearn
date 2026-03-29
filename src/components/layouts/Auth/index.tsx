import React from 'react';
import './style.scss';
import SideImage from '@/assets/images/SideAuth.png';

interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-center items-center w-full mx_AuthPage">
      <div className="hidden md:flex md:w-1/2 graph-paper items-center justify-center p-12 relative overflow-hidden border-r border-zinc-200 min-h-screen">
        <div className="relative z-10 max-w-lg w-full">
          <img
            alt="AI Student Mascot"
            className="w-full h-auto drop-shadow-2xl rounded-[20px]"
            src={SideImage}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white max-md:h-full">
        <div className="w-full max-w-[600px]">{children}</div>
      </div>
    </div>
  );
}
