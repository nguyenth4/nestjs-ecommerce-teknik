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

Mở một Terminal (Command Prompt / PowerShell) tại thư mục gốc của dự án và thực hiện các bước sau:

**Bước 1.1:** Khởi chạy Cơ sở dữ liệu (PostgreSQL)
Dự án sử dụng PostgreSQL. Bạn cần sử dụng Docker để chạy nhanh DB thông qua Docker Compose:
```bash
docker-compose up -d
```

**Bước 1.2:** Di chuyển vào thư mục backend và cài đặt thư viện
```bash
cd backend
npm install
```

**Bước 1.3:** Khởi tạo cấu trúc Database và Dữ liệu mẫu (Migration & Seed)
```bash
npx prisma migrate dev
npx prisma db seed
```

**Bước 1.4:** Khởi chạy server ở chế độ Development
```bash
npm run start:dev
```

*Sau khi chạy thành công, API Server sẽ lắng nghe tại cổng `3000`.*
* Truy cập API Docs (Swagger) để test API: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)


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

## 🌟 Các tính năng chính

1. **Frontend:**
   - Single Page Application (SPA) với React Router.
   - Giao diện Client (Trang chủ, Sản phẩm, Đơn hàng, v.v).
   - Giao diện Admin Dashboard (Bảng điều khiển độc lập).
2. **Backend:**
   - Cấu trúc kiến trúc Feature Module chuẩn NestJS.
   - Cơ sở dữ liệu PostgreSQL quản lý bởi Prisma ORM.
   - Các API CRUD có sẵn cho `Product`, `Category` và các đối tượng khác.
   - Hệ thống Xác thực (Auth) bằng JWT Token & Refresh Token.
   - Phân quyền (RBAC) nghiêm ngặt theo các Role (ADMIN, MANAGER, USER).
   - Hệ thống tự động ghi nhật ký (Audit Log) các thao tác quản lý dữ liệu.
   - Global Validation bằng DTO (chặn request sai định dạng).
   - Global Response Interceptor & Exception Filter (định dạng trả về đồng nhất).
   - Tài liệu API tương tác trực tiếp qua Swagger UI.
   - Jest Unit Tests.

---

## 🧪 Chạy Kiểm Thử (Unit Tests)
Để chạy các bài Unit Test cho API logic ở backend:
```bash
cd backend
npm run test
```
