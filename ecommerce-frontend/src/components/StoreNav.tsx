import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  clearCustomerToken,
  getStoreAuthToken,
  hasCustomerSession,
  notifyStoreAuthChanged,
} from '../utils/storeAuth';

export default function StoreNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  const token = getStoreAuthToken();
  const isCustomer = hasCustomerSession();

  const homeActive = location.pathname === '/';
  const catalogActive = location.pathname === '/catalog';

  const handleStoreLogout = () => {
    clearCustomerToken();
    notifyStoreAuthChanged();
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Zap className="text-gradient" size={28} />
          <span>
            Teknix<span className="text-gradient">Store</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item${homeActive ? ' active' : ''}`}>
            Home
          </Link>
          <Link to="/catalog" className={`nav-item${catalogActive ? ' active' : ''}`}>
            Catalog
          </Link>
          <Link to="/admin" className="nav-item">
            Admin Dashboard
          </Link>
        </div>

        <div className="nav-actions">
          <button type="button" className="btn-icon" aria-label="Search">
            <Search size={20} />
          </button>
          {token ? (
            isCustomer ? (
              <button
                type="button"
                className="btn-icon"
                onClick={handleStoreLogout}
                title="Đăng xuất tài khoản khách"
                aria-label="Đăng xuất tài khoản khách"
              >
                <User size={20} />
              </button>
            ) : (
              <Link to="/login" className="btn-icon" title="Admin đã đăng nhập" aria-label="Admin">
                <User size={20} />
              </Link>
            )
          ) : (
            <Link to="/account/login" className="btn-icon" title="Đăng nhập cửa hàng" aria-label="Đăng nhập cửa hàng">
              <User size={20} />
            </Link>
          )}
          <Link to="/cart" className="btn-icon" style={{ position: 'relative' }} aria-label="Giỏ hàng">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'var(--primary)',
                  fontSize: '0.6rem',
                  minWidth: 14,
                  height: 14,
                  padding: '0 3px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
