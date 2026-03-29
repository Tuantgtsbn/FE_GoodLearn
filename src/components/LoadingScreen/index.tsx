import clsx from 'clsx';

interface ILoadingScreenProps {
  className?: string;
}

const LoadingScreen = ({ className }: ILoadingScreenProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center w-screen h-screen gap-4 bg-white',
        className
      )}
    >
      {/* Logo */}
      <img
        src="/favicon.svg" // đổi theo logo của bạn
        alt="Logo"
        className="w-16 h-16 object-contain"
      />

      {/* Text */}
      <p className="text-sm text-gray-500 animate-pulse">Đang tải dữ liệu...</p>

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;
