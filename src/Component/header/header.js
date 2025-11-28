import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
    const location = useLocation(); // Dùng để highlight menu đang chọn

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">
                    {/* Lưu ý: Đảm bảo bạn có file ảnh này trong thư mục public/Image */}
                    <img src="/Image/logolib.png" alt="BK Library" />
                    <span>BK Library</span>
                </Link>
            </div>

            <nav className="header-nav">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    Trang chủ
                </Link>
                <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
                    Tra cứu sách
                </Link>
                
                {/* Đã thêm class active để highlight khi đang ở trang này */}
                <Link to="/manage-books" className={location.pathname === '/manage-books' ? 'active' : ''}>
                    Quản lý sách (Nhập liệu)
                </Link>
                <Link to="/return" className={location.pathname === '/return' ? 'active' : ''}>
                    Quầy trả sách (Lưu hành)
                </Link>
            </nav>

            <div className="header-right">
                {/* ĐÃ SỬA: Thay chữ Đăng nhập thành Admin */}
                <button className="btn-login">Admin</button>
            </div>
        </header>
    );
};

export default Header;