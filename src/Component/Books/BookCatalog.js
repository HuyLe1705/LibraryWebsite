// import React, { useState } from 'react';
// import './BookCatalog.css';

// const BookCatalog = () => {
//     const [keyword, setKeyword] = useState('');
//     const [books, setBooks] = useState([]);

//     const handleSearch = async () => {
//         console.log("Đang tìm kiếm với từ khóa:", keyword); // 1. Log kiểm tra nút bấm
//         try {
//             const response = await fetch(`http://localhost:5000/api/books/search?keyword=${keyword}`);

//             // Kiểm tra nếu Server lỗi
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Dữ liệu nhận được từ Server:", data); // 2. Log kiểm tra dữ liệu về chưa

//             setBooks(data);
//         } catch (error) {
//             console.error("Lỗi khi gọi API:", error);
//             alert("Có lỗi xảy ra, vui lòng bật F12 xem chi tiết!");
//         }
//     };

//     return (
//         <div className="catalog-container">
//             <h2>Tra cứu Tài liệu</h2>
//             <div className="search-bar">
//                 <input
//                     type="text"
//                     placeholder="Nhập tên sách hoặc tác giả..."
//                     value={keyword}
//                     onChange={(e) => setKeyword(e.target.value)}
//                 />
//                 <button onClick={handleSearch}>Tìm kiếm</button>
//             </div>

//             <table className="book-table">
//                 <thead>
//                     <tr>
//                         <th>Mã TB</th>
//                         <th>Tựa đề</th>
//                         <th>Tác giả</th>
//                         <th>Sẵn có</th>
//                         <th>Trạng thái</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {/* Kiểm tra nếu không có sách nào */}
//                     {books.length === 0 && (
//                         <tr>
//                             <td colSpan="5" style={{textAlign: 'center'}}>Chưa có dữ liệu</td>
//                         </tr>
//                     )}

//                     {books.map((book) => (
//                         <tr key={book.RecordID}>
//                             <td>{book.RecordID}</td>
//                             <td>{book.Title}</td>
//                             {/* CHÚ Ý: Sửa book.Author thành book.AuthorName */}
//                             <td>{book.Publisher}</td>
//                             <td>{book.AvailableCopies}</td>
//                             <td>
//                                 <span className={book.AvailableCopies > 0 ? "badge-avail" : "badge-out"}>
//                                     {book.AvailableCopies > 0 ? "Có thể mượn" : "Hết sách"}
//                                 </span>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default BookCatalog;

import React, { useState, useEffect } from "react";

import "./BookCatalog.css";
import cssStyles from "./BookCatalog.css?inline";

const EditBookModal = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    year: "",
    refBookID: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.Title || "",
        publisher: book.Publisher || "",
        year: book.Year || "",
        refBookID: book.RefBookID || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(book.RecordID, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sửa thông tin sách: {book?.RecordID}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tựa đề sách (*)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nhà xuất bản</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Năm xuất bản (*)</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mã sách tham khảo (RefBookID)</label>
            <input
              type="text"
              name="refBookID"
              value={formData.refBookID}
              onChange={handleChange}
              placeholder="Ví dụ: R001 (Nếu có)"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookCatalog = () => {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const fetchBooks = async (searchKey = "") => {
    console.log("Đang tải dữ liệu với từ khóa:", searchKey);
    try {
      // Nếu searchKey rỗng, API server sẽ tự trả về tất cả (do logic server đã viết trước đó)
      const response = await fetch(
        `http://localhost:5000/api/books/search?keyword=${searchKey}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchBooks(""); // Gọi hàm với từ khóa rỗng để lấy tất cả
  }, []);

  const handleSearch = () => {
    fetchBooks(keyword);
  };

  // --- 2. XỬ LÝ MỞ MODAL SỬA ---
  const handleEditClick = (book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  // --- 3. GỌI API UPDATE ---
  const handleSaveUpdate = async (recordID, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${recordID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }

      alert("Cập nhật thành công!");
      setIsModalOpen(false); // Đóng modal
      handleSearch(); // Load lại danh sách
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  // --- 4. XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa sách ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const txt = await response.text();
          throw new Error(txt);
        }
        alert("Đã xóa thành công!");
        handleSearch();
      } catch (err) {
        alert("Không thể xóa: " + err.message);
      }
    }
  };

  return (
    <>
      {/* Inject CSS vào trong trang */}
      <style>{cssStyles}</style>

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
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            )}

            {books.map((book) => (
              <tr key={book.RecordID}>
                <td>{book.RecordID}</td>
                <td>{book.Title}</td>
                <td>{book.Publisher}</td>
                <td>{book.AvailableCopies}</td>
                <td>
                  <span
                    className={
                      book.AvailableCopies > 0 ? "badge-avail" : "badge-out"
                    }
                  >
                    {book.AvailableCopies > 0 ? "Có thể mượn" : "Hết sách"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(book)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book.RecordID)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- HIỂN THỊ MODAL --- */}
        <EditBookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={currentBook}
          onSave={handleSaveUpdate}
        />
      </div>
    </>
  );
};

export default BookCatalog;
