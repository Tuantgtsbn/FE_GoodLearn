import React from 'react';

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical'; // Mặc định là horizontal
  contentPosition?: 'left' | 'center' | 'right';
}

const Divider: React.FC<DividerProps> = ({
  children,
  className = '',
  orientation = 'horizontal',
  contentPosition = 'center',
}) => {
  // Nếu là đường dọc (Vertical)
  if (orientation === 'vertical') {
    return (
      <div
        className={`inline-block h-full w-[1px] bg-gray-200 self-stretch mx-4 ${className}`}
        role="separator"
      />
    );
  }

  // Nếu là đường ngang (Horizontal)
  return (
    <div className={`flex items-center my-4 ${className}`} role="separator">
      {/* Đường kẻ bên trái */}
      <div
        className={`flex-grow border-t border-gray-300 ${
          contentPosition === 'left' ? 'max-w-[2rem]' : ''
        }`}
      />

      {/* Nội dung ở giữa */}
      {children && (
        <span className="mx-4 text-sm font-medium text-gray-500 whitespace-nowrap">
          {children}
        </span>
      )}

      {/* Đường kẻ bên phải */}
      <div
        className={`flex-grow border-t border-gray-300 ${
          contentPosition === 'right' ? 'max-w-[2rem]' : ''
        }`}
      />
    </div>
  );
};

export default Divider;
