import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class GoogleAdsAuthGuard extends AuthGuard('google-ads') {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const clientId = this.configService.get<string>('google.adsClientId');
    const clientSecret = this.configService.get<string>('google.adsClientSecret');

    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException(
        'Google Ads OAuth is not configured. Set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET.',
      );
    }

    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser; query?: { code?: string } }>();

    if (request.query?.code) {
      return {};
    }

    return {
      accessType: 'offline',
      prompt: 'consent',
      state: this.jwtService.sign(
        {
          purpose: 'google-ads-connect',
          workspaceId: request.user?.workspaceId,
          userId: request.user?.userId,
        },
        {
          secret: this.configService.getOrThrow<string>('app.jwtSecret'),
          expiresIn: '10m',
        },
      ),
    };
  }
}
