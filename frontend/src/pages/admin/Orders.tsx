import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  user: { email: string; firstName: string; lastName: string };
  status: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/order/all')
      .then(res => setOrders(res.data.data || res.data || []))
      .catch(err => {
        console.error(err);
        toast.error('Lỗi tải danh sách đơn hàng');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    api.patch(`/order/${id}/status`, { status: newStatus })
      .then(() => {
        toast.success('Cập nhật trạng thái thành công');
        fetchOrders();
      })
      .catch(err => toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#faad14';
      case 'PROCESSING': return '#1890ff';
      case 'SHIPPED': return '#722ed1';
      case 'DELIVERED': return '#52c41a';
      case 'CANCELLED': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã huỷ';
      default: return status;
    }
  };

  const isValidTransition = (current: string, next: string) => {
    if (current === next) return true;
    const transitions: Record<string, string[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': [],
    };
    return transitions[current]?.includes(next);
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Quản lý Đơn hàng</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Chưa có đơn hàng nào</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 8)}...</td>
                  <td>
                    {order.user?.firstName} {order.user?.lastName}
                    <br />
                    <small style={{ color: '#888' }}>{order.user?.email}</small>
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#E91E63' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: `${getStatusColor(order.status)}20`, 
                      color: getStatusColor(order.status),
                      padding: '6px 10px',
                      borderRadius: '20px',
                      fontWeight: 600,
                      fontSize: '12px',
                      display: 'inline-block'
                    }}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', outline: 'none' }}
                      disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                    >
                      {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                        <option key={s} value={s} disabled={!isValidTransition(order.status, s)}>
                          {getStatusText(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
