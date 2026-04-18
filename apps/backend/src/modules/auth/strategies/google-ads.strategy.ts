import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleAdsStrategy extends PassportStrategy(Strategy, 'google-ads') {
  constructor(configService: ConfigService) {
    const clientId =
      configService.get<string>('google.adsClientId') || 'dev-google-ads-client-id';
    const clientSecret =
      configService.get<string>('google.adsClientSecret') || 'dev-google-ads-client-secret';

    super({
      clientID: clientId,
      clientSecret,
      callbackURL: configService.get<string>('google.adsCallbackUrl') ?? '',
      scope: ['https://www.googleapis.com/auth/adwords'],
      passReqToCallback: false,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    done(null, {
      accessToken,
      refreshToken,
      googleId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    });
  }
}
