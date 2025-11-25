import React, { useState } from 'react';
import './CirculationDesk.css';

const CirculationDesk = () => {
    const [loanID, setLoanID] = useState('');
    const [fineInfo, setFineInfo] = useState(null); // { amount: 0, daysLate: 0 }

    // B1: Kiểm tra phạt
    const checkFine = () => {
        // Giả lập logic tính toán từ Backend
        // Backend sẽ gọi: SELECT dbo.fn_CalculateFine(@LoanID, GETDATE())
        const mockFine = { amount: 50000, daysLate: 2 }; 
        
        if (mockFine.amount > 0) {
            setFineInfo(mockFine);
        } else {
            alert("Không có phạt. Có thể trả sách ngay.");
            setFineInfo({ amount: 0 });
        }
    };

    // B2: Xác nhận trả sách
    const handleReturn = () => {
        // Backend sẽ chạy: UPDATE Loan SET Status='Returned'... -> Trigger tự chạy
        alert(`Đã trả sách cho phiếu mượn ${loanID}. Trạng thái sách đã chuyển về Available.`);
        setFineInfo(null);
        setLoanID('');
    };

    return (
        <div className="desk-container">
            <h2>Quầy Lưu Hành (Trả Sách)</h2>
            
            <div className="input-group">
                <label>Mã Phiếu Mượn (Loan ID):</label>
                <input 
                    type="text" 
                    value={loanID} 
                    onChange={(e) => setLoanID(e.target.value)} 
                    placeholder="Nhập L001..."
                />
            </div>

            <div className="actions">
                <button className="btn-check" onClick={checkFine}>Kiểm tra Phạt</button>
            </div>

            {fineInfo && (
                <div className="fine-box">
                    <h3>Thông tin Phạt</h3>
                    <p>Số tiền phạt: <strong>{fineInfo.amount.toLocaleString()} VND</strong></p>
                    <p>Lý do: Quá hạn {fineInfo.daysLate} ngày</p>
                    
                    <button className="btn-return" onClick={handleReturn}>
                        Thu tiền & Hoàn tất Trả sách
                    </button>
                </div>
            )}
        </div>
    );
};

export default CirculationDesk;