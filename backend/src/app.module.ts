import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, RoleModule, ProductModule, CategoryModule, InventoryModule, CartModule, OrderModule, PaymentModule, NotificationModule, RealtimeModule, AuditLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
