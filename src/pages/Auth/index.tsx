import React from 'react';
import './style.scss';
import ICFavicon from '@/components/Icon/ICFavicon';
import ICGoogle from '@/components/Icon/ICGoogle';

const AuthPage: React.FC = () => {
  return (
    <div className="gl-auth-page">
      <div className="gl-auth-backdrop" />
      <div className="gl-auth-card">
        <div className="gl-auth-header">
          <div className="gl-logo">
            <ICFavicon />
          </div>
          <h1 className="gl-title">HỌC TẬP AI</h1>
          <p className="gl-sub">Gia sư thông minh của riêng bạn</p>
        </div>

        <div className="gl-tabs">
          <button className="gl-tab active">Đăng nhập</button>
          <button className="gl-tab">Đăng ký</button>
        </div>

        <form className="gl-form" onSubmit={(e) => e.preventDefault()}>
          <label className="gl-label">Email học sinh</label>
          <div className="gl-input">
            <input placeholder="ten-ban@truonghoc.edu" />
          </div>

          <div className="gl-password-row">
            <label className="gl-label">Mật khẩu</label>
            <a className="gl-forgot">Quên?</a>
          </div>
          <div className="gl-input">
            <input placeholder="••••••••" />
          </div>

          <div className="gl-remember">
            <label>
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
          </div>

          <button className="gl-primary">VÀO HỌC THÔI 🚀</button>

          <div className="gl-divider">
            <span>Hoặc dùng</span>
          </div>

          <button className="gl-social">
            <ICGoogle />
            <span>Google</span>
          </button>
        </form>

        <div className="gl-footer">
          <p>
            Chưa có tài khoản?{' '}
            <span className="gl-link">Tạo tài khoản mới</span>
          </p>
          <div className="gl-links">
            <span>Bảo mật</span>
            <span>•</span>
            <span>Điều khoản</span>
            <span>•</span>
            <span>Liên hệ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
