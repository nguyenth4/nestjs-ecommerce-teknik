import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import StoreNav from '../components/StoreNav';
import { setCustomerToken, notifyStoreAuthChanged } from '../utils/storeAuth';
import '../index.css';

export default function AccountLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      const token = response.data.access_token as string | undefined;
      if (!token) {
        setError('Không nhận được token từ máy chủ.');
        return;
      }
      setCustomerToken(token);
      notifyStoreAuthChanged();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Email hoặc mật khẩu không đúng.');
      } else {
        setError('Đăng nhập thất bại. Kiểm tra backend đã chạy chưa.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <StoreNav />
      <main className="container" style={{ padding: '3rem 1rem', maxWidth: 440, margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.2)',
                marginBottom: '1rem',
              }}
            >
              <LogIn size={32} className="text-gradient" />
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Đăng nhập cửa hàng</h1>
            <p style={{ color: 'var(--text-muted)' }}>Dùng tài khoản khách để thêm giỏ hàng và đặt hàng</p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '4px solid #ef4444',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fca5a5',
                fontSize: '0.875rem',
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--text-muted)',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    outline: 'none',
                  }}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--text-muted)',
                }}
              >
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    outline: 'none',
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Chưa có tài khoản?{' '}
            <Link to="/account/register" className="text-gradient" style={{ fontWeight: 600 }}>
              Đăng ký
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
