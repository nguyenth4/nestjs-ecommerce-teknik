import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import '../index.css';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    categoryId: '',
    status: 'active',
    imageUrl: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:3000/products'),
        axios.get('http://localhost:3000/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:3000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert('Unauthorized! You need an Admin token to delete products.');
        } else {
          console.error('Error deleting product:', error);
        }
      }
    }
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        categoryId: product.categoryId || (categories.length > 0 ? categories[0].id : ''),
        status: product.status,
        imageUrl: product.imageUrl || ''
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        sku: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : '',
        status: 'active',
        imageUrl: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setFormError(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let finalImageUrl = formData.imageUrl;

      // Upload image first if a new file is selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await axios.post('http://localhost:3000/products/upload', uploadData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        finalImageUrl = uploadRes.data.url;
      }
      
      const payload: any = {
        ...formData,
        price: Number(formData.price),
        imageUrl: finalImageUrl
      };
      
      if (!payload.sku || payload.sku.trim() === '') {
        delete payload.sku;
      }

      if (editingId) {
        await axios.patch(`http://localhost:3000/products/${editingId}`, payload, config);
      } else {
        await axios.post('http://localhost:3000/products', payload, config);
      }
      
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setFormError('Unauthorized! You need Admin/Staff token to perform this action.');
      } else {
        console.error('Error saving product:', error);
        setFormError(error.response?.data?.message || 'Failed to save product');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Image</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>SKU</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {product.sku || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>No SKU</span>}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: !product.price ? '#f87171' : undefined }}>
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: product.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                      color: product.status === 'active' ? '#34d399' : '#f87171',
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' 
                    }}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" style={{ color: 'var(--accent)' }} onClick={() => openModal(product)}><Edit size={18} /></button>
                      <button className="btn-icon" style={{ color: '#f87171' }} onClick={() => handleDelete(product.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              className="btn-icon" 
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            {formError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input" 
                  style={{ padding: '0.5rem' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} 
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>SKU (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.sku} 
                  onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                  placeholder="Leave empty to auto-generate"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  className="form-input" 
                  required 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-input" 
                  required 
                  value={formData.categoryId} 
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-input" 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
