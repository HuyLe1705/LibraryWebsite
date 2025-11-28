import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

const Homepage = () => {
    // Dữ liệu sách nổi bật (mô phỏng từ hình ảnh bạn cung cấp)
    const featuredBooks = [
        {
            id: 'R002',
            title: 'Bí mật tư duy triệu phú',
            author: 'Nguyễn Văn A',
            publisher: 'NXB Tổng hợp HCM',
            year: 2018,
            cover: 'https://pos.nvncdn.com/fd5775-40602/ps/20240507_adVLqA6Pa4.png?v=1715067998', // Ảnh minh họa
        },
        {
            id: 'R005',
            title: 'Dế Mèn Phiêu Lưu Ký',
            author: 'Hoàng Thủy E',
            publisher: 'NXB Kim Đồng',
            year: 2010,
            cover: 'https://lh4.googleusercontent.com/proxy/sGzQRruxLVpyc8Y0pnaZNiZnXyKtOniAsszYem00yo3PRcaZCRkCVqUWYcJKKtbZmQcNaO_E7UJ7fLkL5XReHpCxqLpDqGAz_bj_D-KFpY8Xlc7Bl5ITr76OECvifxMOpQmd8U7KCZTfsSFtS44?w=500&q=80',
        },
        {
            id: 'R001',
            title: 'Lập trình C# cơ bản',
            author: 'Lê Văn C',
            publisher: 'NXB Trẻ',
            year: 2022,
            cover: 'https://images.nxbbachkhoa.vn/Picture/2024/5/8/image-20240508180323597.jpg',
        },
        {
            id: 'R004',
            title: 'Lập trình Web với ASP.NET',
            author: 'Lê Văn C',
            publisher: 'NXB Trẻ',
            year: 2023,
            cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFou0tbic6lbAKcsgZGu1q07yUMW2HV7f4g&s',
        },
        {
            id: 'R003',
            title: 'Sherlock Holmes',
            author: 'Trần Thị B',
            publisher: 'NXB Kim Đồng',
            year: 2015,
            cover: 'https://m.media-amazon.com/images/I/91dDv9WOcFL._AC_UF1000,1000_QL80_.jpg',
        }
    ];

    return (
        <div className="homepage-container">
            {/* Hero Banner */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Thư viện Đại học Bách Khoa</h1>
                    <p>Khơi nguồn tri thức - Kiến tạo tương lai</p>
                    <Link to="/search" className="btn-primary">Tra cứu sách ngay</Link>
                </div>
            </section>

            {/* Sách nổi bật */}
            <section className="featured-books-section">
                <div className="section-header">
                    <h2>Sách Nổi Bật</h2>
                    <p>Những cuốn sách được mượn nhiều nhất trong tháng</p>
                </div>
                
                <div className="book-grid">
                    {featuredBooks.map((book) => (
                        <div key={book.id} className="book-card">
                            <div className="book-cover">
                                <img src={book.cover} alt={book.title} />
                                <div className="book-badge">{book.year}</div>
                            </div>
                            <div className="book-info">
                                <h3 title={book.title}>{book.title}</h3>
                                <p className="book-author">Tác giả: {book.author}</p>
                                <p className="book-publisher">{book.publisher}</p>
                               
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Các tính năng nổi bật */}
            <section className="features-section">
                <div className="feature-card">
                    <span className="feature-icon">📚</span>
                    <h3>Kho tài liệu khổng lồ</h3>
                    <p>Truy cập hàng ngàn đầu sách, giáo trình và tài liệu tham khảo chất lượng cao.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">💻</span>
                    <h3>Tra cứu trực tuyến</h3>
                    <p>Hệ thống tìm kiếm thông minh giúp bạn tìm thấy tài liệu mong muốn chỉ trong vài giây.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🏢</span>
                    <h3>Không gian hiện đại</h3>
                    <p>Môi trường học tập yên tĩnh, trang thiết bị tiện nghi phục vụ tối đa cho sinh viên.</p>
                </div>
            </section>

            {/* Thông tin hoạt động */}
            <section className="info-section">
                <div className="info-container">
                    <h2>Thông tin hoạt động</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <h4>Giờ mở cửa</h4>
                            <p>Thứ 2 - Thứ 6: 7:00 - 21:00</p>
                            <p>Thứ 7: 7:00 - 17:00</p>
                        </div>
                        <div className="info-item">
                            <h4>Địa chỉ</h4>
                            <p>Tòa nhà H1, H2</p>
                            <p>Cơ sở Lý Thường Kiệt</p>
                        </div>
                        <div className="info-item">
                            <h4>Liên hệ</h4>
                            <p>(028) 3864 7256</p>
                            <p>library@hcmut.edu.vn</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Homepage;