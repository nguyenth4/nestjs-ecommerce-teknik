import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import StoreNav from '../components/StoreNav';
import { formatPrice } from '../utils/formatters';
import { getStoreAuthToken } from '../utils/storeAuth';
import '../index.css';

const API = 'http://localhost:3000';

type OrderRow = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { id: string; name: string; price: number; quantity: number }[];
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [err, setErr] = useState('');
  const [payBusy, setPayBusy] = useState(false);
  const [payNote, setPayNote] = useState<string | null>(null);

  useEffect(() => {
    const t = getStoreAuthToken();
    if (!id || !t) {
      setErr('Thiếu thông tin hoặc chưa đăng nhập.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get<OrderRow>(`${API}/orders/${id}`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (!cancelled) {
          setOrder(data);
          setErr('');
        }
      } catch {
        if (!cancelled) setErr('Không tải được đơn hàng.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const t = getStoreAuthToken();
    if (!id || !t) return;
    const socket: Socket = io(`${API}/orders`, {
      auth: { token: t },
      transports: ['websocket', 'polling'],
    });
    socket.on('order:status', (p: { orderId: string; status: string }) => {
      if (p.orderId === id) {
        setOrder((prev) => (prev ? { ...prev, status: p.status } : prev));
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [id]);

  const mapOrder = (raw: OrderRow): OrderRow => ({
    id: raw.id,
    status: raw.status,
    totalAmount: raw.totalAmount,
    createdAt: raw.createdAt,
    items: raw.items.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      quantity: it.quantity,
    })),
  });

  const runMockPay = async (succeed: boolean) => {
    const t = getStoreAuthToken();
    if (!order || !t) return;
    setPayBusy(true);
    setPayNote(null);
    try {
      const { data } = await axios.post<{ order: OrderRow; status: string }>(
        `${API}/payments/mock`,
        { orderId: order.id, succeed },
        { headers: { Authorization: `Bearer ${t}` } },
      );
      if (data?.order) setOrder(mapOrder(data.order));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.message;
        setPayNote(typeof msg === 'string' ? msg : 'Thanh toán giả thất bại.');
      } else {
        setPayNote('Thanh toán giả thất bại.');
      }
    } finally {
      setPayBusy(false);
    }
  };

  return (
    <div className="app-wrapper">
      <StoreNav />
      <main className="container" style={{ padding: '2rem 1rem 4rem', maxWidth: 560 }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Đơn hàng
        </h1>

        {err && (
          <div className="glass-panel" style={{ padding: '1.5rem', color: '#fca5a5' }}>
            {err}{' '}
            <Link to="/account/login" className="text-gradient">
              Đăng nhập
            </Link>
          </div>
        )}

        {order && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mã đơn</p>
            <p style={{ fontFamily: 'monospace', marginBottom: '1rem' }}>{order.id}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Trạng thái</p>
            <p style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{order.status}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thời gian</p>
            <p style={{ marginBottom: '1rem' }}>{new Date(order.createdAt).toLocaleString('vi-VN')}</p>

            <h2 style={{ fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>Sản phẩm</h2>
            {order.items.map((it) => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span>
                  {it.name} × {it.quantity}
                </span>
                <span>{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Tổng</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>

            {order.status === 'pending' && (
              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Thanh toán giả lập (PDF N3-T07)</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-primary" disabled={payBusy} onClick={() => runMockPay(true)}>
                    {payBusy ? 'Đang xử lý…' : 'Giả lập: thành công'}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ border: '1px solid var(--glass-border)' }}
                    disabled={payBusy}
                    onClick={() => runMockPay(false)}
                  >
                    Giả lập: thất bại
                  </button>
                </div>
              </div>
            )}
            {payNote && (
              <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginTop: '0.75rem' }}>{payNote}</p>
            )}

            <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', textDecoration: 'none' }}>
              Về trang chủ
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
