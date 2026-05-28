import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS cho frontend
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường dữ liệu thừa (không được khai báo trong DTO) khi client gửi lên
      forbidNonWhitelisted: true, // Từ chối (reject) ngay lập tức bằng lỗi 400 Bad Request nếu phát hiện có bất kỳ trường dữ liệu nào gửi lên mà không hợp lệ hoặc dư thừa.
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ chuỗi thành số nếu DTO yêu cầu số).
    }),
  );

  // Áp dụng Global Response Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Áp dụng Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('ShopFlow E-commerce API')
    .setDescription('Tài liệu API cho hệ thống E-commerce ShopFlow')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
