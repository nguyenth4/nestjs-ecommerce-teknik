import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    inventory: {
      quantity: number;
      reservedQuantity: number;
    } | null;
  };
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = (showLoading = true) => {
    if (showLoading) setLoading(true);
    api.get('/cart')
      .then(res => {
        setItems(res.data?.data?.items || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Lỗi tải giỏ hàng');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    api.put(`/cart/items/${itemId}`, { quantity: newQuantity })
      .then(() => fetchCart(false))
      .catch(err => toast.error(err.response?.data?.message || 'Lỗi cập nhật số lượng'));
  };

  const removeItem = (itemId: string) => {
    api.delete(`/cart/items/${itemId}`)
      .then(() => {
        toast.success('Đã xoá sản phẩm khỏi giỏ');
        fetchCart(false);
      })
      .catch(() => toast.error('Lỗi xoá sản phẩm'));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) return <div className="section"><p>Đang tải giỏ hàng...</p></div>;

  return (
    <div className="section">
      <div className="section-head">
        <h2>Giỏ hàng của bạn</h2>
      </div>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>Giỏ hàng đang trống.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '20px' }}>
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 60%' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '20px', padding: '20px', borderBottom: '1px solid #ddd', alignItems: 'center' }}>
                <div style={{ fontSize: '40px' }}>📦</div>
                <div style={{ flex: 1 }}>
                  <h4>{item.product.name}</h4>
                  <p style={{ color: '#E91E63', fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '8px 15px', cursor: 'pointer', background: '#f8f9fa', border: 'none', borderRight: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>-</button>
                  <span style={{ padding: '0 20px', fontWeight: '600', minWidth: '20px', textAlign: 'center', fontSize: '15px' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '8px 15px', cursor: 'pointer', background: '#f8f9fa', border: 'none', borderLeft: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>+</button>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <button onClick={() => removeItem(item.id)} style={{ color: '#ff4d4f', border: 'none', background: '#fff0f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Xoá khỏi giỏ hàng">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ flex: '1 1 30%', background: '#f5f5f5', padding: '30px', borderRadius: '12px', height: 'fit-content' }}>
            <h3>Tóm tắt đơn hàng</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <strong>Tổng tiền:</strong>
              <strong style={{ fontSize: '1.2em', color: '#E91E63' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
              </strong>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '15px' }} onClick={() => navigate('/checkout')}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
