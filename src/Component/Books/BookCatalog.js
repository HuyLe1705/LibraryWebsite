import React, { useState, useEffect, useRef } from "react";

// --- CSS ĐÃ ĐƯỢC FIX + THÊM PHÂN TRANG ---
const fixedStyles = `
:root {
  --primary-color: #4361ee;
  --primary-hover: #3a56d4;
  --danger-color: #ef233c;
  --success-color: #2ec4b6;
  --warning-color: #ff9f1c;
  --text-dark: #2b2d42;
  --text-light: #8d99ae;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.catalog-container {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 1100px;
  margin: 30px auto;
  padding: 30px;
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: visible !important; 
}

h2 {
  color: var(--text-dark);
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
}

/* --- TOOLBAR --- */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  background: #f1f3f9;
  padding: 15px;
  border-radius: 12px;
  flex-wrap: wrap;
  overflow: visible !important; 
}

.search-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--white);
  border-radius: 8px;
  padding: 5px 5px 5px 15px;
  border: 1px solid #e0e0e0;
  transition: 0.2s;
}

.search-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.search-wrapper input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  color: var(--text-dark);
  padding: 5px;
}

.btn-search {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-search:hover {
  background-color: var(--primary-hover);
}

/* --- FILTER --- */
.filter-wrapper {
  position: relative;
  z-index: 1000;
}

.btn-filter {
  background-color: var(--white);
  color: var(--text-dark);
  border: 1px solid #ced4da;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}
.btn-filter:hover, .btn-filter.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: #eff3ff;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  width: 240px;
  background: var(--white);
  border-radius: 10px;
  padding: 8px;
  border: 1px solid #eee;
  z-index: 99999 !important; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: block;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dropdown-item:hover {
  background-color: #f8f9fa;
  color: var(--primary-color);
}
.dropdown-item.selected {
  background-color: #eff3ff;
  color: var(--primary-color);
  font-weight: 600;
}

.btn-reset {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background-color: #e9ecef;
  color: var(--text-dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-reset:hover {
  background-color: #dee2e6;
  transform: rotate(180deg);
  transition: 0.3s;
}

/* --- TABLE --- */
.table-container {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #eee;
  min-height: 300px; /* Giữ chiều cao tối thiểu để tránh giật layout khi ít sách */
}
.book-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}
.book-table th {
  background-color: #f8f9fa;
  color: var(--text-light);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #eee;
}
.book-table td {
  padding: 15px;
  border-bottom: 1px solid #f1f1f1;
  color: var(--text-dark);
  font-size: 14px;
  vertical-align: middle;
}
.book-table tr:hover {
  background-color: #fcfcfc;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.status-avail {
  background-color: rgba(46, 196, 182, 0.15);
  color: var(--success-color);
}
.status-out {
  background-color: rgba(239, 35, 60, 0.15);
  color: var(--danger-color);
}

.actions-cell {
  display: flex;
  gap: 8px;
}
.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.btn-icon-edit {
  background: rgba(255, 159, 28, 0.15);
  color: var(--warning-color);
}
.btn-icon-edit:hover {
  background: var(--warning-color);
  color: white;
}
.btn-icon-delete {
  background: rgba(239, 35, 60, 0.15);
  color: var(--danger-color);
}
.btn-icon-delete:hover {
  background: var(--danger-color);
  color: white;
}

/* --- PAGINATION (NEW) --- */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #f1f1f1;
}

.btn-page {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  color: var(--text-dark);
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: #f8f9ff;
}

.btn-page.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3);
}

.btn-page:disabled {
  background: #f8f9fa;
  color: #ccc;
  cursor: not-allowed;
  border-color: #eee;
}

.page-info {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 10px;
}

/* --- MODAL --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease;
}
@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.form-group { margin-bottom: 15px; }
.form-group label {
  display: block; margin-bottom: 5px;
  font-weight: 600; font-size: 13px; color: var(--text-light);
}
.form-group input {
  width: 100%; padding: 12px;
  border: 1px solid #e0e0e0; border-radius: 8px; box-sizing: border-box;
}
.form-group input:focus { border-color: var(--primary-color); outline: none; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
}
.btn-save {
  background: var(--success-color); color: white; border: none;
  padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;
}
.btn-cancel {
  background: #f1f3f5; color: var(--text-dark); border: none;
  padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;
}
`;

// --- ICONS ---
const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Filter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  ChevronLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  ChevronRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
};

// --- MODAL COMPONENT ---
const EditBookModal = ({ isOpen, onClose, book, onSave }) => {
  const [formData, setFormData] = useState({ title: "", publisher: "", year: "", refBookID: "" });

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
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(book.RecordID, formData); }}>
          <div className="form-group">
            <label>Tựa đề sách (*)</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Nhà xuất bản</label>
            <input type="text" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Năm xuất bản (*)</label>
            <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Mã sách tham khảo (RefID)</label>
            <input type="text" value={formData.refBookID} onChange={(e) => setFormData({ ...formData, refBookID: e.target.value })} placeholder="VD: R001" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="btn-save">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
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

  // --- STATE PHÂN TRANG (MỚI) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số sách mỗi trang

  // --- 1. INITIAL LOAD (Chỉ chạy 1 lần) ---
  useEffect(() => {
    // Load danh mục
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi categories:", err));

    // Load sách
    fetchBooks("");
  }, []);

  // --- 2. LOGIC CLICK OUTSIDE ---
  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (event) => {
      if (filterRef.current && filterRef.current.contains(event.target)) {
        return;
      }
      setIsFilterOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFilterOpen]);

  // --- API CALLS ---
  const fetchBooks = async (searchKey) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/search?keyword=${searchKey}`);
      if (!response.ok) throw new Error("Lỗi kết nối");
      const data = await response.json();
      setBooks(data);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSearch = () => {
    setCurrentFilter(null);
    fetchBooks(keyword);
  };

  const handleFilterByCategory = async (categoryName) => {
    console.log("Đang lọc:", categoryName);
    setCurrentFilter(categoryName);
    setIsFilterOpen(false);
    setKeyword("");

    try {
      const url = `http://localhost:5000/api/books/filter-by-category?category=${encodeURIComponent(categoryName)}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data);
      setCurrentPage(1); // Reset về trang 1 khi lọc
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setCurrentFilter(null);
    fetchBooks("");
    setIsFilterOpen(false);
  };

  // --- CRUD HANDLERS ---
  const handleEditClick = (book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (recordID, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${recordID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error(await response.text());
      alert("Cập nhật thành công!");
      setIsModalOpen(false);
      
      // Refresh dữ liệu
      if (currentFilter) handleFilterByCategory(currentFilter);
      else fetchBooks(keyword);
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa sách ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(await response.text());
        alert("Đã xóa thành công!");
        if (currentFilter) handleFilterByCategory(currentFilter);
        else fetchBooks(keyword);
      } catch (err) {
        alert("Không thể xóa: " + err.message);
      }
    }
  };

  // --- LOGIC PHÂN TRANG (MỚI) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <style>{fixedStyles}</style>

      <div className="catalog-container">
        <h2>Tra cứu Tài liệu</h2>

        <div className="toolbar">
          {/* 1. SEARCH */}
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
          <button className="btn-search" onClick={handleSearch}>Tìm kiếm</button>

          {/* 2. FILTER DROPDOWN */}
          <div className="filter-wrapper" ref={filterRef}>
            <button
              className={`btn-filter ${currentFilter ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterOpen(!isFilterOpen);
              }}
            >
              <span style={{ pointerEvents: "none", display: "flex" }}><Icons.Filter /></span>
              {currentFilter ? currentFilter : "Lọc Thể Loại"}
            </button>

            {isFilterOpen && (
              <div className="dropdown-menu">
                <div style={{ padding: "8px 12px", fontSize: "12px", fontWeight: "700", color: "#8d99ae", textTransform: "uppercase" }}>
                  Chọn thể loại
                </div>
                <div className="dropdown-item" onClick={handleReset}>
                  <span>Tất cả</span>
                  {!currentFilter && <Icons.Check />}
                </div>
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`dropdown-item ${currentFilter === cat.Name ? "selected" : ""}`}
                    onClick={() => handleFilterByCategory(cat.Name)}
                  >
                    <span>{cat.Name}</span>
                    {currentFilter === cat.Name && <Icons.Check />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. RESET BUTTON */}
          <button className="btn-reset" onClick={handleReset} title="Làm mới dữ liệu">
            <Icons.Refresh />
          </button>
        </div>

        {/* TABLE */}
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
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                // LƯU Ý: Dùng currentBooks thay vì books
                currentBooks.map((book) => (
                  <tr key={book.RecordID}>
                    <td style={{ fontWeight: "bold" }}>{book.RecordID}</td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#2b2d42" }}>{book.Title}</div>
                      <div style={{ fontSize: "12px", color: "#8d99ae" }}>Năm: {book.Year}</div>
                    </td>
                    <td>
                      <div>{book.AuthorName || "---"}</div>
                      <div style={{ fontSize: "13px", color: "#8d99ae" }}>{book.Publisher}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${book.AvailableCopies > 0 ? "status-avail" : "status-out"}`}>
                        {book.AvailableCopies > 0 ? `Sẵn có: ${book.AvailableCopies}` : "Đã hết"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-icon btn-icon-edit" onClick={() => handleEditClick(book)} title="Sửa"><Icons.Edit /></button>
                        <button className="btn-icon btn-icon-delete" onClick={() => handleDelete(book.RecordID)} title="Xóa"><Icons.Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS (MỚI) --- */}
        {books.length > 0 && (
          <div className="pagination-wrapper">
            <button 
              className="btn-page" 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <Icons.ChevronLeft />
            </button>
            
            {/* Tạo mảng số trang để render */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn-page ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button 
              className="btn-page" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <Icons.ChevronRight />
            </button>
          </div>
        )}

        <EditBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={currentBook} onSave={handleSaveUpdate} />
      </div>
    </>
  );
};

export default BookCatalog;