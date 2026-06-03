# BÁO CÁO CÔNG VIỆC CÁ NHÂN - TUẦN 3
**Dự án:** ShopFlow E-commerce
**Giai đoạn:** 25/05/2026 - 01/06/2026

| Công việc | Chi tiết | Ngày | Trạng thái | Tiến triển | Đầu ra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cart API** | Add/update/remove cart item | 25/05/2026 | Hoàn thành | Đã tạo CartModule, Controller, Service. Xây dựng logic thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng và gán theo UserID. | Các API CRUD cho giỏ hàng hoạt động. DTO được validate chặt chẽ. |
| **Order API** | Tạo order từ cart | 26/05/2026 | Hoàn thành | Xây dựng OrderService sử dụng Prisma Transaction để đảm bảo tính toàn vẹn dữ liệu khi tạo đơn hàng từ giỏ hàng. | API tạo đơn hàng thành công, giỏ hàng tự động được clear. |
| **Inventory logic** | Check và reserve tồn kho | 27/05/2026 | Hoàn thành | Bổ sung logic kiểm tra số lượng khả dụng (quantity - reservedQuantity) và tăng reservedQuantity vào trong Transaction lúc tạo đơn. | Chặn đặt hàng khi thiếu tồn kho, tạo InventoryLog ghi nhận thay đổi. |
| **Payment simulation** | Thanh toán giả lập | 28/05/2026 | Hoàn thành | Thiết lập API mock payment trong PaymentModule, kết nối để cập nhật trạng thái đơn hàng sang PAID khi giao dịch thành công. | Payment API tại `/payment/mock` hoạt động. |
| **Redis cache** | Cache product/category | 29/05/2026 | Hoàn thành | Tích hợp @nestjs/cache-manager với redisStore. Cấu hình CacheInterceptor cho các API GET và tự động xoá cache (invalidate) khi Create/Update/Delete. | API danh sách sản phẩm load nhanh hơn. Cấu hình Redis thêm vào `docker-compose.yml`. |
| **BullMQ worker** | Xử lý notification async | 30/05/2026 | Hoàn thành | Cài đặt BullMQ, tạo Notification queue và NotificationProcessor. OrderService bắn event `order.created`, `order.paid` để worker ghi log. | Worker chạy ngầm và lưu thông báo (Notification) vào database. |
| **Order timeout job** | Tự hủy order pending quá hạn | 31/05/2026 | Hoàn thành | Tạo Order queue, enqueue job `check-timeout` với thuộc tính delay khi đơn hàng mới được tạo. | OrderProcessor tự động check và chuyển sang CANCELLED, release Inventory nếu quá hạn thanh toán. |
| **Idempotency handling** | Tránh tạo payment/order trùng | 01/06/2026 | Hoàn thành | Ứng dụng Idempotency Key trong PaymentService để chặn request thanh toán trùng lặp. | Các request chứa cùng idempotencyKey chỉ được xử lý trừ tiền đúng 1 lần. |
