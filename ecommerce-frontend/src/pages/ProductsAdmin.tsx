import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import '../index.css';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:3000/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error: any) {
        if (error.response?.status === 401) {
          alert('Unauthorized! You need an Admin token to delete products. Please log out and log back in.');
        } else {
          console.error('Error deleting product:', error);
        }
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Manage Products</h1>
        <button className="btn btn-primary" onClick={() => alert('Create Form coming soon!')}>
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
                  <td style={{ padding: '1rem' }}>{product.sku}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
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
                      <button className="btn-icon" style={{ color: 'var(--accent)' }}><Edit size={18} /></button>
                      <button className="btn-icon" style={{ color: '#f87171' }} onClick={() => handleDelete(product.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
