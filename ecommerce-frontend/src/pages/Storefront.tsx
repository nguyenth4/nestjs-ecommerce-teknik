import { useEffect, useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatPrice } from '../utils/formatters';
import StoreNav from '../components/StoreNav';
import { useCart } from '../context/CartContext';
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
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  const handleQuickAdd = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(productId, 1);
    } catch {
      navigate('/account/login', { state: { from: '/' } });
    }
  };

  return (
    <div className="app-wrapper">
      <StoreNav />
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
            <Link to="/catalog" className="btn btn-icon" style={{background: 'rgba(255,255,255,0.05)', fontSize: '1rem', padding: '0.5rem 1.5rem', borderRadius: 20, textDecoration: 'none'}}>View All</Link>
          </h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="grid">
              {products.map((product) => (
                <div key={product.id} className="product-card glass">
                  <Link to={`/product/${product.id}`} className="product-image-wrap" style={{ display: 'block' }}>
                    <img src={product.imageUrl || getFallbackImage(product.name)} alt={product.name} className="product-image" />
                  </Link>
                  <div className="product-info">
                    <div>
                      <div className="product-category">{product.category?.name || 'GADGETS'}</div>
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="product-title">{product.name}</h3>
                      </Link>
                    </div>
                    <div className="product-footer">
                      <div className="product-price" style={{ color: !product.price ? '#f87171' : undefined }}>
                        {formatPrice(product.price)}
                      </div>
                      <button
                        type="button"
                        className="add-to-cart"
                        disabled={!product.price}
                        style={{ opacity: !product.price ? 0.5 : 1, cursor: !product.price ? 'not-allowed' : 'pointer' }}
                        title={!product.price ? 'Hết hàng' : 'Add to cart'}
                        onClick={(e) => void handleQuickAdd(e, product.id)}
                      >
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
