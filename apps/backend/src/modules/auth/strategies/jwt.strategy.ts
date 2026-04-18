import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('app.jwtSecret'),
    });
  }

  validate(payload: { sub: string; workspaceId: string; email: string }) {
    return {
      userId: payload.sub,
      workspaceId: payload.workspaceId,
      email: payload.email,
    };
  }
}
