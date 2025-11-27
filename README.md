### Yêu cầu chung
- Node.js v18+ và npm
- SQL Server Express (hoặc Developer) + SQL Server Management Studio (SSMS)
- Đã bật `Mixed Mode` cho SQL Server để dùng được tài khoản `sa`

### Chuẩn bị database `LibraryDB`
1. Mở **SQL Server Configuration Manager** → `SQL Server Network Configuration` → `Protocols for MSSQLSERVER` → bật `TCP/IP`.
2. Ở tab `IP Addresses`, phần `IPAll`, nhập `TCP Port = 63218`, `TCP Dynamic Ports` để trống → Apply → restart service `SQL Server (MSSQLSERVER)`.
3. Mở **SSMS**, đăng nhập bằng tài khoản `sa` (mật khẩu mặc định trong `server.js` là `123456`, thay đổi nếu bạn đã chỉnh sửa).
4. File script: `Database/CRUD.sql`. Mở file này trong SSMS và chạy toàn bộ để tạo schema, dữ liệu mẫu, trigger.
5. Kiểm tra lại database `LibraryDB` đã có dữ liệu (ví dụ bảng `BibliographicRecord`, `Loan`, `Fine`, ...).

> Nếu bạn đổi tài khoản, mật khẩu, port hoặc tên instance, nhớ sửa lại cấu hình trong `server.js`.

### Cài đặt dependencies
```bash
npm install
```

### Chạy API server (Express + mssql)
```bash
npx nodemon server.js        # hoặc: node server.js
```
- Server mặc định chạy ở `http://localhost:5000`.
- Kiểm tra log `✅ Đã kết nối thành công tới SQL Server!`. Nếu lỗi, xem lại bước cấu hình DB.

### Chạy frontend (Webpack dev server)
```bash
npm run start
```
- Web mặc định mở tại `http://localhost:8080` (tự động bật trình duyệt).
- Frontend gọi API tới server ở port 5000, nên đảm bảo backend đang chạy trước khi thử các tính năng.

### Build bundle production
```bash
npm run build
```
- Kết quả nằm trong thư mục `build/` với `index.html` và `bundle.js`.
