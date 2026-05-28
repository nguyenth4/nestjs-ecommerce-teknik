import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="client-home">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-tag">Đỉnh cao âm thanh 2025</div>
          <h1>Trải nghiệm <em>vượt</em><br/>giới hạn</h1>
          <p>Khám phá bộ sưu tập thiết bị âm thanh và công nghệ đẳng cấp thế giới. Thiết kế sang trọng, hiệu năng vượt trội.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-primary">Mua ngay</Link>
            <Link to="/shop" className="btn btn-outline">Tìm hiểu thêm</Link>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-head">
          <div>
            <h2>Sản phẩm nổi bật</h2>
            <p>Những thiết bị được yêu thích nhất trong tháng</p>
          </div>
          <Link to="/shop" className="btn btn-ghost">Xem tất cả →</Link>
        </div>
        <div className="product-grid">
          
          <div className="product-card">
            <div className="product-img">
              <div className="product-img-inner" style={{ backgroundImage: "url('/images/product_headphone_1779884480003.png')" }}></div>
              <div className="product-wishlist">♡</div>
              <div className="product-badge badge-new">MỚI</div>
            </div>
            <div className="product-info">
              <div className="product-cat">Tai nghe Chụp tai</div>
              <div className="product-name">Wireless Over-Ear Studio Pro</div>
              <div className="product-meta">
                <div className="product-price">8.990.000đ</div>
                <button className="add-cart-btn">+</button>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-img">
              <div className="product-img-inner" style={{ backgroundImage: "url('/images/product_watch_1779884495619.png')" }}></div>
              <div className="product-wishlist">♡</div>
            </div>
            <div className="product-info">
              <div className="product-cat">Smartwatch</div>
              <div className="product-name">Luxury Smart Chrono</div>
              <div className="product-meta">
                <div className="product-price">12.500.000đ</div>
                <button className="add-cart-btn">+</button>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-img">
              <div className="product-img-inner" style={{ backgroundImage: "url('/images/product_speaker_1779884510948.png')" }}></div>
              <div className="product-wishlist">♡</div>
              <div className="product-badge badge-sale">-15%</div>
            </div>
            <div className="product-info">
              <div className="product-cat">Loa Bluetooth</div>
              <div className="product-name">Portable SoundBox Extreme</div>
              <div className="product-meta">
                <div className="product-price">4.250.000đ <span className="product-price-old">5.000.000đ</span></div>
                <button className="add-cart-btn">+</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
