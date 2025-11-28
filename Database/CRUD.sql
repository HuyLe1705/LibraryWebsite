USE master;
GO

-- Kiem tra neu DB LibraryDB ton tai thi xoa va tao lai
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'LibraryDB')
BEGIN
    ALTER DATABASE [LibraryDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [LibraryDB];
END
GO

CREATE DATABASE LibraryDB;
GO
USE LibraryDB;
GO

-- =============================================
-- 1. TAO SCHEMA (CAC BANG)
-- =============================================

-- 1.1 CATALOGS
CREATE TABLE Branch (
    [Branch ID] VARCHAR(10) PRIMARY KEY,
    [Branch Name] NVARCHAR(100) NOT NULL,
    [Address] NVARCHAR(200)
);

CREATE TABLE Manufacture (
    ManufactureID VARCHAR(10) PRIMARY KEY,
    ManuName NVARCHAR(100),
    Contact NVARCHAR(100)
);

CREATE TABLE Author (
    SSN VARCHAR(10) PRIMARY KEY,      
    Biography NVARCHAR(MAX),         
    Fullname NVARCHAR(100)            
);

CREATE TABLE Category (
    Name NVARCHAR(100) PRIMARY KEY, 
    [Description] NVARCHAR(100)   
);

CREATE TABLE BibliographicRecord (
    RecordID VARCHAR(10) PRIMARY KEY,
    Title NVARCHAR(200),
    RefBookID VARCHAR(10),
    Publisher NVARCHAR(100),
    [Year] INT,
    FOREIGN KEY (RefBookID) REFERENCES BibliographicRecord(RecordID)
);

-- 1.2 USER & SUBTYPES
CREATE TABLE [User] (
    UserID CHAR(8) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    [Password] VARCHAR(50) NOT NULL,
    [First Name] NVARCHAR(50), 
    [Last Name] NVARCHAR(50),
    Email VARCHAR(50),
    SSN CHAR(8),
    Birthday DATE,
    [Address] NVARCHAR(50),
    UserType VARCHAR(50) NOT NULL,
    [Phone Number] VARCHAR(15),
    CONSTRAINT CHK_Email CHECK (Email LIKE '%_@__%.__%'),
    CONSTRAINT CHK_Password CHECK (LEN([Password]) BETWEEN 8 AND 16)
);

CREATE TABLE [Admin] (
    UserID CHAR(8) PRIMARY KEY,
    AdminCode VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

CREATE TABLE Student (
    UserID CHAR(8) PRIMARY KEY,
    [Student ID] VARCHAR(20) NOT NULL,
    [Year] INT,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

CREATE TABLE Librarian (
    UserID CHAR(8) PRIMARY KEY,
    [Branch ID] VARCHAR(10) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY ([Branch ID]) REFERENCES Branch([Branch ID])
);

-- 1.3 BOOKS, COPIES & M-N RELATIONS
CREATE TABLE [Book Copy] (
    BookID VARCHAR(10) PRIMARY KEY,
    RecordID VARCHAR(10) NOT NULL,
    [Entry Date] DATE,
    [Branch ID] VARCHAR(10),
    ManufactureID VARCHAR(10),
    [Status] NVARCHAR(20),
    FOREIGN KEY (RecordID) REFERENCES BibliographicRecord(RecordID),
    FOREIGN KEY ([Branch ID]) REFERENCES Branch([Branch ID]),
    FOREIGN KEY (ManufactureID) REFERENCES Manufacture(ManufactureID)
);

CREATE TABLE Keywords (
    RecordID VARCHAR(10) NOT NULL,
    Keyword NVARCHAR(50) NOT NULL,
    PRIMARY KEY (RecordID, Keyword),
    FOREIGN KEY (RecordID) REFERENCES BibliographicRecord(RecordID)
);

CREATE TABLE Viet (
    AuthorID VARCHAR(10) NOT NULL,
    RecordID VARCHAR(10) NOT NULL,
    PRIMARY KEY (AuthorID, RecordID),
    FOREIGN KEY (AuthorID) REFERENCES Author(SSN),
    FOREIGN KEY (RecordID) REFERENCES BibliographicRecord(RecordID)
);

CREATE TABLE Thuoc (
    CategoryName NVARCHAR(100) NOT NULL,
    RecordID VARCHAR(10) NOT NULL,
    PRIMARY KEY (CategoryName, RecordID),
    FOREIGN KEY (CategoryName) REFERENCES Category(Name),
    FOREIGN KEY (RecordID) REFERENCES BibliographicRecord(RecordID)
);

-- 1.4 CIRCULATION
CREATE TABLE Cart (
    CartID VARCHAR(8) PRIMARY KEY,
    InitialDate DATE,
    [Status] VARCHAR(20) NOT NULL,
    UserID CHAR(8) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

CREATE TABLE [Cart Contain] (
    CartID VARCHAR(8) NOT NULL,
    BookID VARCHAR(10) NOT NULL,
    PRIMARY KEY (CartID, BookID),
    FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    FOREIGN KEY (BookID) REFERENCES [Book Copy](BookID)
);

CREATE TABLE Loan (
    LoanID VARCHAR(8) PRIMARY KEY,
    LoanDate DATE NOT NULL,
    [Due Date] DATE NOT NULL,
    ReturnDate DATE,
    [Status] VARCHAR(20) NOT NULL,
    [Handler ID] CHAR(8) NOT NULL,
    BorrowerID CHAR(8) NOT NULL,
    BookID VARCHAR(10) NOT NULL,
    FOREIGN KEY ([Handler ID]) REFERENCES [User](UserID),
    FOREIGN KEY (BorrowerID) REFERENCES [User](UserID),
    FOREIGN KEY (BookID) REFERENCES [Book Copy](BookID)
);

CREATE TABLE Fine (
    FineID CHAR(8) PRIMARY KEY,
    Amount DECIMAL(10,2) NOT NULL,
    Reason NVARCHAR(100),
    [Status] VARCHAR(20) NOT NULL,
    [Closing Date] DATE,
    ActionDate DATE,
    HandlerID CHAR(8) NOT NULL,
    LoanID VARCHAR(8) NOT NULL,
    FOREIGN KEY (HandlerID) REFERENCES [User](UserID),
    FOREIGN KEY (LoanID) REFERENCES Loan(LoanID),
    CONSTRAINT CHK_FineAmount CHECK (Amount > 0),
    CONSTRAINT CHK_FineStatus CHECK ([Status] IN ('Paid', 'Unpaid'))
);
GO

-- =============================================
-- 2. NHAP LIEU MAU (DA GOP VA SUA LOI)
-- =============================================

-- 2.1 Branch & Manufacture
INSERT INTO Branch ([Branch ID], [Branch Name], [Address]) VALUES
('B001', N'Chi nhánh Trung Tâm', N'123 Đường Nguyễn Huệ, Quận 1, TP.HCM'),
('B002', N'Chi nhánh Thủ Đức', N'456 Đường Võ Văn Ngân, TP. Thủ Đức'),
('B003', N'Chi nhánh Quận 5', N'789 Đường An Dương Vương, Quận 5'),
('B004', N'Chi nhánh Quận 7', N'101 Đường Nguyễn Văn Linh, Quận 7'),
('B005', N'Chi nhánh Gò Vấp', N'202 Đường Quang Trung, Quận Gò Vấp');

INSERT INTO Manufacture (ManufactureID, ManuName, Contact) VALUES
('M001', N'Công ty In ấn Sao Mai', N'saomai@print.com'),
('M002', N'Nhà xuất bản Trẻ', N'tre@nxb.vn'),
('M003', N'Nhà xuất bản Kim Đồng', N'kimdong@nxb.vn'),
('M004', N'In ấn Phương Đông', N'phuongdong@in.com'),
('M005', N'Nhà xuất bản Tổng hợp HCM', N'tonghop@nxb.vn');

-- 2.2 Author (Đã gộp A001-A005 và A006-A010)
INSERT INTO Author (SSN, Biography, Fullname) VALUES
('A001', N'Tac gia noi tieng ve linh vuc kinh te', N'Nguyen Van A'),
('A002', N'Nha van chuyen viet truyen trinh tham', N'Tran Thi B'),
('A003', N'Chuyen gia lap trinh va Co so du lieu', N'Le Van C'),
('A004', N'Tac gia sach khoa hoc vien tuong', N'Pham Minh D'),
('A005', N'Tac gia sach thieu nhi', N'Hoang Thuy E'),
('A006', N'Tác giả bộ truyện Harry Potter nổi tiếng toàn cầu.', N'J.K. Rowling'),
('A007', N'Chuyên gia về Clean Code và kiến trúc phần mềm (Uncle Bob).', N'Robert C. Martin'),
('A008', N'Nhà văn Nhật Bản đương đại nổi tiếng với Rừng Na Uy.', N'Haruki Murakami'),
('A009', N'Giáo sư ngôn ngữ học, đồng tác giả sách học thuật.', N'Nguyễn Phương F'),
('A010', N'Chuyên gia AI và Machine Learning.', N'Phạm Trí Tuệ');

-- 2.3 Category
INSERT INTO Category (Name, [Description]) VALUES
(N'Lập trình', N'Sách liên quan đến phát triển phần mềm và code'),
(N'Kinh tế', N'Sách về tài chính, quản trị, đầu tư'),
(N'Truyện Trinh Thám', N'Sách về điều tra, phá án'),
(N'Khoa Học Viễn Tưởng', N'Sách về tương lai, vũ trụ'),
(N'Văn Học', N'Sách về thơ ca, tiểu thuyết'),
(N'Ngoại ngữ', N'Sách học tiếng Anh, Nhật, Trung');

-- 2.4 BibliographicRecord (Đã gộp R001-R005 và R006-R013)
INSERT INTO BibliographicRecord (RecordID, Title, RefBookID, Publisher, [Year]) VALUES
('R001', N'Lập trình C# cơ bản', NULL, N'Nhà xuất bản Trẻ', 2022),
('R002', N'Bí mật tư duy triệu phú', NULL, N'Nhà xuất bản Tổng hợp HCM', 2018),
('R003', N'Sherlock Holmes: Cuộc điều tra cuối cùng', NULL, N'Nhà xuất bản Kim Đồng', 2015),
('R004', N'Lập trình Web với ASP.NET', 'R001', N'Nhà xuất bản Trẻ', 2023),
('R005', N'Dế Mèn Phiêu Lưu Ký', NULL, N'Nhà xuất bản Kim Đồng', 2010),
('R006', N'Harry Potter và Hòn đá Phù thủy', NULL, N'Nhà xuất bản Trẻ', 2018),
('R007', N'Harry Potter và Phòng chứa Bí mật', 'R006', N'Nhà xuất bản Trẻ', 2019),
('R008', N'Harry Potter và Tên tù nhân ngục Azkaban', 'R007', N'Nhà xuất bản Trẻ', 2020),
('R009', N'Clean Code: Mã sạch', NULL, N'Nhà xuất bản Khoa học Kỹ thuật', 2017),
('R010', N'Clean Architecture: Kiến trúc sạch', NULL, N'Nhà xuất bản Khoa học Kỹ thuật', 2021),
('R011', N'Rừng Na Uy', NULL, N'Nhà xuất bản Hội Nhà Văn', 2015),
('R012', N'Nhập môn Trí tuệ nhân tạo & C#', NULL, N'Nhà xuất bản Đại học Quốc gia', 2024),
('R013', N'Lập trình C# cơ bản (Tái bản lần 2)', 'R001', N'Nhà xuất bản Trẻ', 2024);

-- 2.5 User Data
INSERT INTO [User] (UserID, Username, [Password], [First Name], [Last Name], Email, SSN, Birthday, [Address], UserType, [Phone Number]) VALUES
('U0000001', 'admin_lib', 'Admin@123', N'Nguyễn', N'Quản Trị', 'admin@lib.edu', '11111111', '1985-01-01', N'Hà Nội', 'Admin', '0901111111'),
('U0000002', 'lib_td', 'Librarian@1', N'Phạm', N'Thủ Thư 1', 'lib1@lib.edu', '22222222', '1990-05-15', N'TP. Thủ Đức', 'Librarian', '0902222222'),
('U0000003', 'lib_q1', 'Librarian@2', N'Lê', N'Thủ Thư 2', 'lib2@lib.edu', '33333333', '1992-10-20', N'Quận 1', 'Librarian', '0903333333'),
('U0000004', 'stu_loan', 'Student@123', N'Trần', N'Sinh Viên 1', 'stu1@hcmut.edu', '44444444', '2000-03-08', N'Bình Thạnh', 'Student', '0904444444'),
('U0000005', 'stu_cart', 'Student@345', N'Hoàng', N'Sinh Viên 2', 'stu2@hcmut.edu', '55555555', '2001-07-25', N'Quận 5', 'Student', '0905555555'),
('U0000006', 'stu_fine', 'Student@567', N'Võ', N'Sinh Viên 3', 'stu3@hcmut.edu', '66666666', '2002-12-10', N'Quận 7', 'Student', '0906666666');

INSERT INTO [Admin] (UserID, AdminCode) VALUES 
('U0000001', 'AD001'),
('U0000002', 'AD002'),
('U0000003', 'AD003'),
('U0000004', 'AD004'),
('U0000005', 'AD005');

INSERT INTO Librarian (UserID, [Branch ID]) VALUES 
('U0000006', 'B002'), 
('U0000007', 'B001'),
('U0000008', 'B003'),
('U0000009', 'B004'),
('U0000010', 'B005')
;

INSERT INTO Student (UserID, [Student ID], [Year]) VALUES
('U0000011', '20100001', 2020),
('U0000012', '21100002', 2021),
('U0000013', '22100003', 2022),
('U0000014', '22100004', 2022),
('U0000015', '23100005', 2023);

-- 2.6 Book Copy (Đã gộp tất cả và sửa lỗi cú pháp)
INSERT INTO [Book Copy] (BookID, RecordID, [Entry Date], [Branch ID], ManufactureID, [Status]) VALUES
('C001', 'R001', '2023-01-10', 'B002', 'M001', 'CheckedOut'),
('C002', 'R001', '2023-01-10', 'B002', 'M001', 'Available'),
('C003', 'R002', '2023-03-01', 'B001', 'M002', 'OnLoan'),
('C004', 'R002', '2023-03-01', 'B001', 'M002', 'Available'),
('C005', 'R003', '2022-11-15', 'B003', 'M003', 'Available'),
('C006', 'R003', '2022-11-15', 'B003', 'M003', 'Maintenance'),
('C007', 'R004', '2024-02-20', 'B004', 'M004', 'OnLoan'),
('C008', 'R004', '2024-02-20', 'B004', 'M004', 'Available'),
('C009', 'R005', '2021-05-05', 'B005', 'M005', 'Available'),
('C010', 'R005', '2021-05-05', 'B005', 'M005', 'Maintenance'),
('C011', 'R006', '2023-06-01', 'B001', 'M002', 'Available'),
('C012', 'R006', '2023-06-01', 'B001', 'M002', 'OnLoan'),
('C013', 'R006', '2023-06-05', 'B002', 'M002', 'Available'),
('C014', 'R006', '2023-06-05', 'B002', 'M002', 'Available'),
('C015', 'R006', '2023-07-01', 'B003', 'M002', 'Maintenance'),
('C016', 'R006', '2023-07-01', 'B005', 'M002', 'Available'),
('C017', 'R009', '2022-01-15', 'B002', 'M004', 'Available'),
('C018', 'R009', '2022-01-15', 'B002', 'M004', 'OnLoan'),
('C019', 'R009', '2022-02-20', 'B003', 'M004', 'CheckedOut'),
('C020', 'R009', '2022-02-20', 'B003', 'M004', 'Available'),
('C021', 'R011', '2021-12-12', 'B004', 'M005', 'Available'),
('C022', 'R011', '2021-12-12', 'B004', 'M005', 'Available'),
('C023', 'R011', '2022-03-10', 'B001', 'M005', 'Lost'),
('C024', 'R012', '2024-10-01', 'B002', 'M001', 'Available'),
('C025', 'R012', '2024-10-01', 'B002', 'M001', 'Available'),
('C026', 'R012', '2024-10-05', 'B001', 'M001', 'OnLoan'),
('C027', 'R007', '2023-08-15', 'B001', 'M002', 'Available'),
('C028', 'R007', '2023-08-15', 'B002', 'M002', 'Available'),
('C029', 'R008', '2023-09-20', 'B001', 'M002', 'Available'),
('C030', 'R008', '2023-09-20', 'B005', 'M002', 'Available');

-- 2.7 Keywords (Đã gộp và sửa cú pháp)
INSERT INTO Keywords (RecordID, Keyword) VALUES
('R001', N'Lập trình'), ('R001', 'C#'),
('R002', N'Kinh tế'),
('R003', N'Trinh thám'),
('R004', 'ASP.NET'),
('R006', 'Harry Potter'), ('R006', 'Magic'), ('R006', 'Hogwarts'),
('R007', 'Harry Potter'), ('R007', 'Chamber of Secrets'),
('R009', 'Clean Code'), ('R009', 'Java'), ('R009', 'Refactoring'),
('R010', 'Architecture'), ('R010', 'Design Patterns'),
('R012', 'AI'), ('R012', 'Machine Learning'), ('R012', 'C#'),
('R011', 'Novel'), ('R011', 'Japan');

-- 2.8 Relation VIET (Đã gộp)
INSERT INTO Viet (AuthorID, RecordID) VALUES
('A003', 'R001'), ('A001', 'R002'), ('A002', 'R003'), ('A003', 'R004'), ('A005', 'R005'),
('A006', 'R006'), ('A006', 'R007'), ('A006', 'R008'),
('A007', 'R009'), ('A007', 'R010'),
('A008', 'R011'),
('A003', 'R012'), ('A010', 'R012'),
('A003', 'R013');

-- 2.9 Relation THUOC (Đã gộp và sửa cú pháp)
INSERT INTO Thuoc (CategoryName, RecordID) VALUES
(N'Lập trình', 'R001'),
(N'Kinh tế', 'R002'),
(N'Truyện Trinh Thám', 'R003'),
(N'Lập trình', 'R004'),
(N'Văn Học', 'R005'),
(N'Văn học', 'R006'),
(N'Văn học', 'R007'),
(N'Văn học', 'R008'),
(N'Ngoại ngữ', 'R006'),
(N'Lập trình', 'R009'),
(N'Lập trình', 'R010'),
(N'Văn học', 'R011'),
(N'Lập trình', 'R012'),
(N'Khoa Học Viễn Tưởng', 'R012'),
(N'Lập trình', 'R013');

-- 2.10 Circulation Data
INSERT INTO Loan (LoanID, LoanDate, [Due Date], ReturnDate, [Status], [Handler ID], BorrowerID, BookID) VALUES
('L001', '2024-10-01', '2024-10-15', '2024-10-14', 'Returned', 'U0000003', 'U0000004', 'C002'),
('L002', '2024-10-20', '2024-11-03', NULL, 'OnLoan', 'U0000003', 'U0000004', 'C003'),
('L003', '2024-10-10', '2024-10-24', '2024-11-05', 'Returned', 'U0000002', 'U0000006', 'C004'),
('L004', '2024-09-01', '2024-09-15', NULL, 'Overdue', 'U0000002', 'U0000006', 'C001'),
('L005', '2024-11-01', '2024-11-15', NULL, 'OnLoan', 'U0000003', 'U0000004', 'C007');

INSERT INTO Cart (CartID, InitialDate, [Status], UserID) VALUES
('CT001', '2024-11-19', 'Active', 'U0000005'),
('CT002', '2024-11-19', 'Active', 'U0000004'),
('CT003', '2024-11-18', 'Completed', 'U0000006'),
('CT004', '2024-11-17', 'Cancelled', 'U0000005'),
('CT005', '2024-11-19', 'Active', 'U0000004');

INSERT INTO [Cart Contain] (CartID, BookID) VALUES
('CT001', 'C002'), ('CT001', 'C004'), ('CT002', 'C005'), ('CT003', 'C008'), ('CT005', 'C009');

INSERT INTO Fine (FineID, Amount, Reason, [Status], HandlerID, LoanID, [Closing Date], ActionDate) VALUES
('F001', 100000.00, N'Hư hỏng nhẹ bìa sách', 'Paid', 'U0000002', 'L001', '2024-10-14', '2024-10-14'),
('F002', 50000.00, N'Trả sách quá hạn 1 ngày', 'Paid', 'U0000002', 'L003', '2024-11-05', '2024-11-05'),
('F003', 20000.00, N'Mất thẻ thư viện', 'Paid', 'U0000001', 'L001', '2024-10-14', '2024-10-14'),
('F004', 50000.00, N'Trả sách quá hạn', 'Unpaid', 'U0000002', 'L004', NULL, NULL),
('F005', 200000.00, N'Mất sách', 'Unpaid', 'U0000003', 'L002', NULL, NULL);
GO

-- =============================================
-- 3. TAO CAC TRIGGER
-- =============================================

-- trigger_autocreatefineonoverdue
CREATE TRIGGER trg_AutoCreateFineOnOverdue
ON Loan
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE [Status] = 'Overdue')
    BEGIN
        INSERT INTO Fine (FineID, Amount, Reason, [Status], HandlerID, LoanID)
        SELECT 
            'F' + i.LoanID, 
            50000, 
            N'Trả sách quá hạn',
            'Unpaid',
            i.[Handler ID],
            i.LoanID
        FROM inserted i
        WHERE i.[Status] = 'Overdue'
          AND NOT EXISTS (SELECT 1 FROM Fine f WHERE f.LoanID = i.LoanID);
    END
END;
GO

-- trigger_checkcartitemavailable
CREATE TRIGGER trg_CheckCartItemAvailable
ON [Cart Contain]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1
        FROM inserted AS i
        JOIN [Book Copy] AS bc ON i.BookID = bc.BookID
        WHERE bc.[Status] <> 'Available'
    )
    BEGIN
        RAISERROR (N'Sách này hiện không có sẵn để thêm vào giỏ. (Đã có người mượn hoặc đang bảo trì)', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- trigger_preventmanualstatuschange
CREATE TRIGGER trg_PreventManualStatusChange
ON [Book Copy]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE([Status])
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM inserted i
            JOIN Loan l ON i.BookID = l.BookID
            WHERE i.[Status] = 'Available' AND l.[Status] = 'OnLoan'
        )
        BEGIN
            RAISERROR (N'Không thể set "Available" thủ công. Sách này vẫn đang được mượn (OnLoan). Phải trả sách ở bảng Loan trước.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM inserted i
            WHERE i.[Status] = 'CheckedOut'
              AND NOT EXISTS (SELECT 1 FROM Loan l WHERE l.BookID = i.BookID AND l.[Status] = 'OnLoan')
        )
        BEGIN
            RAISERROR (N'Không thể set "CheckedOut" thủ công. Phải tạo một Loan mới để mượn sách.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END;
GO

-- trigger_updatebookcopystatus
CREATE TRIGGER trg_UpdateBookCopyStatus
ON Loan
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- TH1: Khi MUON SACH (INSERT mot Loan moi)
    IF EXISTS (SELECT * FROM inserted) AND NOT EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE bc
        SET bc.[Status] = 'CheckedOut'
        FROM [Book Copy] AS bc
        JOIN inserted AS i ON bc.BookID = i.BookID;
    END

    -- TH2: Khi TRA SACH (UPDATE Loan status = 'Returned')
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE bc
        SET bc.[Status] = 'Available'
        FROM [Book Copy] AS bc
        JOIN inserted AS i ON bc.BookID = i.BookID
        JOIN deleted AS d ON i.LoanID = d.LoanID
        WHERE i.[Status] = 'Returned' AND d.[Status] <> 'Returned';
    END

    -- TH3: Khi HUY MUON (DELETE mot Loan)
    IF NOT EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE bc
        SET bc.[Status] = 'Available'
        FROM [Book Copy] AS bc
        JOIN deleted AS d ON bc.BookID = d.BookID;
    END
END;
GO

-- =============================================
-- 4. TAO STORED PROCEDURES
-- =============================================

-- sp_SearchBookByTitle
CREATE PROCEDURE sp_SearchBookByTitle
    @Keyword NVARCHAR(100)
AS
BEGIN
    SELECT 
        br.RecordID,
        br.Title,
        br.Publisher,
        br.[Year],
        a.Fullname AS AuthorName,
        COUNT(CASE WHEN bc.[Status] = 'Available' THEN 1 END) AS AvailableCopies
    FROM BibliographicRecord br
    LEFT JOIN Viet v ON br.RecordID = v.RecordID
    LEFT JOIN Author a ON v.AuthorID = a.SSN
    LEFT JOIN [Book Copy] bc ON br.RecordID = bc.RecordID
    WHERE br.Title LIKE '%' + @Keyword + '%'
    GROUP BY 
        br.RecordID,
        br.Title,
        br.Publisher,
        br.[Year],
        a.Fullname
    ORDER BY br.Title ASC;
END;
GO

-- sp_GetTopBorrowedBooks
CREATE PROCEDURE sp_GetTopBorrowedBooks
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP 10
        br.RecordID,
        br.Title,
        COUNT(l.LoanID) AS BorrowCount
    FROM Loan l
    JOIN [Book Copy] bc ON l.BookID = bc.BookID
    JOIN BibliographicRecord br ON bc.RecordID = br.RecordID
    WHERE l.LoanDate BETWEEN @StartDate AND @EndDate
    GROUP BY br.RecordID, br.Title
    HAVING COUNT(l.LoanID) > 0
    ORDER BY BorrowCount DESC, br.Title ASC;
END;
GO

-- sp_UpdateBibliographicRecord
CREATE PROCEDURE sp_UpdateBibliographicRecord
    @RecordID VARCHAR(10),
    @Title NVARCHAR(200),
    @RefBookID VARCHAR(10) = NULL,
    @Publisher NVARCHAR(100),
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM BibliographicRecord WHERE RecordID = @RecordID)
    BEGIN
        RAISERROR(N'Lỗi: Không tìm thấy tài liệu có mã "%s" để cập nhật.', 16, 1, @RecordID);
        RETURN;
    END
    IF @Title IS NULL OR LTRIM(RTRIM(@Title)) = ''
    BEGIN
        RAISERROR(N'Lỗi: Tựa đề sách không được để trống khi cập nhật.', 16, 1);
        RETURN;
    END
    IF @Year > (YEAR(GETDATE()) + 1)
    BEGIN
        RAISERROR(N'Lỗi: Năm xuất bản (%d) không hợp lệ.', 16, 1, @Year);
        RETURN;
    END
    IF @RefBookID = @RecordID
    BEGIN
        RAISERROR(N'Lỗi: Sách không thể tự tham chiếu chính nó (RefBookID trùng RecordID).', 16, 1);
        RETURN;
    END
    IF @RefBookID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BibliographicRecord WHERE RecordID = @RefBookID)
    BEGIN
        RAISERROR(N'Lỗi: Mã sách tham khảo mới "%s" không tồn tại.', 16, 1, @RefBookID);
        RETURN;
    END

    UPDATE BibliographicRecord
    SET Title = @Title,
        RefBookID = @RefBookID,
        Publisher = @Publisher,
        [Year] = @Year
    WHERE RecordID = @RecordID;
    PRINT N'Cập nhật thông tin tài liệu thành công!';
END;
GO

-- sp_DeleteBibliographicRecord
CREATE PROCEDURE sp_DeleteBibliographicRecord
    @RecordID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM BibliographicRecord WHERE RecordID = @RecordID)
    BEGIN
        RAISERROR(N'Lỗi: Không tìm thấy tài liệu có mã "%s" để xóa.', 16, 1, @RecordID);
        RETURN;
    END
    IF EXISTS (SELECT 1 FROM [Book Copy] WHERE RecordID = @RecordID)
    BEGIN
        DECLARE @NumCopies INT;
        SELECT @NumCopies = COUNT(*) FROM [Book Copy] WHERE RecordID = @RecordID;
        RAISERROR(N'Lỗi: Không thể xóa tài liệu này vì đang tồn tại %d bản sao (Book Copy) trong kho. Cần thanh lý sách trước.', 16, 1, @NumCopies);
        RETURN;
    END
    IF EXISTS (SELECT 1 FROM BibliographicRecord WHERE RefBookID = @RecordID)
    BEGIN
        RAISERROR(N'Lỗi: Không thể xóa tài liệu này vì nó đang được dùng làm tài liệu tham khảo cho sách khác.', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM Viet WHERE RecordID = @RecordID;
        DELETE FROM Thuoc WHERE RecordID = @RecordID;
        DELETE FROM Keywords WHERE RecordID = @RecordID;
        DELETE FROM BibliographicRecord WHERE RecordID = @RecordID;
        COMMIT TRANSACTION;
        PRINT N'Xóa tài liệu và các thông tin liên quan thành công!';
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();
        RAISERROR(N'Lỗi hệ thống khi xóa: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- sp_FilterBooksByCategory
CREATE OR ALTER PROCEDURE sp_FilterBooksByCategory
    @CategoryName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        br.RecordID,
        br.Title,
        br.Publisher,
        br.[Year],
        a.Fullname AS AuthorName,
        COUNT(CASE WHEN bc.[Status] = 'Available' THEN 1 END) AS AvailableCopies
    FROM BibliographicRecord br
    JOIN Thuoc t ON br.RecordID = t.RecordID
    LEFT JOIN Viet v ON br.RecordID = v.RecordID
    LEFT JOIN Author a ON v.AuthorID = a.SSN
    LEFT JOIN [Book Copy] bc ON br.RecordID = bc.RecordID
    WHERE 
        t.CategoryName = @CategoryName
    GROUP BY 
        br.RecordID,
        br.Title,
        br.Publisher,
        br.[Year],
        a.Fullname
    ORDER BY br.Title ASC;
END;
GO