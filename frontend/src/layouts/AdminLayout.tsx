import { Outlet, NavLink, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div id="view-admin" className="view active">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-logo">Shop<span>Flow</span></div>
            <div className="admin-role">Admin Panel</div>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="s-icon">📊</span> Tổng quan
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="s-icon">📦</span> Sản phẩm
            </NavLink>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="s-icon">📁</span> Danh mục
            </NavLink>
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <Link to="/" className="sidebar-item" style={{ color: 'var(--brand)' }}>
                <span className="s-icon">←</span> Về trang Client
              </Link>
            </div>
          </nav>
        </aside>
        <main className="admin-main">
          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
