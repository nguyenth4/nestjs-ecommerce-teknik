import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  status: string;
  category: { id: string; name: string };
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.data || res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    
    api.post('/cart', {
      productId: product.id,
      quantity: 1
    })
    .then(() => toast.success(`Đã thêm ${product.name} vào giỏ`))
    .catch(err => toast.error(err.response?.data?.message || 'Lỗi thêm vào giỏ hàng'));
  };

  return (
    <div className="section">
      <div className="section-head">
        <div><h2>Tất cả sản phẩm</h2><p>{products.length} sản phẩm</p></div>
      </div>
      <div className="shop-layout">
        <aside className="filter-sidebar">
          <h3>🔽 Bộ lọc</h3>
          <div className="filter-group">
            <label>Danh mục</label>
            <div className="filter-check"><input type="checkbox" defaultChecked /> Tất cả</div>
          </div>
        </aside>
        <div className="shop-products">
          <div className="product-grid">
            {products.map(p => (
              <div className="product-card" key={p.id}>
                <div className="product-img"><div className="product-img-inner">📦</div></div>
                <div className="product-info">
                  <div className="product-cat">{p.category?.name || 'Chưa phân loại'}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-meta">
                    <div className="product-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                    <button className="add-cart-btn" onClick={() => handleAddToCart(p)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
