import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Minus, Plus, Zap, Search, User } from 'lucide-react';
import '../index.css';

// Reuse fallback image logic from Storefront
const getFallbackImage = (name: string) => {
  if (!name) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Controller')) return 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('VR')) return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Keyboard')) return 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500&h=500';
  if (name.includes('Audio')) return 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500&h=500';
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500';
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="app-wrapper">
        <div className="loading" style={{ height: '100vh' }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-wrapper">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
            Return to Store
          </button>
        </div>
      </div>
    );
  }

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
            <Link to="/catalog" className="nav-item">Catalog</Link>
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
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-icon" style={{ display: 'inline-flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="product-detail-container">
          {/* Image Column */}
          <div className="glass product-detail-image-wrap">
            <img 
              src={getFallbackImage(product.name)} 
              alt={product.name} 
              className="product-detail-image" 
            />
          </div>

          {/* Info Column */}
          <div className="product-detail-info">
            <div className="product-detail-category">
              {product.category?.name || 'GADGETS'}
            </div>
            
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-price">
              ${product.price.toFixed(2)}
              <span className="product-detail-sku">SKU: {product.sku || 'N/A'}</span>
            </div>
            
            <p className="product-detail-desc">
              Experience the next level of innovation with the {product.name}. 
              Designed with premium materials and cutting-edge technology to elevate your daily setup. 
              Enjoy seamless connectivity, ergonomic comfort, and unparalleled performance that only TeknixStore can provide.
            </p>
            
            <div className="product-detail-actions">
              <div className="quantity-selector">
                <button className="quantity-btn" onClick={handleDecrease}><Minus size={18} /></button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn" onClick={handleIncrease}><Plus size={18} /></button>
              </div>
              
              <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
            
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '2rem' }}>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Status: </strong>
                <span style={{ color: product.status === 'active' ? '#10b981' : 'var(--text-muted)' }}>
                  {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
