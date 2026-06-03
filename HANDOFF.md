# Project Handoff: ShopFlow E-commerce (Fullstack)

Đây là tài liệu bàn giao (handoff) toàn bộ dự án E-commerce (ShopFlow) bao gồm cả Backend và Frontend. Dự án được xây dựng với kiến trúc Client-Server hiện đại, đáp ứng đầy đủ các tiêu chuẩn bảo mật, phân quyền (RBAC) và quản lý trạng thái.

## 1. Tổng quan hệ thống (Tech Stack)

### Backend
- **Framework**: NestJS
- **Ngôn ngữ**: TypeScript
- **Database**: PostgreSQL (chạy qua Docker)
- **ORM**: Prisma
- **Xác thực**: JWT (JSON Web Tokens)
- **Tài liệu API**: Swagger UI

### Frontend
- **Framework**: React + Vite
- **Ngôn ngữ**: TypeScript (TSX)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios (được cấu hình Interceptor)
- **Quản lý UI/State**: Context API (`AuthContext`), React Hot Toast (thông báo)

---

## 2. Các tính năng đã hoàn thiện

### 2.1. Xác thực và Phân quyền (Authentication & RBAC)
Tính năng cốt lõi đã được liên kết hoàn chỉnh từ Frontend xuống Backend:
- **Đăng ký / Đăng nhập**: Người dùng có thể đăng ký tài khoản mới và đăng nhập. Mật khẩu được mã hóa an toàn bằng `bcrypt`.
- **JWT Authentication**: Cấp phát `access_token` và tự động gắn vào Header `Authorization: Bearer <token>` của mọi API request trên Frontend thông qua Axios Interceptor.
- **Global Auth State**: `AuthContext` quản lý trạng thái đăng nhập, tự động lấy thông tin người dùng (Profile bao gồm Họ, Tên, Role) khi tải lại trang, và xử lý tự động đăng xuất khi token hết hạn.
- **Phân quyền (Roles Guard)**:
  - `ADMIN`: Quản trị viên hệ thống, truy cập được trang Admin Dashboard (quản lý User, Product, Category) và có quyền XÓA sản phẩm.
  - `MANAGER`: Nhân viên, có thể xem và sửa/thêm sản phẩm nhưng không được xóa.
  - `USER`: Khách hàng mua sắm thông thường.

### 2.2. Frontend - Giao diện & Trải nghiệm
- **Client Layout**: Giao diện người dùng với Navbar hiển thị linh hoạt "Xin chào, [Họ và Tên]" hoặc các nút Đăng nhập/Đăng ký tùy theo trạng thái đăng nhập.
- **Admin Layout**: Giao diện Dashboard được bảo vệ bởi Protected Route, chỉ dành cho `ADMIN` và `MANAGER`. Tự động redirect về trang chủ nếu người dùng không đủ quyền.
- **Quản lý người dùng (Users Page)**: Chức năng dành cho Admin để xem danh sách tài khoản và phân quyền (cấp quyền Admin, Manager, User) trực tiếp trên giao diện.

### 2.3. Backend - Hệ thống & Database
- Hoàn thiện đầy đủ API CRUD cho Product, Category, Role, User.
- Áp dụng Global Interceptor để format định dạng API trả về đồng nhất: `{ success: true, message: '...', data: ... }`.
- **Audit Log**: Tự động lưu lịch sử mỗi khi có hành động `CREATE`, `UPDATE`, `DELETE` đối với Product.
- Database Schema (`schema.prisma`) đã được đồng bộ hoàn thiện với PostgreSQL, tích hợp sẵn file **Seed** để đổ dữ liệu mẫu ban đầu.

### 2.4. Giỏ hàng, Đơn hàng & Hiệu suất (Tuần 3)
- **Cart API**: Hỗ trợ thêm/sửa/xoá sản phẩm trong giỏ hàng cá nhân.
- **Order & Inventory Transaction**: Đảm bảo toàn vẹn dữ liệu khi tạo đơn hàng (trừ tồn kho an toàn bằng `reservedQuantity`, lưu thông tin snapshot giá lúc mua).
- **Payment & Idempotency**: Mô phỏng quá trình thanh toán đi kèm cơ chế Idempotency chống trừ tiền nhiều lần cho cùng một request.
- **Redis Cache**: Ứng dụng Redis để cache các API lấy danh sách sản phẩm/danh mục nhằm tối ưu tốc độ response.
- **Background Jobs (BullMQ)**: Xử lý ngầm các tác vụ nặng: Tự động huỷ đơn hàng nếu quá hạn thanh toán (Timeout Job) và Hàng đợi lưu log/thông báo khi trạng thái đơn hàng thay đổi (Notification Queue).

### 2.5. Tuần 4 - Đảm bảo chất lượng & DevOps
- **Realtime (WebSockets)**: Tích hợp `@nestjs/websockets` và `socket.io`. Tự động thiết lập Socket Rooms theo User ID. Bắn sự kiện cập nhật trạng thái đơn hàng (PAID, CANCELLED) về Frontend một cách realtime (không cần tải lại trang).
- **Health Check & Monitoring**: Có endpoint `/health` để tự động kiểm tra trạng thái Database và Memory.
- **Testing**: Đã viết Unit Test đầy đủ cho `AuthService`, `ProductService` và E2E Test cho Backend (PASS 100%). Đảm bảo code không bị lỗi hồi quy.
- **Docker & CI/CD**: Xây dựng Multi-stage `Dockerfile` tối ưu cho Backend. Mở rộng `docker-compose.yml` để chạy một mạch cả Database, Redis và Backend. Thiết lập thành công luồng CI Pipeline với Github Actions (`.github/workflows/ci.yml`).

### 2.6. Frontend - Luồng mua sắm (Shopping & Checkout)
- **Trang Sản phẩm (Shop)**: Lấy danh sách sản phẩm từ API và hỗ trợ thêm vào giỏ hàng.
- **Trang Giỏ hàng (Cart)**: Quản lý giỏ hàng (tăng giảm số lượng, xóa) và tự động tính tổng tiền.
- **Trang Thanh toán (Checkout)**: Thu thập địa chỉ giao hàng, tạo đơn đặt hàng và gọi API thanh toán giả lập.
- **Trang Lịch sử đơn hàng (Orders)**: Hiển thị các đơn hàng cá nhân, phân loại trạng thái (PENDING, PAID...) và ghi nhận snapshot giá sản phẩm tại thời điểm mua.

---

## 3. Hướng dẫn thiết lập và khởi chạy hệ thống

### 3.1. Khởi động Toàn bộ hệ thống bằng Docker Compose (Khuyên dùng)
Mở Terminal ở thư mục gốc của dự án và chạy lệnh sau để khởi động đồng thời cả **PostgreSQL**, **Redis** và **Backend API**:
```bash
docker compose up -d --build
```
*Lưu ý: API sẽ tự động lắng nghe ở cổng `3000`.*

### 3.2. Khởi chạy Backend (NestJS)
Mở một Terminal (Command Prompt / PowerShell) và chạy các lệnh sau:
```bash
# 1. Di chuyển vào backend và cài thư viện
cd backend
npm install

# 2. Khởi tạo cấu trúc Database và đổ Dữ liệu mẫu (Seed)
npx prisma migrate dev
npx prisma db seed

# 3. Chạy server ở chế độ Development
npm run start:dev
```
*API Server sẽ chạy tại `http://localhost:3000`.*
*Swagger UI (Tài liệu API): `http://localhost:3000/api/docs`.*

### 3.3. Khởi chạy Frontend (React + Vite)
Mở một Terminal **MỚI** và chạy các lệnh sau:
```bash
# 1. Di chuyển vào frontend và cài thư viện
cd frontend
npm install

# 2. Chạy ứng dụng frontend
npm run dev
```
*Frontend sẽ chạy tại `http://localhost:5173` (hoặc cổng được hiển thị trong terminal).*

---

## 4. Tài khoản test mặc định (Được tạo từ Seed)
Sau khi chạy lệnh `npx prisma db seed`, hệ thống đã có sẵn các tài khoản sau để bạn test:

1. **Tài khoản Admin (Toàn quyền)**
   - **Email**: `admin@example.com`
   - **Mật khẩu**: `admin123`

2. **Tài khoản User (Khách hàng)**
   - **Email**: `user@example.com`
   - **Mật khẩu**: `user123`

---

## 5. Các việc cần làm tiếp theo (Next Steps)
Hệ thống lõi và các luồng API nghiệp vụ (Cart, Order, Payment) đều đã hoàn thiện ở Backend. Team tiếp nhận có thể tiến hành phát triển tiếp các module:
1. **Dashboard UI**: Trang trí và bổ sung các biểu đồ thống kê đơn hàng cho Admin Dashboard.
2. **Upload Hình ảnh**: Tích hợp Cloudinary hoặc AWS S3 để upload ảnh thật cho sản phẩm.

---
*Bản giao code được biên soạn hoàn thiện, bám sát kiến trúc và thực tế dự án ShopFlow E-commerce.*
