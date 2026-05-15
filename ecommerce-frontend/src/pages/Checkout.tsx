import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StoreNav from '../components/StoreNav';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { getStoreAuthToken } from '../utils/storeAuth';
import '../index.css';

const API = 'http://localhost:3000';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, loading, refreshCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const token = getStoreAuthToken();
  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, line) => s + line.product.price * line.quantity, 0);

  const placeOrder = async () => {
    const t = getStoreAuthToken();
    if (!t) {
      navigate('/account/login', { state: { from: '/checkout' } });
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/orders/checkout`, {}, { headers: { Authorization: `Bearer ${t}` } });
      await refreshCart();
      navigate(`/orders/${data.id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Không thể hoàn tất đơn hàng.');
      } else {
        setError('Lỗi không xác định.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="app-wrapper">
        <StoreNav />
        <main className="container" style={{ padding: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>Bạn cần đăng nhập để thanh toán.</p>
          <Link to="/account/login" state={{ from: '/checkout' }} className="btn btn-primary">
            Đăng nhập
          </Link>
        </main>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="app-wrapper">
        <StoreNav />
        <main className="container" style={{ padding: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>Giỏ hàng trống.</p>
          <Link to="/catalog" className="btn btn-primary">
            Xem sản phẩm
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <StoreNav />
      <main className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: 560 }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Thanh toán
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Đơn được tạo ở trạng thái <strong>chờ thanh toán (pending)</strong>, tồn kho đã được trừ trong một giao dịch.
          Hệ thống gửi job xác nhận (log server) và tự động <strong>hủy + hoàn kho</strong> nếu quá thời gian chờ (mặc định 24h, cấu hình{' '}
          <code style={{ fontSize: '0.85rem' }}>ORDER_PENDING_EXPIRE_MS</code>).
        </p>

        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          {items.map((line) => (
            <div key={line.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>
                {line.product.name} × {line.quantity}
              </span>
              <span>{formatPrice(line.product.price * line.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Tổng cộng</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', padding: '1rem', borderRadius: 8, marginBottom: '1rem', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting || loading} onClick={() => void placeOrder()}>
          {submitting ? 'Đang xử lý…' : 'Xác nhận đặt hàng'}
        </button>
        <Link to="/cart" style={{ display: 'block', marginTop: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          ← Quay lại giỏ hàng
        </Link>
      </main>
    </div>
  );
}
