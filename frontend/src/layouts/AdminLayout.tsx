import { Outlet, NavLink, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Đang kiểm tra quyền truy cập...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
    return <Navigate to="/login" replace />;
  }

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
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="s-icon">👥</span> Quản lý Người dùng
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="s-icon">📋</span> Đơn hàng
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
