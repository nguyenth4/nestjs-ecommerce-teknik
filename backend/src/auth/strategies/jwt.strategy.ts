import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-ecommerce-2026',
    });
  }

  async validate(payload: any) {
    // Giá trị trả về ở đây sẽ được NestJS tự động gán vào `req.user`
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
