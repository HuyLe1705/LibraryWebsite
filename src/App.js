import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import các component mới
import BookCatalog from './Component/Books/BookCatalog';
import BookManagement from './Component/Books/BookManagement';
import CirculationDesk from './Component/Circulation/CirculationDesk';

// Import Header/Footer cũ của bạn
import Header from './Component/header/header'; // Chú ý đường dẫn thư mục của bạn là header thường
// import Footer from ...

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        {/* Menu tạm để test chuyển trang */}
        <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ marginRight: 10 }}>Trang chủ</Link>
            <Link to="/search" style={{ marginRight: 10 }}>Tra cứu</Link>
            <Link to="/manage-books" style={{ marginRight: 10 }}>Quản lý Sách</Link>
            <Link to="/return">Trả sách</Link>
        </nav>

        <div className="content">
            <Routes>
                <Route path="/search" element={<BookCatalog />} />
                <Route path="/manage-books" element={<BookManagement />} />
                <Route path="/return" element={<CirculationDesk />} />
                <Route path="/" element={<h2>Chào mừng đến với Thư viện BK</h2>} />
            </Routes>
        </div>
        
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;