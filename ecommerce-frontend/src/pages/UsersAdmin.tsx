import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, ShieldCheck, UserX, UserCheck, RefreshCw } from 'lucide-react';

const API = 'http://localhost:3000';

interface Role { id: string; name: string; }
interface User {
  id: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive' | 'blocked';
  role: Role;
  createdAt: string;
}

const STATUS_OPTIONS = ['active', 'inactive', 'blocked'] as const;
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:   { bg: 'rgba(16,185,129,0.2)',  color: '#34d399' },
  inactive: { bg: 'rgba(251,191,36,0.2)',  color: '#fbbf24' },
  blocked:  { bg: 'rgba(239,68,68,0.2)',   color: '#f87171' },
};
const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:    { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  staff:    { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
  customer: { bg: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' },
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {initials.toUpperCase()}
    </div>
  );
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const token = localStorage.getItem('adminToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        axios.get(`${API}/users/admin/list`, { headers: authHeader }),
        axios.get(`${API}/users/admin/roles`, { headers: authHeader }),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (user: User, status: typeof STATUS_OPTIONS[number]) => {
    setUpdatingId(user.id);
    try {
      const res = await axios.patch(`${API}/users/admin/${user.id}/status`, { status }, { headers: authHeader });
      setUsers(prev => prev.map(u => u.id === user.id ? res.data : u));
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const updateRole = async (user: User, roleId: string) => {
    setUpdatingId(user.id);
    try {
      const res = await axios.patch(`${API}/users/admin/${user.id}/role`, { roleId }, { headers: authHeader });
      setUsers(prev => prev.map(u => u.id === user.id ? res.data : u));
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to update role'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={28} className="text-gradient" /> Manage Users
        </h1>
        <button className="btn" style={{ border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={fetchData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const sc = STATUS_COLORS[user.status] ?? STATUS_COLORS.inactive;
                const rc = ROLE_COLORS[user.role?.name] ?? ROLE_COLORS.customer;
                const isUpdating = updatingId === user.id;
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)', opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Initials name={user.fullName} />
                        <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{user.fullName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <select
                        value={user.role?.id ?? ''}
                        disabled={isUpdating}
                        onChange={e => updateRole(user, e.target.value)}
                        style={{ backgroundColor: rc.bg, color: rc.color, border: 'none', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {roles.map(r => <option key={r.id} value={r.id} style={{ backgroundColor: 'var(--bg-card)', color: 'white' }}>{r.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <select
                        value={user.status}
                        disabled={isUpdating}
                        onChange={e => updateStatus(user, e.target.value as typeof STATUS_OPTIONS[number])}
                        style={{ backgroundColor: sc.bg, color: sc.color, border: 'none', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ backgroundColor: 'var(--bg-card)', color: 'white' }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user.status !== 'blocked' ? (
                          <button title="Block user" className="btn-icon" style={{ color: '#f87171' }} onClick={() => updateStatus(user, 'blocked')} disabled={isUpdating}>
                            <UserX size={17} />
                          </button>
                        ) : (
                          <button title="Unblock user" className="btn-icon" style={{ color: '#34d399' }} onClick={() => updateStatus(user, 'active')} disabled={isUpdating}>
                            <UserCheck size={17} />
                          </button>
                        )}
                        <span title={`Role: ${user.role?.name}`}>
                          <ShieldCheck size={17} style={{ color: 'var(--text-muted)', display: 'block' }} />
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
