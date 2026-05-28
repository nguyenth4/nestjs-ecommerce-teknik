export default function Shop() {
  return (
    <div className="section">
      <div className="section-head">
        <div><h2>Tất cả sản phẩm</h2><p>1.289 sản phẩm</p></div>
      </div>
      <div className="shop-layout">
        <aside className="filter-sidebar">
          <h3>🔽 Bộ lọc</h3>
          <div className="filter-group">
            <label>Danh mục</label>
            <div className="filter-check"><input type="checkbox" defaultChecked /> Điện thoại (142)</div>
            <div className="filter-check"><input type="checkbox" /> Laptop (89)</div>
          </div>
        </aside>
        <div className="shop-products">
          <div className="product-grid">
            <div className="product-card">
              <div className="product-img"><div className="product-img-inner">📱</div></div>
              <div className="product-info">
                <div className="product-cat">Điện thoại</div>
                <div className="product-name">iPhone 16 Pro 128GB</div>
                <div className="product-meta">
                  <div className="product-price">26.990.000đ</div>
                  <button className="add-cart-btn">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
