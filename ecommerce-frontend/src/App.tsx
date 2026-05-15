import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './pages/Storefront';
import ProductDetail from './pages/ProductDetail';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';
import AccountLogin from './pages/AccountLogin';
import AccountRegister from './pages/AccountRegister';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsAdmin from './pages/ProductsAdmin';
import OrdersAdmin from './pages/OrdersAdmin';
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/account/login" element={<AccountLogin />} />
        <Route path="/account/register" element={<AccountRegister />} />

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="users" element={<PlaceholderPage title="Users" />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
