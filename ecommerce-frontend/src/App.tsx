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
import CategoriesAdmin from './pages/CategoriesAdmin';
import OrdersAdmin from './pages/OrdersAdmin';
import UsersAdmin from './pages/UsersAdmin';
import Login from './pages/Login';
import './index.css';

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
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
