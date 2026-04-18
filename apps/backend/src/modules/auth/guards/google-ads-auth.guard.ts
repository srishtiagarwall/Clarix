import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAdsAuthGuard extends AuthGuard('google-ads') {
  constructor(private readonly configService: ConfigService) {
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
}
