# ShopFlow E-Commerce

Dự án ShopFlow là một hệ thống thương mại điện tử hoàn chỉnh, được chia làm hai khối chính: **Frontend** (React + Vite) và **Backend** (NestJS). Tài liệu này hướng dẫn bạn cách thiết lập và chạy dự án trên môi trường cục bộ (local).

---

## 📁 Cấu trúc thư mục

```text
nestjs-teknix/
├── backend/          # Chứa mã nguồn Backend (API) viết bằng NestJS 11
└── frontend/         # Chứa mã nguồn Frontend (Client & Admin) viết bằng React + Vite
```

---

## 🚀 Hướng dẫn khởi chạy dự án

### 1. Khởi chạy Backend (NestJS)

Mở một Terminal (Command Prompt / PowerShell) và thực hiện các bước sau:

**Bước 1.1:** Di chuyển vào thư mục backend
```bash
cd backend
```

**Bước 1.2:** Cài đặt các gói thư viện phụ thuộc
```bash
npm install
```

**Bước 1.3:** Khởi chạy server ở chế độ Development
```bash
npm run start:dev
```

*Sau khi chạy thành công, API Server sẽ lắng nghe tại cổng `3000`.*
* Truy cập API Docs (Swagger): [http://localhost:3000/api/docs](http://localhost:3000/api/docs)


### 2. Khởi chạy Frontend (React + Vite)

Mở một Terminal (Command Prompt / PowerShell) **MỚI** và thực hiện các bước sau:

**Bước 2.1:** Di chuyển vào thư mục frontend
```bash
cd frontend
```

**Bước 2.2:** Cài đặt các gói thư viện phụ thuộc
```bash
npm install
```

**Bước 2.3:** Khởi chạy ứng dụng Frontend
```bash
npm run dev
```

*Vite sẽ tự động cấp phát một cổng (ví dụ `5173`). Bạn mở trình duyệt và truy cập vào đường dẫn được thông báo ở Terminal (VD: `http://localhost:5173`) để sử dụng giao diện hệ thống.*

---

## 🌟 Các tính năng chính (Tuần 1)

1. **Frontend:**
   - Single Page Application (SPA) với React Router.
   - Giao diện Client (Trang chủ, Sản phẩm, Đơn hàng, v.v).
   - Giao diện Admin Dashboard (Bảng điều khiển độc lập).
2. **Backend:**
   - Cấu trúc kiến trúc Feature Module chuẩn.
   - Các API CRUD có sẵn cho `Product` và `Category`.
   - Global Validation bằng DTO (chặn request sai định dạng).
   - Global Response Interceptor & Exception Filter (định dạng trả về đồng nhất).
   - Swagger API Documentation.
   - Jest Unit Tests.

---

## 🧪 Chạy Kiểm Thử (Unit Tests)
Để chạy các bài Unit Test cho API logic ở backend:
```bash
cd backend
npm run test
```
