import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/order/all')
      .then(res => setOrders(res.data?.data || []))
      .catch(() => toast.error('Lỗi tải dữ liệu Dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((total, order) => {
    if (order.status === 'PAID' || order.status === 'COMPLETED' || order.status === 'SHIPPED') {
      return total + order.totalAmount;
    }
    return total;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'PAID': return '#3498db';
      case 'PROCESSING': return '#9b59b6';
      case 'SHIPPED': return '#34495e';
      case 'COMPLETED': return '#2ecc71';
      case 'CANCELLED': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) return <div>Đang tải tổng quan...</div>;

  return (
    <div>
      <h1 className="page-title">Tổng quan</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Tổng đơn hàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </div>
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
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(order => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8).toUpperCase()}</td>
                <td>{order.user?.lastName} {order.user?.firstName}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    color: '#fff', 
                    backgroundColor: getStatusColor(order.status),
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Chưa có đơn hàng nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
