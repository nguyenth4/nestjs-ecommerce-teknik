import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor]
})
export class NotificationModule {}
