import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Thanh toán giả lập (PDF Week 3 — N3-T07). Khách chỉ thanh toán đơn của chính mình. */
  @Post('mock')
  mockPay(
    @CurrentUser() user: { id: string },
    @Body() dto: MockPaymentDto,
  ) {
    return this.paymentsService.mockPay(user.id, dto);
  }
}
