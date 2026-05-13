import { Activity, Users, DollarSign, Package } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: <DollarSign size={24} className="text-gradient" /> },
    { title: 'Active Users', value: '+2350', change: '+180.1% from last month', icon: <Users size={24} className="text-gradient" /> },
    { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: <Activity size={24} className="text-gradient" /> },
    { title: 'Active Products', value: '573', change: '+201 since last hour', icon: <Package size={24} className="text-gradient" /> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.title}</div>
              {stat.icon}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
