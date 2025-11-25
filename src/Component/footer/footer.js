import React from 'react';
import './footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Đại học Quốc gia TP.HCM</h3>
                    <h4>Trường Đại học Bách Khoa</h4>
                    <p>Khoa Khoa học và Kỹ thuật Máy tính</p>
                </div>
                
                <div className="footer-section">
                    <h4>Liên hệ</h4>
                    <p>Địa chỉ: 268 Lý Thường Kiệt, Quận 10, TP.HCM</p>
                    <p>Email: library@hcmut.edu.vn</p>
                </div>

                <div className="footer-section">
                    <h4>Liên kết nhanh</h4>
                    <ul>
                        <li><a href="#">Cổng thông tin đào tạo</a></li>
                        <li><a href="#">Quy định mượn trả</a></li>
                        <li><a href="#">Hỗ trợ sinh viên</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2025 Library Management System - Group 05 [L08]</p>
            </div>
        </footer>
    );
};

export default Footer;