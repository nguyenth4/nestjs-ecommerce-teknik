import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, Tags, ShoppingCart } from 'lucide-react';
import '../index.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Basic Auth Check
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--glass-border)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 1rem', marginBottom: '2rem' }}>
          <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            <Settings size={24} /> Admin
          </h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                  borderRadius: '8px', textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  transition: 'var(--transition)'
                }}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <span>🏠 Back to Store</span>
          </Link>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
