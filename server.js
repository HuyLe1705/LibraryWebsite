const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 5000;

// 1. Cấu hình kết nối SQL Server
const dbConfig = {
    user: 'sa',
    password: '123456', 
    server: 'localhost', // SỬA: Phải là localhost hoặc 127.0.0.1
    port: 63218,         // THÊM: Điền port từ ảnh TCP/IP Properties vào đây
    database: 'LibraryDB',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        // instanceName: 'SQLEXPRESS' // Bạn có thể bỏ dòng này vì đã khai báo port cụ thể
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// 2. Kết nối Database
sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('✅ Đã kết nối thành công tới SQL Server!');
    }
}).catch(err => {
    console.error('❌ Lỗi kết nối Database:', err);
});

// ================= API ENDPOINTS =================

// API 1: Tìm kiếm sách (Gọi Stored Procedure: sp_SearchBooks)
app.get('/api/books/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        const pool = await sql.connect(dbConfig);
        
        // Gọi SP sp_SearchBooks (Bạn cần đảm bảo đã tạo SP này trong SQL)
        // Nếu chưa tạo SP, mình có thể viết query SELECT trực tiếp ở đây
        const result = await pool.request()
            .input('Keyword', sql.NVarChar, keyword)
            .query(`
                SELECT 
                    B.RecordID, B.Title, B.Publisher, B.Year, 
                    A.Fullname AS Author,
                    (SELECT COUNT(*) FROM [Book Copy] WHERE RecordID = B.RecordID AND Status = N'Còn') AS AvailableCopies
                FROM BibliographicRecord B
                LEFT JOIN Viet V ON B.RecordID = V.RecordID
                LEFT JOIN Author A ON V.AuthorID = A.SSN
                WHERE B.Title LIKE N'%' + @Keyword + N'%' OR A.Fullname LIKE N'%' + @Keyword + N'%'
            `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API 2: Thêm sách mới (INSERT)
app.post('/api/books', async (req, res) => {
    try {
        const { recordID, title, publisher, year } = req.body;
        const pool = await sql.connect(dbConfig);

        await pool.request()
            .input('RecordID', sql.VarChar, recordID)
            .input('Title', sql.NVarChar, title)
            .input('Publisher', sql.NVarChar, publisher)
            .input('Year', sql.Int, year)
            .query(`
                INSERT INTO BibliographicRecord (RecordID, Title, Publisher, Year)
                VALUES (@RecordID, @Title, @Publisher, @Year)
            `);
            
        res.json({ message: 'Thêm sách thành công' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API 3: Kiểm tra tiền phạt (Gọi Function SQL)
app.get('/api/loans/fine/:loanID', async (req, res) => {
    try {
        const { loanID } = req.params;
        const pool = await sql.connect(dbConfig);

        // Giả sử 5000đ/ngày phạt. Logic tính: Ngày trả (Hôm nay) - Hạn trả
        const result = await pool.request()
            .input('LoanID', sql.VarChar, loanID)
            .query(`
                DECLARE @DueDate DATE;
                DECLARE @FineAmount DECIMAL(10,2) = 0;
                
                SELECT @DueDate = [Due Date] FROM Loan WHERE LoanID = @LoanID;
                
                IF GETDATE() > @DueDate
                    SET @FineAmount = DATEDIFF(DAY, @DueDate, GETDATE()) * 5000;
                
                SELECT @FineAmount AS FineAmount, DATEDIFF(DAY, @DueDate, GETDATE()) AS DaysLate
            `);

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API 4: Trả sách (UPDATE + Trigger sẽ tự chạy)
app.post('/api/loans/return', async (req, res) => {
    try {
        const { loanID } = req.body;
        const pool = await sql.connect(dbConfig);

        // Update trạng thái Loan -> Trigger 'trg_UpdateBookCopyStatus' sẽ tự update kho sách
        await pool.request()
            .input('LoanID', sql.VarChar, loanID)
            .query(`
                UPDATE Loan 
                SET ReturnDate = GETDATE(), Status = 'Returned'
                WHERE LoanID = @LoanID
            `);

        res.json({ message: 'Trả sách thành công' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});