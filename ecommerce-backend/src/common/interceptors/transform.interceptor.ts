import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Chuẩn hóa response { data, meta } — PDF Week 1 (N1-T06). */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const url = context.switchToHttp().getRequest<{ url?: string }>().url ?? '';
    if (
      url.startsWith('/uploads') ||
      url.startsWith('/api/docs') ||
      url.startsWith('/api-json') ||
      url.startsWith('/api-yaml')
    ) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: { timestamp: new Date().toISOString() },
      })),
    );
  }
}
