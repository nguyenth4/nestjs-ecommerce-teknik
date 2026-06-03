import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessor } from './order.processor';

import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order',
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
    RealtimeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProcessor],
  exports: [OrderService]
})
export class OrderModule {}
