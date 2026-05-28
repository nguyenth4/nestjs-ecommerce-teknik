export default function Orders() {
  return (
    <div className="section">
      <div className="section-head">
        <h2>Đơn hàng của tôi</h2>
      </div>
      <div className="tabs">
        <div className="tab active">Tất cả</div>
        <div className="tab">Đang xử lý</div>
        <div className="tab">Đang giao</div>
        <div className="tab">Hoàn thành</div>
        <div className="tab">Đã hủy</div>
      </div>
      <p style={{ marginTop: '20px', color: 'var(--text3)' }}>Chưa có đơn hàng nào...</p>
    </div>
  );
}
