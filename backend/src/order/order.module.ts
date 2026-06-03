import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order',
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProcessor],
  exports: [OrderService]
})
export class OrderModule {}
