import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchOrders = () => {
    setLoading(true);
    api.get('/order')
      .then(res => setOrders(res.data?.data || []))
      .catch(() => toast.error('Lỗi tải danh sách đơn hàng'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

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

  return (
    <div className="section">
      <div className="section-head">
        <h2>Đơn hàng của tôi</h2>
        <button className="btn btn-outline" onClick={fetchOrders}>Làm mới</button>
      </div>

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p style={{ marginTop: '20px', color: 'var(--text3)' }}>Bạn chưa có đơn hàng nào...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <div><strong>Mã ĐH:</strong> #{order.id.slice(0, 8).toUpperCase()}</div>
                <div>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8em', 
                    color: '#fff', 
                    backgroundColor: getStatusColor(order.status),
                    fontWeight: 'bold'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {order.items?.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <div>{item.quantity} x {item.product?.name}</div>
                  <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</div>
                </div>
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <div><strong>Địa chỉ giao:</strong> {order.shippingAddress || 'Trống'}</div>
                <div>
                  <strong>Tổng cộng:</strong> <strong style={{ color: '#E91E63' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
