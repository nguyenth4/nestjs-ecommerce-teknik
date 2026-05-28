import { Outlet, Link } from 'react-router-dom';

export default function ClientLayout() {
  return (
    <div id="view-client" className="view active">
      <nav className="client-nav">
        <div className="nav-inner">
          <Link to="/" className="logo">Shop<span>Flow</span></Link>
          <ul className="nav-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/shop">Sản phẩm</Link></li>
            <li><Link to="/orders">Đơn hàng</Link></li>
            <li><Link to="/profile">Tài khoản</Link></li>
          </ul>
          <div className="nav-actions">
             <Link to="/admin" style={{ fontSize: '13px', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>⚙️ Admin Panel</Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
