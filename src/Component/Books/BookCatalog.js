import React, { useState, useEffect, useRef } from "react";
import cssStyles from "./BookCatalog.css?inline";

const Icons = {
  Search: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Filter: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Refresh: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6"></path>
      <path d="M1 20v-6h6"></path>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
    </svg>
  ),
  Edit: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
};

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Sửa thông tin sách</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(book.RecordID, formData);
          }}
        >
          <div className="form-group">
            <label>Tựa đề sách (*)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Nhà xuất bản</label>
            <input
              type="text"
              value={formData.publisher}
              onChange={(e) =>
                setFormData({ ...formData, publisher: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Năm xuất bản (*)</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Mã sách tham khảo (RefID)</label>
            <input
              type="text"
              value={formData.refBookID}
              onChange={(e) =>
                setFormData({ ...formData, refBookID: e.target.value })
              }
              placeholder="VD: R001"
            />
          </div>
          <div className="modal-footer">
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

  // State Filter
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const filterRef = useRef(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    // 1. Lấy danh sách thể loại để hiện trong Dropdown
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));

    // 2. Lấy tất cả sách ban đầu
    fetchBooks("");

    // 3. Xử lý click ra ngoài để đóng dropdown
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC GỌI API ---
  const fetchBooks = async (searchKey) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/search?keyword=${searchKey}`
      );
      if (!response.ok) throw new Error("Lỗi kết nối");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSearch = () => {
    setCurrentFilter(null); // Reset filter khi tìm kiếm
    fetchBooks(keyword);
  };

  // Logic gọi API Lọc riêng biệt
  const handleFilterByCategory = async (categoryName) => {
    setCurrentFilter(categoryName);
    setIsFilterOpen(false);
    setKeyword("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/books/filter-by-category?category=${encodeURIComponent(
          categoryName
        )}`
      );
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setCurrentFilter(null);
    fetchBooks(""); // Load lại tất cả
  };

  // --- LOGIC CRUD ---
  const handleEditClick = (book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (recordID, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${recordID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error(await response.text());

      alert("Cập nhật thành công!");
      setIsModalOpen(false);

      // Load lại dữ liệu theo trạng thái hiện tại (Filter hay Search)
      if (currentFilter) handleFilterByCategory(currentFilter);
      else fetchBooks(keyword);
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa sách ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(await response.text());

        alert("Đã xóa thành công!");
        if (currentFilter) handleFilterByCategory(currentFilter);
        else fetchBooks(keyword);
      } catch (err) {
        alert("Không thể xóa: " + err.message);
      }
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div className="catalog-container">
        <h2>Tra cứu Tài liệu</h2>

        {/* THANH CÔNG CỤ (SEARCH + FILTER) */}
        <div className="toolbar">
          {/* 1. Ô Tìm kiếm */}
          <div className="search-wrapper">
            <Icons.Search />
            <input
              type="text"
              placeholder="Nhập tên sách..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>
            Tìm kiếm
          </button>

          {/* 2. Nút Filter Dropdown */}
          <div className="filter-wrapper" ref={filterRef}>
            <button
              className={`btn-filter ${currentFilter ? "active" : ""}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Icons.Filter />
              {currentFilter ? currentFilter : "Lọc Thể Loại"}
            </button>

            {isFilterOpen && (
              <div className="dropdown-menu">
                <div
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#8d99ae",
                    textTransform: "uppercase",
                  }}
                >
                  Chọn thể loại
                </div>
                <div className="dropdown-item" onClick={handleReset}>
                  <span>Tất cả</span>
                  {!currentFilter && <Icons.Check />}
                </div>
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`dropdown-item ${
                      currentFilter === cat.Name ? "selected" : ""
                    }`}
                    onClick={() => handleFilterByCategory(cat.Name)}
                  >
                    <span>{cat.Name}</span>
                    {currentFilter === cat.Name && <Icons.Check />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Nút Reset */}
          <button
            className="btn-reset"
            onClick={handleReset}
            title="Làm mới dữ liệu"
          >
            <Icons.Refresh />
          </button>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="table-container">
          <table className="book-table">
            <thead>
              <tr>
                <th>Mã TB</th>
                <th>Thông tin Sách</th>
                <th>Tác giả / NXB</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.RecordID}>
                    <td style={{ fontWeight: "bold" }}>{book.RecordID}</td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#2b2d42" }}>
                        {book.Title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#8d99ae" }}>
                        Năm: {book.Year}
                      </div>
                    </td>
                    <td>
                      <div>{book.AuthorName || "---"}</div>
                      <div style={{ fontSize: "13px", color: "#8d99ae" }}>
                        {book.Publisher}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          book.AvailableCopies > 0
                            ? "status-avail"
                            : "status-out"
                        }`}
                      >
                        {book.AvailableCopies > 0
                          ? `Sẵn có: ${book.AvailableCopies}`
                          : "Đã hết"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-icon btn-icon-edit"
                          onClick={() => handleEditClick(book)}
                          title="Sửa"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          className="btn-icon btn-icon-delete"
                          onClick={() => handleDelete(book.RecordID)}
                          title="Xóa"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL SỬA */}
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
