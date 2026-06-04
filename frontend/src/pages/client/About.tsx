export default function About() {
  return (
    <div className="section">
      <div className="section-head">
        <h2>Về chúng tôi</h2>
        <p>Tìm hiểu thêm về ShopFlow</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'var(--font-head)' }}>Sứ mệnh của chúng tôi</h3>
          <p style={{ marginBottom: '16px', lineHeight: '1.8', color: 'var(--text2)' }}>
            ShopFlow được thành lập với mục tiêu mang đến trải nghiệm mua sắm trực tuyến tuyệt vời nhất cho khách hàng.
            Chúng tôi cam kết cung cấp các sản phẩm chất lượng cao, dịch vụ khách hàng tận tâm và giá cả hợp lý.
          </p>
          <p style={{ marginBottom: '16px', lineHeight: '1.8', color: 'var(--text2)' }}>
            Với đội ngũ trẻ trung, năng động và giàu nhiệt huyết, chúng tôi không ngừng cải tiến hệ thống và quy trình
            để mang lại những giá trị tốt nhất cho cộng đồng.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-head)' }}>10K+</div>
              <div style={{ fontSize: '14px', color: 'var(--text3)' }}>Khách hàng</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-head)' }}>5K+</div>
              <div style={{ fontSize: '14px', color: 'var(--text3)' }}>Sản phẩm</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-head)' }}>99%</div>
              <div style={{ fontSize: '14px', color: 'var(--text3)' }}>Hài lòng</div>
            </div>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Team" style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-md)', objectFit: 'cover', height: '400px' }} />
        </div>
      </div>
    </div>
  );
}
