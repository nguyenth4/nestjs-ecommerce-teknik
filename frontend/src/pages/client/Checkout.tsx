import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [items, setItems] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        const cartItems = res.data?.data?.items || [];
        if (cartItems.length === 0) {
          toast.error('Giỏ hàng trống!');
          navigate('/cart');
        }
        setItems(cartItems);
      })
      .catch(err => {
        console.error(err);
        toast.error('Lỗi tải giỏ hàng');
      });
  }, [navigate]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    api.post('/order', { shippingAddress: address })
      .then((res) => {
        const orderId = res.data?.data?.id || res.data?.id;
        console.log('Created Order ID:', orderId);
        
        if (!orderId) {
          throw new Error('Không lấy được ID đơn hàng từ server');
        }

        toast.success('Đã tạo đơn hàng thành công! Vui lòng thanh toán.');
        
        // Tự động gọi API fake payment luôn
        return api.post('/payment/mock', { 
          orderId: orderId,
          idempotencyKey: Date.now().toString(),
          success: true
        });
      })
      .then(() => {
        toast.success('Thanh toán giả lập thành công!');
        navigate('/orders');
      })
      .catch(err => {
        console.error('Checkout error:', err);
        const msg = err.response?.data?.message;
        const errMsg = Array.isArray(msg) ? msg.join(', ') : (msg || 'Lỗi đặt hàng/thanh toán');
        toast.error(typeof errMsg === 'string' ? errMsg : 'Lỗi không xác định');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="section" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-head">
        <h2>Xác nhận đơn hàng</h2>
      </div>

      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '12px' }}>
        <h3>Thông tin giao hàng</h3>
        <form onSubmit={handleCheckout} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Địa chỉ nhận hàng cụ thể</label>
            <textarea 
              className="form-control" 
              rows={3} 
              placeholder="Ví dụ: Số 48 Bà Triệu, Phường Tân An, Cần Thơ..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            ></textarea>
          </div>

          <h3 style={{ marginTop: '40px' }}>Sản phẩm ({items.length})</h3>
          <div style={{ margin: '20px 0', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', padding: '20px 0' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>{item.quantity} x {item.product.name}</div>
                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', marginBottom: '30px' }}>
            <strong>Tổng thanh toán:</strong>
            <strong style={{ color: '#E91E63' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
            </strong>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt hàng & Thanh toán (Fake Payment)'}
          </button>
        </form>
      </div>
    </div>
  );
}
