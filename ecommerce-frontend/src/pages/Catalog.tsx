import { useEffect, useState } from 'react';
import { ShoppingCart, Search, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const getFallbackImage = (name: string) => {
  if (!name) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Controller')) return 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('VR')) return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Keyboard')) return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Audio')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500&h=500';
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
}

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <Zap className="text-gradient" size={28} />
            <span>Teknix<span className="text-gradient">Store</span></span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/catalog" className="nav-item active">Catalog</Link>
            <Link to="/admin" className="nav-item">Admin Dashboard</Link>
          </div>

          <div className="nav-actions">
            <button className="btn-icon"><Search size={20} /></button>
            <button className="btn-icon"><User size={20} /></button>
            <button className="btn-icon" style={{position: 'relative'}}>
              <ShoppingCart size={20} />
              <span style={{position: 'absolute', top: 0, right: 0, background: 'var(--primary)', fontSize: '0.6rem', width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white'}}>3</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="text-gradient">All Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Browse our complete collection of premium tech gadgets and accessories.
          </p>
        </div>

        {loading ? (
          <div className="loading">Loading catalog...</div>
        ) : (
          <div className="grid">
            {products.map((product) => (
              <div key={product.id} className="product-card glass">
                <Link to={`/product/${product.id}`} className="product-image-wrap" style={{ display: 'block' }}>
                  <img src={getFallbackImage(product.name)} alt={product.name} className="product-image" />
                </Link>
                <div className="product-info">
                  <div>
                    <div className="product-category">{product.category?.name || 'GADGETS'}</div>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 className="product-title">{product.name}</h3>
                    </Link>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <button className="add-to-cart">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
