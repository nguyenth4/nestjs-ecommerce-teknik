# BÁO CÁO CÔNG VIỆC CÁ NHÂN - TUẦN 1
**Dự án:** ShopFlow E-commerce
**Giai đoạn:** 11/05/2026 - 17/05/2026

| Công việc | Chi tiết | Ngày | Trạng thái | Tiến triển | Đầu ra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NestJS source code** | NestJS source code Project có cấu trúc module rõ ràng | 11/05/2026 | Hoàn thành | Đã tạo sẵn khung thư mục cho 12 modules của dự án (Auth, User, Product...). | Codebase backend/ chạy ổn định trên môi trường local. |
| **API Module Sản Phẩm** | Viết REST API CRUD cơ bản cho Product (Create, Read, Update, Delete). | 12/05/2026 | Hoàn thành | Đã hoàn thiện Controller và Service xử lý logic trên mảng tạm (in-memory). | 5 Endpoints API CRUD cho Product. |
| **API Module Danh Mục** | Viết REST API CRUD cơ bản cho Category. | 13/05/2026 | Hoàn thành | Đã hoàn thiện Controller và Service xử lý logic trên mảng tạm. | 5 Endpoints API CRUD cho Category. |
| **Validation DTO** | Tích hợp class-validator và kích hoạt Global Validation Pipe | 14/05/2026 | Hoàn thành | API tự động chặn và báo lỗi chi tiết khi client gửi sai định dạng dữ liệu (vd: giá < 0). | File DTO của Product/Category & cấu hình tại main.ts. |
| **Global Response** | Tạo TransformInterceptor để đồng bộ JSON format khi API trả về dữ liệu thành công. | 15/05/2026 | Hoàn thành | Mọi request thành công đều được bọc trong object có success và data. | File transform.interceptor.ts. |
| **Global Exception** | Tạo HttpExceptionFilter để chuẩn hóa định dạng báo lỗi của toàn hệ thống. | 15/05/2026 | Hoàn thành | Báo lỗi đồng nhất định dạng, dễ dàng để Frontend đọc thông báo lỗi. | File http-exception.filter.ts. |
| **Swagger API Docs** | Tích hợp @nestjs/swagger để tự động hóa tài liệu API. | 16/05/2026 | Hoàn thành | Đã cài đặt thư viện và cấu hình Document Builder ở file gốc main.ts. | Giao diện tài liệu Swagger UI trực quan tại đường dẫn /api/docs. |
| **Hướng dẫn chạy dự án (README)** | Viết tài liệu README.md cung cấp đầy đủ thông tin cấu trúc thư mục, lệnh cài đặt, lệnh khởi chạy và link truy cập API Docs. | 17/05/2026 | Hoàn thành | Đã ghi rõ các bước chạy tách biệt cho Backend (NestJS) và Frontend (Vite). | File README.md lưu tại thư mục gốc của dự án. |
