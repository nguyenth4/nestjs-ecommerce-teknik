import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './pages/Storefront';
import ProductDetail from './pages/ProductDetail';
import Catalog from './pages/Catalog';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsAdmin from './pages/ProductsAdmin';
import Login from './pages/Login';
import './index.css';

// Placeholder for other admin pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
    <div className="glass-panel">
      <p style={{ color: 'var(--text-muted)' }}>This page is under construction. It will allow you to manage {title.toLowerCase()} via backend APIs later.</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Storefront */}
        <Route path="/" element={<Storefront />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/catalog" element={<Catalog />} />
        
        {/* Admin Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="orders" element={<PlaceholderPage title="Orders" />} />
          <Route path="users" element={<PlaceholderPage title="Users" />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
