import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type OrderConfirmationMailInput = {
  to: string;
  recipientName: string;
  orderId: string;
  status: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number }[];
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const enabled = this.config.get<string>('MAIL_ENABLED', 'false').toLowerCase() === 'true';
    const host = this.config.get<string>('SMTP_HOST');
    if (!enabled) {
      this.logger.log('MAIL_ENABLED≠true — email đặt hàng chỉ ghi log (không gửi SMTP).');
      return;
    }
    if (!host) {
      this.logger.warn('MAIL_ENABLED=true nhưng thiếu SMTP_HOST — bỏ qua gửi mail.');
      return;
    }
    const port = +(this.config.get<string>('SMTP_PORT', '587') || 587);
    const secure =
      this.config.get<string>('SMTP_SECURE', 'false').toLowerCase() === 'true' || port === 465;
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
    this.logger.log(`SMTP đã cấu hình: ${host}:${port} (secure=${secure})`);
  }

  private getFromAddress(): string {
    return (
      this.config.get<string>('MAIL_FROM') ||
      this.config.get<string>('SMTP_USER') ||
      'no-reply@teknik.local'
    );
  }

  async sendOrderConfirmation(input: OrderConfirmationMailInput): Promise<void> {
    const lines = input.items
      .map(
        (i) =>
          `<tr><td>${escapeHtml(i.name)}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">${i.price.toLocaleString('vi-VN')}</td></tr>`,
      )
      .join('');

    if (!this.transporter) {
      this.logger.log(
        `[order-email] (không SMTP) Đơn ${input.orderId} → ${input.to} — ${input.items.length} dòng, tổng ${input.totalAmount}`,
      );
      return;
    }

    const subject = `[Teknik Store] Xác nhận đơn hàng #${input.orderId.slice(0, 8)}…`;
    const html = `
      <p>Xin chào ${escapeHtml(input.recipientName)},</p>
      <p>Cảm ơn bạn đã đặt hàng. Đơn của bạn đang ở trạng thái: <strong>${escapeHtml(input.status)}</strong>.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá (VND)</th></tr></thead>
        <tbody>${lines}</tbody>
      </table>
      <p><strong>Tổng thanh toán:</strong> ${input.totalAmount.toLocaleString('vi-VN')} ₫</p>
      <p style="color:#666;font-size:12px">Mã đơn: ${escapeHtml(input.orderId)}</p>
    `;

    try {
      await this.transporter.sendMail({
        from: this.getFromAddress(),
        to: input.to,
        subject,
        text: `Đơn ${input.orderId}, trạng thái ${input.status}, tổng ${input.totalAmount} VND.`,
        html,
      });
      this.logger.log(`Đã gửi email xác nhận đơn tới ${input.to} (order ${input.orderId})`);
    } catch (err) {
      this.logger.error(`Gửi mail thất bại (${input.orderId}): ${(err as Error).message}`);
    }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
