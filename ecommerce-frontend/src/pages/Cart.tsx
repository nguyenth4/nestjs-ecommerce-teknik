import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import StoreNav from '../components/StoreNav';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { getStoreAuthToken } from '../utils/storeAuth';
import '../index.css';

const getFallbackImage = (name: string) => {
  if (!name) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Controller')) return 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('VR')) return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Keyboard')) return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Audio')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500&h=500';
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
};

export default function Cart() {
  const { cart, loading, updateLineQuantity, removeLine } = useCart();
  const token = getStoreAuthToken();
  const items = cart?.items ?? [];

  const subtotal = items.reduce((s, line) => s + line.product.price * line.quantity, 0);

  return (
    <div className="app-wrapper">
      <StoreNav />
      <main className="container" style={{ padding: '2rem 1rem 4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Giỏ hàng
        </h1>

        {!token && (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Đăng nhập hoặc đăng ký tài khoản khách để xem giỏ hàng.
            </p>
            <Link to="/account/login" className="btn btn-primary" style={{ marginRight: '0.75rem' }}>
              Đăng nhập
            </Link>
            <Link to="/account/register" className="btn btn-icon" style={{ textDecoration: 'none', padding: '0.65rem 1.25rem' }}>
              Đăng ký
            </Link>
          </div>
        )}

        {token && loading && !items.length && <div className="loading">Đang tải giỏ hàng…</div>}

        {token && !loading && items.length === 0 && (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Giỏ hàng đang trống.</p>
            <Link to="/catalog" className="btn btn-primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {token && items.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 800 }}>
            {items.map((line) => (
              <div key={line.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={line.product.imageUrl || getFallbackImage(line.product.name)}
                  alt=""
                  style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/product/${line.product.id}`} style={{ color: 'var(--text-main)', fontWeight: 600, textDecoration: 'none' }}>
                    {line.product.name}
                  </Link>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
                    {formatPrice(line.product.price)} × {line.quantity}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="quantity-btn"
                    aria-label="Giảm"
                    onClick={() => {
                      const next = line.quantity - 1;
                      if (next < 1) void removeLine(line.id);
                      else void updateLineQuantity(line.id, next);
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ minWidth: 24, textAlign: 'center' }}>{line.quantity}</span>
                  <button
                    type="button"
                    className="quantity-btn"
                    aria-label="Tăng"
                    onClick={() => void updateLineQuantity(line.id, line.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ fontWeight: 600, minWidth: 100, textAlign: 'right' }}>
                  {formatPrice(line.product.price * line.quantity)}
                </div>
                <button
                  type="button"
                  className="btn-icon"
                  aria-label="Xóa"
                  onClick={() => void removeLine(line.id)}
                  style={{ color: '#f87171' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tạm tính</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatPrice(subtotal)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ justifyContent: 'center', textDecoration: 'none' }}>
              Thanh toán
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
