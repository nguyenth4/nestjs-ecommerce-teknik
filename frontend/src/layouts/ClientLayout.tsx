import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div id="view-client" className="view active">
      <nav className="client-nav">
        <div className="nav-inner">
          <Link to="/" className="logo">Shop<span>Flow</span></Link>
          <ul className="nav-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/shop">Sản phẩm</Link></li>
            <li><Link to="/about">Về chúng tôi</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            {user && (
              <>
                <li><Link to="/cart">Giỏ hàng</Link></li>
                <li><Link to="/orders">Đơn hàng</Link></li>
              </>
            )}
          </ul>
          <div className="nav-actions">
            {!user ? (
              <>
                <Link to="/login" style={{ marginRight: '15px', padding: '6px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', color: '#333', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}>Đăng nhập</Link>
                <Link to="/register" style={{ padding: '6px 12px', background: 'var(--brand)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>Đăng ký</Link>
              </>
            ) : (
              <>
                <span style={{ marginRight: '15px', color: '#666' }}>
                  Xin chào, {user.lastName ? `${user.lastName} ${user.firstName || ''}` : user.firstName || user.email.split('@')[0]}
                </span>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <Link to="/admin" style={{ marginRight: '15px', fontSize: '13px', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>⚙️ Admin Panel</Link>
                )}
                <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red', fontSize: '14px' }}>Đăng xuất</button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
