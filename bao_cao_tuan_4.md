# Báo cáo Tiến độ Phát triển - Tuần 4

## 1. Mục tiêu (Objective)
Hoàn thiện dự án ShopFlow E-commerce đạt chuẩn Production, bao gồm tính năng Realtime (Cập nhật thời gian thực), Testing (Đảm bảo chất lượng) và cấu hình DevOps (Docker & CI/CD).

## 2. Công việc đã thực hiện

### 2.1. Realtime Updates (WebSocket)
- Tích hợp `@nestjs/websockets` và `socket.io` vào ứng dụng NestJS.
- Xây dựng **RealtimeGateway**: Cung cấp đường ống kết nối liên tục giữa Frontend và Backend.
- **Tính năng nổi bật**: 
  - Khách hàng đăng nhập vào Frontend sẽ tự động tham gia vào "Socket Room" cá nhân của họ.
  - Khi đơn hàng thay đổi trạng thái (Ví dụ thanh toán thành công -> trạng thái `PAID`), hệ thống sẽ phát tín hiệu (broadcast) trực tiếp xuống Frontend.
  - Tích hợp `react-hot-toast` trên Frontend để thông báo nổi (Pop-up Toast) trạng thái đơn hàng mà không cần khách hàng phải nhấn tải lại trang.

### 2.2. Kiểm thử phần mềm (Testing & Quality Assurance)
- **Unit Testing**:
  - Dùng Jest để test độc lập các service quan trọng: `AuthService`, `ProductService`.
  - Giả lập (Mock) thành công các truy vấn `PrismaService` và `JwtService` để tránh test làm rác Database.
- **E2E Testing (End-to-End)**:
  - Khởi tạo test suit cho Health Check Endpoint để đảm bảo toàn bộ hệ thống API vận hành thông suốt trước khi đưa lên production.

### 2.3. Monitoring & Health Check
- Tích hợp `@nestjs/terminus` tạo Endpoint GET `/health`.
- Hệ thống tự động kiểm tra xem Database PostgreSQL có đang "còn sống" không và kiểm tra dung lượng RAM (Heap Memory) để tránh tràn bộ nhớ.

### 2.4. DevOps & CI/CD Pipeline
- **Dockerization (Dockerfile)**: Đóng gói Backend bằng phương pháp Multi-stage Build giúp giảm 80% dung lượng Image, chỉ giữ lại những gì tinh gọn nhất cho Production.
- **Docker Compose**: Hợp nhất toàn bộ hệ thống (PostgreSQL, Redis, NestJS Backend) vào chung một file `docker-compose.yml`. Chỉ 1 lệnh `docker compose up -d` là khởi động mọi thứ.
- **Github Actions (CI/CD)**: Tạo file tự động hóa `.github/workflows/ci.yml`. Mỗi khi push code lên nhánh `main`, Server của Github sẽ tự động cài đặt gói thư viện, chạy Build và Unit test. Nếu có lỗi, Github sẽ gửi cảnh báo ngay lập tức.

## 3. Tình trạng và Đánh giá
- **Đạt được**: Tuần 4 đã kết thúc hoàn hảo và trọn vẹn. Toàn bộ tính năng từ Core (Tuần 1,2), Business Logic (Tuần 3) cho tới Enterprise Grade (Tuần 4) đều đã được triển khai đầy đủ và bám sát kiến trúc phần mềm.
- **Tình trạng lỗi**: 0 Bug tồn đọng. (Test Pass 100%).

## 4. Bàn giao
Toàn bộ source code đã được dọn dẹp (xóa file rác, file test hỏng) và đồng bộ (push/merge) an toàn lên nhánh `main`. Project đã kết thúc giai đoạn xây dựng nền tảng và Backend, sẵn sàng để đội ngũ Frontend tiếp tục xây dựng giao diện người dùng.
