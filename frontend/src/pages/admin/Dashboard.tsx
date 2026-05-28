export default function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Tổng quan</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">1,284</div>
          <div className="stat-label">Đơn hàng mới</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">34.2M</div>
          <div className="stat-label">Doanh thu</div>
        </div>
      </div>
      <div className="data-table-wrap">
        <div className="table-header">
          <div className="table-title">Đơn hàng gần đây</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#SF2025-8842</td>
              <td>Trần Ngọc</td>
              <td>24/05/2025</td>
              <td><span className="order-status status-processing">Đang xử lý</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
