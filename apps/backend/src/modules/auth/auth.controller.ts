import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { GoogleAdsAuthGuard } from './guards/google-ads-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthUser } from './types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return undefined;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: { user?: any }, @Res() res: any) {
    if (!req.user?.email) {
      throw new UnauthorizedException('Google profile did not include an email');
    }

    const auth = await this.authService.loginFromGoogle(req.user);
    const frontendUrl = this.configService.getOrThrow<string>('app.frontendUrl');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(auth.accessToken)}&workspaceId=${auth.user.workspaceId}`,
    );
  }

  @Get('google-ads')
  @UseGuards(GoogleAdsAuthGuard)
  googleAdsLogin() {
    return undefined;
  }

  @Get('google-ads/callback')
  @UseGuards(GoogleAdsAuthGuard)
  googleAdsCallback(@Req() req: { user?: any }) {
    return {
      message: 'Google Ads OAuth callback received',
      profile: req.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.userId, user.workspaceId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout() {
    return { success: true };
  }
}
