import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  categoryId: string;
  isActive: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', sku: '', price: 0, categoryId: 'cat-1', isActive: true });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/products');
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = formData.id ? `http://localhost:3000/products/${formData.id}` : 'http://localhost:3000/products';
    const method = formData.id ? 'PUT' : 'POST';
    
    // Loại bỏ id ra khỏi payload khi POST hoặc PUT, chuyển price thành số
    const { id, ...rest } = formData;
    const payload = { ...rest, price: Number(formData.price) };
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setIsEditing(false);
        fetchProducts(); // Tải lại danh sách
      } else {
        alert('Lỗi: ' + JSON.stringify(json.message));
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến Backend');
    }
    setLoading(false);
  };

  const handleEdit = (prod: Product) => {
    setFormData({ ...prod });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setFormData({ id: '', name: '', sku: '', price: 0, categoryId: 'cat-1', isActive: true });
    setIsEditing(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Quản lý Sản phẩm</h1>
        <button onClick={handleAdd} className="add-cart-btn" style={{ padding: '10px 20px', width: 'auto', borderRadius: '5px' }}>+ Thêm sản phẩm</button>
      </div>

      {isEditing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'var(--surface)', padding: '30px', borderRadius: 'var(--r)', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{formData.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-light)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '14px' }}>Tên Sản Phẩm <span style={{color: 'red'}}>*</span></label>
                <input type="text" placeholder="Nhập tên sản phẩm..." required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '14px' }}>Mã SKU <span style={{color: 'red'}}>*</span></label>
                <input type="text" placeholder="VD: SP-001" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '14px' }}>Giá tiền (VNĐ) <span style={{color: 'red'}}>*</span></label>
                <input type="number" placeholder="0" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}>Hủy bỏ</button>
                <button type="submit" disabled={loading} style={{ background: 'var(--brand)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}>{loading ? 'Đang lưu...' : 'Lưu sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-table-wrap">
        <div className="table-header">
          <div className="table-title">Danh sách sản phẩm</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '30px'}}>Chưa có sản phẩm nào. Hãy thêm mới!</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.price.toLocaleString()}đ</td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: '10px', background: 'var(--warn)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
