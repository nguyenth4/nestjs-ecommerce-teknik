import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Tags } from 'lucide-react';

const API = 'http://localhost:3000';

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  _count?: { products: number };
}

const emptyForm = { name: '', slug: '', isActive: true };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem('adminToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/categories/admin/list`, { headers: authHeader });
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData({ name: cat.name, slug: cat.slug, isActive: cat.isActive });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setFormError(null);
    setShowModal(true);
  };

  const handleNameChange = (name: string) => {
    const autoSlug = name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(f => ({ ...f, name, slug: editingId ? f.slug : autoSlug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      const payload = { name: formData.name.trim(), slug: formData.slug.trim() || undefined, isActive: formData.isActive };
      if (editingId) {
        await axios.patch(`${API}/categories/${editingId}`, payload, { headers: authHeader });
      } else {
        await axios.post(`${API}/categories`, payload, { headers: authHeader });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/categories/${cat.id}`, { headers: authHeader });
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tags size={28} className="text-gradient" /> Manage Categories
        </h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Slug', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <code style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{cat.slug}</code>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: cat.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      color: cat.isActive ? '#34d399' : '#f87171',
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem'
                    }}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" style={{ color: 'var(--accent)' }} onClick={() => openModal(cat)} title="Edit">
                        <Edit size={17} />
                      </button>
                      <button className="btn-icon" style={{ color: '#f87171' }} onClick={() => handleDelete(cat)} title="Delete">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No categories yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '2rem', position: 'relative' }}>
            <button className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem' }} onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>

            {formError && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Name <span style={{ color: '#f87171' }}>*</span></label>
                <input className="form-input" required value={formData.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Laptop" />
              </div>
              <div className="form-group">
                <label>Slug <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(auto-generated)</span></label>
                <input className="form-input" value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. laptop" />
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                <label style={{ marginBottom: 0 }}>Active</label>
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
