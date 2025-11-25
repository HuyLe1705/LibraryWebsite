import React, { useState } from 'react';
import './BookCatalog.css';

const BookCatalog = () => {
    const [keyword, setKeyword] = useState('');
    const [books, setBooks] = useState([]);

    const handleSearch = async () => {
        console.log("Đang tìm kiếm với từ khóa:", keyword); // 1. Log kiểm tra nút bấm
        try {
            const response = await fetch(`http://localhost:5000/api/books/search?keyword=${keyword}`);
            
            // Kiểm tra nếu Server lỗi
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Dữ liệu nhận được từ Server:", data); // 2. Log kiểm tra dữ liệu về chưa

            setBooks(data); 
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Có lỗi xảy ra, vui lòng bật F12 xem chi tiết!");
        }
    };

    return (
        <div className="catalog-container">
            <h2>Tra cứu Tài liệu</h2>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Nhập tên sách hoặc tác giả..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>

            <table className="book-table">
                <thead>
                    <tr>
                        <th>Mã TB</th>
                        <th>Tựa đề</th>
                        <th>Tác giả</th>
                        <th>Sẵn có</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Kiểm tra nếu không có sách nào */}
                    {books.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center'}}>Chưa có dữ liệu</td>
                        </tr>
                    )}

                    {books.map((book) => (
                        <tr key={book.RecordID}>
                            <td>{book.RecordID}</td>
                            <td>{book.Title}</td>
                            {/* CHÚ Ý: Sửa book.Author thành book.AuthorName */}
                            <td>{book.Publisher}</td> 
                            <td>{book.AvailableCopies}</td>
                            <td>
                                <span className={book.AvailableCopies > 0 ? "badge-avail" : "badge-out"}>
                                    {book.AvailableCopies > 0 ? "Có thể mượn" : "Hết sách"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookCatalog;