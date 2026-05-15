import { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import '../index.css';

const API = 'http://localhost:3000';

type OrderAdmin = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: { email: string; fullName: string };
  items: { id: string; name: string; quantity: number; price: number }[];
};

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'] as const;

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [error, setError] = useState('');
  const [wsHint, setWsHint] = useState('');

  const load = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    axios
      .get<OrderAdmin[]>(`${API}/orders/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        setOrders(r.data);
        setError('');
      })
      .catch(() => setError('Không tải được danh sách đơn (cần quyền Admin/Staff).'));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    const socket: Socket = io(`${API}/orders`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => setWsHint('WebSocket: đã kết nối'));
    socket.on('disconnect', () => setWsHint('WebSocket: ngắt kết nối'));
    socket.on('order:status', (p: { orderId: string; status: string }) => {
      setOrders((prev) => prev.map((o) => (o.id === p.orderId ? { ...o, status: p.status } : o)));
      setWsHint(`Cập nhật realtime: ${p.orderId.slice(0, 8)}… → ${p.status}`);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const patchStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      await axios.patch(
        `${API}/orders/admin/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch {
      setError('Không cập nhật được trạng thái.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Đơn hàng</h1>
        <button type="button" className="btn btn-icon" onClick={() => load()} style={{ textDecoration: 'none' }}>
          Làm mới
        </button>
      </div>
      {wsHint && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {wsHint}
        </p>
      )}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', padding: '1rem', borderRadius: 8, marginBottom: '1rem', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Khách</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trạng thái</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Đổi trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 500 }}>{o.user?.fullName ?? '—'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{o.user?.email}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{o.id}</div>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount)}
                </td>
                <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>{o.status}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <select
                    value={o.status}
                    onChange={(e) => void patchStatus(o.id, e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: 6,
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(0,0,0,0.25)',
                      color: 'var(--text-main)',
                      fontFamily: 'inherit',
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !error && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Chưa có đơn hoặc đang tải…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
