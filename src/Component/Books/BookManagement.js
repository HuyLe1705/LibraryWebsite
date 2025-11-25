import React, { useState } from 'react';

const BookManagement = () => {
    const [formData, setFormData] = useState({
        recordID: '',
        title: '',
        publisher: '',
        year: new Date().getFullYear()
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation cơ bản
        if (formData.year > new Date().getFullYear()) {
            alert("Năm xuất bản không hợp lệ!");
            return;
        }
        
        console.log("Gửi dữ liệu xuống DB:", formData);
        // await fetch('http://localhost:5000/api/books', { method: 'POST', body: JSON.stringify(formData) ... });
        alert("Đã thêm sách thành công!");
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Quản lý Hồ sơ Sách</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Mã Tài Bản (RecordID):</label>
                    <input name="recordID" value={formData.recordID} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label>Tựa đề:</label>
                    <input name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label>Nhà Xuất Bản:</label>
                    <input name="publisher" value={formData.publisher} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label>Năm Xuất Bản:</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Thêm Sách Mới
                </button>
            </form>
        </div>
    );
};

export default BookManagement;