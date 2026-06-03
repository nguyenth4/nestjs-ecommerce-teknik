import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', slug: '', isActive: true });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách danh mục');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Loại bỏ id ra khỏi payload khi POST hoặc PUT
    const { id, ...payload } = formData;
    
    try {
      if (formData.id) {
        await api.put(`/categories/${formData.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      setIsEditing(false);
      toast.success('Lưu danh mục thành công!');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu danh mục');
    }
    setLoading(false);
  };

  const handleEdit = (cat: Category) => {
    setFormData({ ...cat });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Xoá danh mục thành công!');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi xoá danh mục');
    }
  };

  const handleAdd = () => {
    setFormData({ id: '', name: '', slug: '', isActive: true });
    setIsEditing(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Quản lý Danh mục</h1>
        <button onClick={handleAdd} className="add-cart-btn" style={{ padding: '10px 20px', width: 'auto', borderRadius: '5px' }}>+ Thêm danh mục</button>
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
              <h3 style={{ margin: 0 }}>{formData.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-light)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '14px' }}>Tên Danh Mục <span style={{color: 'red'}}>*</span></label>
                <input type="text" placeholder="VD: Điện thoại" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, fontSize: '14px' }}>Đường dẫn (Slug) <span style={{color: 'red'}}>*</span></label>
                <input type="text" placeholder="VD: dien-thoai" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}>Hủy bỏ</button>
                <button type="submit" disabled={loading} style={{ background: 'var(--brand)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 600 }}>{loading ? 'Đang lưu...' : 'Lưu danh mục'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-table-wrap">
        <div className="table-header">
          <div className="table-title">Danh sách danh mục</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Đường dẫn (Slug)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign: 'center', padding: '30px'}}>Chưa có danh mục nào. Hãy thêm mới!</td></tr>
            ) : (
              categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>
                    <button onClick={() => handleEdit(c)} style={{ marginRight: '10px', background: 'var(--warn)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
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
