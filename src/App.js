import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import BookCatalog from './Component/Books/BookCatalog';
import BookManagement from './Component/Books/BookManagement';
import CirculationDesk from './Component/Circulation/CirculationDesk';
import Header from './Component/header/header';
import Footer from './Component/footer/footer'
import Homepage from './Routes/hompage';
function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        
       

        <div className="content">
            <Routes>
                <Route path="/search" element={<BookCatalog />} />
                <Route path="/manage-books" element={<BookManagement />} />
                <Route path="/return" element={<CirculationDesk />} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </div>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;