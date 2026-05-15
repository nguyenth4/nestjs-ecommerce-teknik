import { useEffect, useState } from 'react';
import { Activity, Users, DollarSign, Package, Database, Server, RefreshCw, ShoppingBag, Tags } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:3000';

interface HealthCheck { status: 'ok' | 'degraded'; checks: { database: string; redis: string }; timestamp: string; }

function StatCard({ title, value, sub, icon, loading }: { title: string; value: string | number; sub?: string; icon: React.ReactNode; loading: boolean }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</div>
        {icon}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        {loading ? <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Loading…</span> : value}
      </div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function HealthBadge({ label, status }: { label: string; status: string }) {
  const up = status === 'up';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: up ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '8px', border: `1px solid ${up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: up ? '#34d399' : '#f87171', display: 'inline-block', boxShadow: up ? '0 0 6px #34d399' : '0 0 6px #f87171' }} />
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: up ? '#34d399' : '#f87171', fontWeight: 600 }}>{up ? 'UP' : 'DOWN'}</span>
    </div>
  );
}

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function Dashboard() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0, pendingOrders: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const token = localStorage.getItem('adminToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [healthRes, productsRes, ordersRes, usersRes, categoriesRes] = await Promise.allSettled([
        axios.get(`${API}/health`),
        axios.get(`${API}/products`),
        axios.get(`${API}/orders/admin/list`, { headers: authHeader }),
        axios.get(`${API}/users/admin/list`, { headers: authHeader }),
        axios.get(`${API}/categories/admin/list`, { headers: authHeader }),
      ]);

      if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);

      const products = productsRes.status === 'fulfilled' ? productsRes.value.data : [];
      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];
      const users = usersRes.status === 'fulfilled' ? usersRes.value.data : [];
      const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data : [];

      const revenue = orders.filter((o: any) => o.status !== 'cancelled').reduce((sum: number, o: any) => sum + (o.totalAmount ?? 0), 0);
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

      setStats({ products: products.length, users: users.length, orders: orders.length, revenue, pendingOrders, categories: categories.length });
      setLastRefresh(new Date());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Dashboard Overview</h1>
        <button className="btn" style={{ border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }} onClick={fetchAll}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Revenue" value={formatVND(stats.revenue)} sub="Excluding cancelled orders" icon={<DollarSign size={24} className="text-gradient" />} loading={loading} />
        <StatCard title="Total Orders" value={stats.orders} sub={`${stats.pendingOrders} pending`} icon={<ShoppingBag size={24} className="text-gradient" />} loading={loading} />
        <StatCard title="Active Users" value={stats.users} sub="All registered accounts" icon={<Users size={24} className="text-gradient" />} loading={loading} />
        <StatCard title="Products" value={stats.products} sub={`${stats.categories} categories`} icon={<Package size={24} className="text-gradient" />} loading={loading} />
        <StatCard title="Categories" value={stats.categories} sub="Total categories" icon={<Tags size={24} className="text-gradient" />} loading={loading} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} sub="Awaiting confirmation" icon={<Activity size={24} className="text-gradient" />} loading={loading} />
      </div>

      {/* Health Status */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={18} /> System Health
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Last checked: {lastRefresh.toLocaleTimeString('vi-VN')}
          </span>
        </div>
        {health ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <HealthBadge label="Database (PostgreSQL)" status={health.checks.database} />
            <HealthBadge label="Cache (Redis)" status={health.checks.redis} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Database (PostgreSQL)', 'Cache (Redis)'].map(label => (
              <div key={label} style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Database size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />{label}: checking…
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

