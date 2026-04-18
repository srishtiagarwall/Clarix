import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackUrl: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3001/auth/google/callback',
  adsClientId: process.env.GOOGLE_ADS_CLIENT_ID ?? '',
  adsClientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET ?? '',
  adsCallbackUrl: process.env.GOOGLE_ADS_CALLBACK_URL ?? 'http://localhost:3001/auth/google-ads/callback',
}));
