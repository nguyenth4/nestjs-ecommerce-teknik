import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  status: string;
  category: { id: string; name: string };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Không tìm thấy sản phẩm');
        navigate('/shop');
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    
    api.post('/cart/items', {
      productId: product?.id,
      quantity
    })
    .then(() => toast.success(`Đã thêm ${product?.name} vào giỏ`))
    .catch(err => toast.error(err.response?.data?.message || 'Lỗi thêm vào giỏ hàng'));
  };

  if (loading) {
    return <div className="section"><div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div></div>;
  }

  if (!product) return null;

  return (
    <div className="section">
      <div className="breadcrumb" style={{ marginBottom: '24px' }}>
        <span className="breadcrumb-item" onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text2)' }}>Trang chủ</span>
        <span className="breadcrumb-sep" style={{ margin: '0 8px' }}>/</span>
        <span className="breadcrumb-item" onClick={() => navigate('/shop')} style={{ cursor: 'pointer', color: 'var(--text2)' }}>Sản phẩm</span>
        <span className="breadcrumb-sep" style={{ margin: '0 8px' }}>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>
        {/* Product Image */}
        <div style={{ background: 'var(--surface2)', aspectRatio: '1', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', border: '1px solid var(--border)' }}>
          📦
        </div>

        {/* Product Info */}
        <div>
          <div style={{ fontSize: '14px', color: 'var(--brand)', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category?.name || 'Chưa phân loại'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '24px' }}>
            SKU: {product.sku}
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', marginBottom: '24px' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </div>
          
          <div style={{ marginBottom: '32px', lineHeight: '1.6', color: 'var(--text2)' }}>
            {product.description || 'Sản phẩm này chưa có mô tả chi tiết. Chúng tôi sẽ cập nhật thông tin trong thời gian sớm nhất.'}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >-</button>
              <div style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{quantity}</div>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ width: '40px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
              >+</button>
            </div>
            <button 
              className="btn btn-brand" 
              style={{ flex: 1, padding: '12px 24px', fontSize: '16px', minWidth: '200px' }}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text2)' }}>
              <span style={{ fontSize: '20px' }}>🚚</span> Giao hàng toàn quốc
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text2)' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span> Cam kết chính hãng 100%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text2)' }}>
              <span style={{ fontSize: '20px' }}>🔄</span> Đổi trả miễn phí trong 7 ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
