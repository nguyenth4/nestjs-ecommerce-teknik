import { BadRequestException } from '@nestjs/common';

/** BR-07: không cho chuyển trạng thái tùy ý (PDF Week 3). */
const ALLOWED: Record<string, string[]> = {
  pending: ['paid', 'cancelled', 'processing'],
  paid: ['processing', 'shipped', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['completed', 'cancelled'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function assertOrderTransition(prev: string, next: string) {
  if (prev === next) return;
  const ok = ALLOWED[prev]?.includes(next);
  if (!ok) {
    throw new BadRequestException(`Invalid status transition: ${prev} → ${next}`);
  }
}
