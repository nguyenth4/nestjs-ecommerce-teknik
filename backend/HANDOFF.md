# Project Handoff: ShopFlow E-commerce Backend

Đây là tài liệu bàn giao (handoff) cho dự án Backend E-commerce (ShopFlow) được xây dựng bằng NestJS, Prisma, và PostgreSQL. Tài liệu này mô tả trạng thái hiện tại của hệ thống, các tính năng đã được triển khai, và hướng dẫn cài đặt để các kỹ sư hoặc team khác có thể tiếp quản dễ dàng.

## 1. Tổng quan hệ thống
- **Framework**: NestJS
- **Ngôn ngữ**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Xác thực**: JWT (JSON Web Tokens)
- **Tài liệu API**: Swagger UI

## 2. Các tính năng đã hoàn thiện

### 2.1. Xác thực và Phân quyền (Auth & RBAC)
- **Đăng ký (Register)**: Người dùng mới có thể đăng ký tài khoản (tự động nhận role `USER`). Mật khẩu được mã hóa an toàn bằng `bcrypt`.
- **Đăng nhập (Login)**: Cấp phát `access_token` JWT.
- **Làm mới Token (Refresh Token)**: Cấp lại token mới dựa trên token cũ mà không cần đăng nhập lại.
- **Phân quyền dựa trên vai trò (Roles Guard)**:
  - `ADMIN`: Quản trị viên hệ thống (Toàn quyền).
  - `MANAGER`: Nhân viên (Staff - Giới hạn một số quyền).
  - `USER`: Khách hàng mua sắm.

### 2.2. Quản lý Sản phẩm (Product API)
- Hoàn thiện đầy đủ API CRUD cho Product.
- **RBAC Rules được áp dụng**:
  - Xem sản phẩm (`GET /products`): Mở cho tất cả mọi người.
  - Thêm/Sửa sản phẩm (`POST`, `PUT`): Chỉ dành cho `ADMIN` và `MANAGER`.
  - Xóa sản phẩm (`DELETE`): Chỉ duy nhất `ADMIN` được phép.

### 2.3. Theo dõi hệ thống (Audit Log)
- Hệ thống tự động lưu lại lịch sử (Audit Log) mỗi khi có hành động `CREATE_PRODUCT`, `UPDATE_PRODUCT`, hoặc `DELETE_PRODUCT` thành công.
- Log lưu trữ ID của người thực hiện (`actorId`) và dữ liệu thay đổi (`metadata`).
- Chỉ `ADMIN` mới được phép truy cập xem danh sách Audit Log.

### 2.4. Khác
- **Swagger UI**: Đã cấu hình xác thực bằng Bearer token (`@ApiBearerAuth()`).

## 3. Cấu trúc Database (Prisma Schema)
Các models chính đã được thiết kế và tạo quan hệ rõ ràng trong file `prisma/schema.prisma`:
- `User`, `Role` (One-to-Many)
- `Category`, `Product` (One-to-Many)
- `Product`, `Inventory` (One-to-One)
- `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `AuditLog`, `Notification`.

## 4. Hướng dẫn thiết lập môi trường (Setup)

**Bước 1: Chạy Database**
Sử dụng Docker Compose để khởi chạy PostgreSQL cục bộ ở cổng `5433`:
```bash
docker-compose up -d
```

**Bước 2: Cài đặt dependencies**
Di chuyển vào thư mục `backend` và cài đặt gói:
```bash
cd backend
npm install
```

**Bước 3: Migration và Seed Dữ liệu**
Tạo cấu trúc bảng và nạp dữ liệu mẫu ban đầu (Gồm Admin, User, Category, Product mẫu):
```bash
npx prisma migrate dev
npx prisma db seed
```

**Bước 4: Khởi chạy Server**
```bash
npm run start:dev
```

**Bước 5: Kiểm tra API**
Mở trình duyệt và truy cập `http://localhost:3000/api/docs` để sử dụng Swagger UI.

## 5. Các việc cần làm tiếp theo (Next Steps)
Hệ thống lõi đã hoạt động ổn định, team tiếp nhận có thể phát triển tiếp các module sau:
1. **Hoàn thiện Logic Order & Cart**: Triển khai API thêm vào giỏ hàng và đặt hàng.
2. **Cổng thanh toán**: Tích hợp Stripe / PayPal vào module Payment.
3. **Mở rộng Audit Log & User API**: Hiện tại `AuditLogController` và `UserController` mới chỉ dựng khung API `findAll` để phân quyền Admin, cần bổ sung logic truy vấn Prisma bên trong Service.
4. **Viết Unit Test / E2E Test**: Bổ sung test coverage cho các hàm Service và Guard.

---
*Bản giao code được thực hiện tự động bám sát theo kế hoạch và yêu cầu kỹ thuật của hệ thống ShopFlow E-commerce.*
