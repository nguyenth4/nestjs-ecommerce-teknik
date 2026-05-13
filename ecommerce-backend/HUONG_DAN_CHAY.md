# 🚀 Hướng Dẫn Chạy Toàn Bộ Ứng Dụng E-commerce Teknik

Để chạy dự án, bạn hãy đảm bảo phần mềm **Docker Desktop** đã được mở. Sau đó, hãy làm theo các bước bên dưới.
Bạn cần mở **3 tab Terminal riêng biệt** trong VS Code (hoặc Command Prompt) để chạy đồng thời các dịch vụ.

---

## 🟢 Bước 1: Khởi động Database (Bắt buộc chạy đầu tiên)

Mở **Terminal 1**, di chuyển vào thư mục Backend và khởi động Docker container chứa PostgreSQL và Redis:

```bash
cd ecommerce-backend
docker-compose up -d
```
*(Chờ một lát để Docker báo "Started". Nếu database đã được bật sẵn trước đó, bạn có thể bỏ qua bước này).*

---

## 🟢 Bước 2: Chạy Backend API (NestJS)

Mở **Terminal 2**, di chuyển vào thư mục Backend và khởi động server:

```bash
cd ecommerce-backend
npm run start:dev
```
*Bạn sẽ thấy log hệ thống báo NestJS started successfully. Backend lúc này sẽ hoạt động tại địa chỉ: `http://localhost:3000`*

---

## 🟢 Bước 3: Chạy Giao Diện Frontend (React Vite)

Mở **Terminal 3**, di chuyển vào thư mục Frontend và khởi động giao diện web:

```bash
cd ecommerce-frontend
npm run dev
```
*Frontend sẽ cung cấp cho bạn một đường link. Bấm `Ctrl + Click` vào link đó hoặc mở trình duyệt truy cập: `http://localhost:5173`*

---

## 🛠 Lệnh Phụ Trợ (Tùy chọn)

Nếu bạn muốn xem, thêm, sửa, hoặc xoá trực tiếp dữ liệu trong Database (như bảng Sản phẩm, User, Đơn hàng), hãy mở thêm một Terminal và chạy:

```bash
cd ecommerce-backend
npx prisma studio
```
*Truy cập vào trình duyệt: `http://localhost:5555` để sử dụng Prisma Studio.*
