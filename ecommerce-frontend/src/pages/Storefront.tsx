import { useEffect, useState } from 'react';
import { ShoppingCart, Search, User, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

// Fallback images matching the ones from the mock data based on names
const getFallbackImage = (name: string) => {
  if (name.includes('Controller')) return 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('VR')) return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Keyboard')) return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Audio')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500&h=500';
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
}

export default function Storefront() {
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
            <Link to="/" className="nav-item active">Home</Link>
            <a href="#" className="nav-item">Catalog</a>
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

      <main className="container">
        <section className="hero">
          <h1>Experience the <span className="text-gradient">Future</span> of Tech</h1>
          <p>Discover premium gadgets designed with cutting-edge technology and unparalleled aesthetics. Elevate your setup today.</p>
          <button className="btn btn-primary" style={{marginTop: '1rem'}}>
            <Star size={18} fill="currentColor" />
            Shop Latest Collection
          </button>
        </section>

        <section className="products-section">
          <h2 className="section-title">
            Trending Now
            <button className="btn btn-icon" style={{background: 'rgba(255,255,255,0.05)', fontSize: '1rem', padding: '0.5rem 1.5rem', borderRadius: 20}}>View All</button>
          </h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="grid">
              {products.map((product) => (
                <div key={product.id} className="product-card glass">
                  <div className="product-image-wrap">
                    <img src={getFallbackImage(product.name)} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-info">
                    <div>
                      <div className="product-category">{product.category?.name || 'GADGETS'}</div>
                      <h3 className="product-title">{product.name}</h3>
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
        </section>
      </main>
    </div>
  );
}
