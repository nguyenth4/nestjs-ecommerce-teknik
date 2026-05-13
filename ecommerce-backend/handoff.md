# 🚀 Project Handoff: Teknik E-commerce Platform

**Ngày cập nhật:** 12/05/2026
**Mô tả:** Tài liệu bàn giao dự án hệ thống E-commerce bao gồm Backend (NestJS) và Frontend (React) cùng các cấu hình hạ tầng hiện có. Dùng để tiếp tục phát triển hoặc bàn giao cho team khác.

---

## 1. Tổng quan Kiến trúc (Architecture)

Dự án được chia làm 2 phần chính nằm trong cùng một thư mục cha (`d:\Code\teknik`):

*   **Backend (`/ecommerce-backend`):** Xây dựng bằng **NestJS** (v11), **TypeScript**, **Prisma ORM (v5)**, kết nối **PostgreSQL** và **Redis** qua Docker Compose. (Đã đẩy lên kho lưu trữ GitHub: `https://github.com/nguyenth4/nestjs-ecommerce-teknik.git`).
*   **Frontend (`/ecommerce-frontend`):** Xây dựng bằng **Vite + React + TypeScript**, sử dụng kiến trúc CSS thuần tuỳ chỉnh (Glassmorphism, Dark Theme) thay vì thư viện cồng kềnh.

---

## 2. Trạng thái hiện tại (Đã hoàn thành)

### 2.1. Hạ tầng & Database
- [x] Thiết lập `docker-compose.yml` (PostgreSQL `5432` & Redis `6379`).
- [x] Schema Database (`prisma/schema.prisma`) đã hoàn chỉnh cho tất cả các thực thể: User, Role, Product, Category, Inventory, Cart, Order...
- [x] Script tự động tạo dữ liệu mẫu:
  - `npx ts-node prisma/seed.ts` (Tạo dữ liệu Sản phẩm & Category).
  - `npx ts-node prisma/admin-seed.ts` (Tạo tài khoản Super Admin).

### 2.2. Backend (NestJS APIs)
- [x] **Authentication & Security:** Hệ thống Đăng nhập / Đăng ký (`AuthModule`), mã hóa mật khẩu `bcrypt`, cấp phát JWT Token (`JwtStrategy`), và Bảo vệ API theo phân quyền (`RolesGuard` - Admin/Staff/Customer).
- [x] **Products API:** Xây dựng đầy đủ CRUD (`ProductsController`).
  - Lấy danh sách (`GET`): Đã cấu hình Public (Không cần Token) để Storefront có thể hiển thị.
  - Thêm/Sửa/Xóa (`POST`, `PATCH`, `DELETE`): Yêu cầu quyền Admin/Staff.
- [x] Cấu hình CORS để cho phép Frontend (`localhost:5173`) gọi API thoải mái.

### 2.3. Frontend (React UI)
- [x] Cấu trúc UI hiện đại cấp cao (Premium Aesthetics) với Glassmorphism và CSS Gradient.
- [x] **Storefront:** Trang chủ kết nối thẳng vào API Backend để hiển thị danh sách sản phẩm.
- [x] **Admin Login:** Giao diện đăng nhập, tự động lưu trữ JWT Token vào `localStorage`.
- [x] **Admin Dashboard:** Layout quản trị (Routing bằng `react-router-dom`), có Sidebar điều hướng.
- [x] **Quản lý Products (UI):** Trang hiển thị bảng Sản phẩm, kết nối API Xóa sản phẩm (có đính kèm JWT Auth Header). Tính năng chặn truy cập (Protected Route) nếu chưa đăng nhập.

---

## 3. Thông tin Đăng nhập (Môi trường Dev)

*   **Tài khoản Admin Dashboard:**
    *   **Email:** `admin@teknik.com`
    *   **Password:** `admin123`
*   **Quản trị Database gốc (Prisma Studio):**
    *   Chạy lệnh `npx prisma studio` ở Backend, truy cập `http://localhost:5555`.

---

## 4. Các bước tiếp theo (Next Steps / Roadmap)

### Tuần 3: Giỏ hàng, Đặt hàng & Caching
1. **Cart & Order Flow:**
   - Xây dựng `OrdersModule` và `CartModule` trên Backend.
   - Viết transaction nguyên tử (Atomic transaction) bằng Prisma để trừ tồn kho (Inventory) khi khách tạo Order.
2. **Tích hợp Redis & BullMQ:**
   - Dùng Redis để Cache danh sách sản phẩm (giảm tải Database).
   - Dùng BullMQ tạo Background Jobs: Gửi email xác nhận đơn hàng, tự động hủy đơn nếu quá 24h không thanh toán.

### Frontend Integration
1. Xây dựng Form Thêm/Sửa sản phẩm trong màn hình Admin.
2. Thiết kế giao diện chi tiết sản phẩm (Storefront) và tính năng "Thêm vào giỏ hàng" lưu vào Redux hoặc Context API.
3. Thiết kế luồng Checkout (Thanh toán).

### Tuần 4: Realtime & CI/CD
1. Tích hợp **WebSocket** (`@nestjs/websockets`) để cập nhật trạng thái đơn hàng (Đang giao, Hoàn thành) realtime tới màn hình Admin và Client.
2. Viết Unit Test và E2E Test cho các Module quan trọng.
3. Docker hóa ứng dụng (Multi-stage build) và thiết lập kịch bản đẩy lên Cloud (Vercel / Railway / AWS).

---
*Vui lòng cung cấp tài liệu này cho AI hoặc Developer ở phiên làm việc tiếp theo để họ có thể nắm bắt ngay lập tức ngữ cảnh của dự án.*
