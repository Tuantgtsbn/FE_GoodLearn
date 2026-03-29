import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để lần render tiếp theo hiển thị UI thay thế
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Bạn có thể gửi log lỗi ở đây (ví dụ: Sentry, LogRocket)
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">
            {/* Icon cảnh báo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đã xảy ra sự cố
            </h1>
            <p className="text-gray-600 mb-6">
              Ứng dụng gặp lỗi không mong muốn. Đừng lo lắng, bạn có thể thử các
              tùy chọn bên dưới.
            </p>

            {/* Thông tin lỗi (Chi tiết kỹ thuật) */}
            <div className="text-left bg-gray-100 rounded-lg p-4 mb-8 max-h-40 overflow-auto border border-gray-200">
              <p className="text-xs font-mono text-red-700 break-words">
                <strong>Error:</strong>{' '}
                {this.state.error?.message || 'Unknown Error'}
              </p>
            </div>

            {/* Các nút điều hướng */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRefresh}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200"
              >
                Thử tải lại trang
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl border border-gray-300 transition-colors duration-200"
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
