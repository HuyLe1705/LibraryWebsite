import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
    const location = useLocation(); // Dùng để highlight menu đang chọn

    return (
        <header className="header-container">
            <div className="header-logo">
                {/* Bạn có thể thay bằng thẻ <img> nếu có logo */}
                <Link to="/" className="logo-text">BK Library</Link>
            </div>

            <nav className="header-nav">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    Trang chủ
                </Link>
                
                <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
                    Tra cứu sách
                </Link>
                
                {/* Giả lập menu cho Admin/Thủ thư */}
                <div className="dropdown">
                    <span className="dropdown-title">Thủ thư ▼</span>
                    <div className="dropdown-content">
                        <Link to="/manage">Quản lý sách (Nhập liệu)</Link>
                        <Link to="/return">Quầy trả sách (Lưu hành)</Link>
                    </div>
                </div>
            </nav>

            <div className="header-auth">
                <button className="btn-login">Đăng nhập</button>
            </div>
        </header>
    );
};

export default Header;