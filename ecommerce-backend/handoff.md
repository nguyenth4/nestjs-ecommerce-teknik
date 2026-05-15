# 🚀 Project Handoff: Teknik E-commerce Platform

**Ngày cập nhật:** 15/05/2026  
**Mô tả:** Tài liệu bàn giao dự án hệ thống E-commerce (Backend NestJS + Frontend React), hạ tầng Docker, Redis, BullMQ và WebSocket. Dùng để tiếp tục phát triển hoặc bàn giao cho team khác.

---

## 1. Tổng quan kiến trúc (Architecture)

Dự án nằm trong thư mục cha `d:\Code\teknik\nestjs-ecommerce-teknik` (hoặc clone từ GitHub):

*   **Backend (`/ecommerce-backend`):** **NestJS v11**, **TypeScript**, **Prisma ORM v5**, **PostgreSQL**, **Redis** (cache + BullMQ + tùy chọn WebSocket adapter), **Socket.IO** cho namespace đơn hàng. Repo tham chiếu: `https://github.com/nguyenth4/nestjs-ecommerce-teknik.git`.
*   **Frontend (`/ecommerce-frontend`):** **Vite + React + TypeScript**, CSS thuần (Glassmorphism, Dark Theme), **Context API** cho giỏ hàng, **socket.io-client** cho cập nhật trạng thái đơn realtime.

---

## 2. Trạng thái hiện tại (Đã hoàn thành)

### 2.1. Hạ tầng & Database

- [x] `docker-compose.yml`: PostgreSQL (`5432`), Redis (`6379`).
- [x] `.env`: `DATABASE_URL` (bắt buộc); Redis qua `REDIS_HOST` / `REDIS_PORT` (mặc định `localhost` / `6379`).
- [x] Prisma schema đầy đủ (`User`, `Role`, `Product`, `Category`, `Inventory`, `Cart`, `CartItem`, `Order`, `OrderItem`, `AuditLog`).
- [x] Seed: `prisma/seed.ts` (sản phẩm + inventory mẫu), `prisma/admin-seed.ts` (admin + role).

### 2.2. Backend (NestJS)

- [x] **Auth:** Đăng nhập/đăng ký, bcrypt, JWT (`JwtStrategy`), `RolesGuard` (so khớp `role.name`).
- [x] **Products:** CRUD, upload Multer `/products/upload`, static `/uploads`, sắp xếp `sku` DESC, SKU tự sinh, validation, xử lý `P2002`, tạo **Inventory** khi tạo sản phẩm (`initialStock` tùy chọn, mặc định 100).
- [x] **Redis cache:** `RedisModule` global; `GET /products` cache key `products:list` (TTL 60s); `GET /products/categories` cache `products:categories` (TTL 300s); invalidate khi create/update/delete sản phẩm.
- [x] **CartModule:** JWT — `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, `DELETE /cart`. Decorator `@CurrentUser()`.
- [x] **OrdersModule:**  
  - `POST /orders/checkout`: transaction Prisma — trừ tồn kho có điều kiện, tạo đơn trạng thái **`pending`**, xóa giỏ.  
  - Sau transaction: enqueue BullMQ — job **`order-email`** (log server mô phỏng email), job **`order-expire`** (delay `ORDER_PENDING_EXPIRE_MS`, mặc định 24h) — nếu vẫn `pending` thì **hủy đơn + hoàn kho**.  
  - `GET /orders`, `GET /orders/:id` (chủ đơn).  
  - **Admin:** `GET /orders/admin/list`, `PATCH /orders/admin/:id/status` (role `admin`/`staff`); khi `pending` → `cancelled` thì **hoàn kho**.  
- [x] **WebSocket:** `OrdersGateway` namespace **`/orders`**, xác thực JWT (handshake `auth.token` hoặc header `Authorization`), room `user:{userId}`, emit **`order:status`** khi đổi trạng thái hoặc job hủy đơn.
- [x] **BullMQ:** `BullModule.forRootAsync` trong `AppModule`, queue `orders`, processor `OrdersQueueProcessor`.
- [x] **Docker:** `Dockerfile` multi-stage + `.dockerignore` trong `ecommerce-backend`.
- [x] **Test (một phần):** `products.service.spec.ts`, `orders.service.spec.ts` có mock Prisma/Redis/Queue; các spec Auth/Users cũ có thể vẫn thiếu mock — cần dọn dẹp khi rảnh.

### 2.3. Frontend (React)

- [x] UI storefront (Glassmorphism), VNĐ, logic hết hàng (giá = 0).
- [x] **StoreNav**, **CartProvider** (`useCart`), token khách `customerToken` + fallback `adminToken` (dev).
- [x] Trang: `/account/login`, `/account/register`, `/cart`, `/checkout`, `/orders/:id`; thêm giỏ từ Home / Catalog / Product detail.
- [x] **Admin:** Login, layout, Products; **Orders** (`/admin/orders`): bảng đơn, đổi trạng thái, WebSocket cập nhật danh sách.
- [x] Trang chi tiết đơn khách: lắng nghe `order:status` qua Socket.IO.

---

## 3. Chạy dự án & biến môi trường

### Đăng nhập mẫu (Dev)

| Mục đích | Email | Mật khẩu |
|----------|-------|----------|
| Admin dashboard | `admin@teknik.com` | `admin123` |
| Khách (giỏ / đặt hàng) | Đăng ký tại `/account/register` | (tự đặt) |

### Backend

1. `docker compose up -d` (Postgres + **Redis** — **bắt buộc** cho cache, BullMQ, WS worker).  
2. `.env`: `DATABASE_URL`, `JWT_SECRET` (tuỳ chọn), `REDIS_HOST`, `REDIS_PORT`, `ORDER_PENDING_EXPIRE_MS` (tuỳ chọn, ví dụ `10000` để test hủy đơn sau 10 giây).  
3. `npx prisma migrate deploy` hoặc `db push` + seed tùy quy trình team.  
4. `npm run start:dev` — API mặc định `http://localhost:3000`.

### Frontend

- `npm run dev` — thường `http://localhost:5173`.  
- Gọi API `http://localhost:3000` (CORS đã bật).  
- WebSocket khách/admin: kết nối tới `http://localhost:3000/orders` với `auth: { token: '<JWT>' }`.

### Prisma Studio

- Trong thư mục backend: `npx prisma studio` → `http://localhost:5555`.

---

## 4. Các bước tiếp theo (Roadmap còn lại)

### Sản phẩm & vận hành

- [ ] Gửi email thật (SMTP / provider) thay cho log trong processor `order-email`.
- [ ] Cổng thanh toán: giữ `pending` cho tới khi thanh toán thành công, rồi chuyển `paid` (webhook).
- [ ] Admin: trang Categories/Users thay placeholder; quyền chi tiết (staff vs admin) cho từng hành động.

### Chất lượng & triển khai

- [ ] **E2E:** `AppModule` + Redis (Testcontainers hoặc CI service) — hiện `test:e2e` có thể fail nếu không có Redis.
- [ ] **Unit test:** Sửa/bổ sung mock cho `auth`, `users`, `cart`… để `npm test` xanh toàn bộ.
- [ ] **Observability:** Bull Board / metrics, health check Redis + DB.

### Kiến trúc nâng cao (tùy nhu cầu)

- [ ] Đa instance: sticky session hoặc Redis adapter cho Socket.IO.
- [ ] `reservedQuantity` trên `Inventory` (giữ hàng khi pending thay vì chỉ decrement ngay — đã chọn mô hình trừ ngay + hoàn khi hủy).
- [ ] CI/CD: build Docker, deploy (Railway / AWS / …), biến môi trường production.

---

*Tài liệu này nên đi kèm branch/repo hiện tại. Khi merge tính năng mới, cập nhật mục §2 và §4 cho khớp thực tế.*
