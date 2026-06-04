import React from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
  };

  return (
    <div className="section">
      <div className="section-head" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <div>
          <h2>Liên hệ với chúng tôi</h2>
          <p>Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px' }}>
        <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '24px' }}>Thông tin liên hệ</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-light)', color: 'var(--brand)', borderRadius: '50%' }}>📍</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Địa chỉ</div>
              <div style={{ color: 'var(--text2)', fontSize: '14px' }}>123 Đường Tự Do, Phường 1, Quận 1, TP.HCM</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-light)', color: 'var(--brand)', borderRadius: '50%' }}>📞</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Điện thoại</div>
              <div style={{ color: 'var(--text2)', fontSize: '14px' }}>1900 1234</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-light)', color: 'var(--brand)', borderRadius: '50%' }}>✉️</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Email</div>
              <div style={{ color: 'var(--text2)', fontSize: '14px' }}>support@shopflow.vn</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="form-group">
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Họ và tên</label>
              <input type="text" className="form-input" style={{ width: '100%' }} required placeholder="Nhập họ và tên của bạn" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" className="form-input" style={{ width: '100%' }} required placeholder="Nhập email của bạn" />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Tin nhắn</label>
              <textarea className="form-input" style={{ width: '100%', minHeight: '120px', resize: 'vertical' }} required placeholder="Nội dung tin nhắn..."></textarea>
            </div>
            <button type="submit" className="btn btn-brand" style={{ width: '100%' }}>Gửi tin nhắn</button>
          </form>
        </div>
      </div>
    </div>
  );
}
