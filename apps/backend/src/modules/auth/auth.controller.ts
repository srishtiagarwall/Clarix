import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../../common/guards/workspace-member.guard';
import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/dev-login.dto';
import { GoogleAdsAuthGuard } from './guards/google-ads-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthUser } from './types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly accountsService: AccountsService,
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
  @UseGuards(JwtAuthGuard, WorkspaceMemberGuard, GoogleAdsAuthGuard)
  googleAdsLogin() {
    return undefined;
  }

  @Get('google-ads/callback')
  @UseGuards(GoogleAdsAuthGuard)
  async googleAdsCallback(@Req() req: { user?: any }, @Res() res: any) {
    const frontendUrl = this.configService.getOrThrow<string>('app.frontendUrl');

    try {
      const state = req.user?.state;
      if (!state) {
        throw new UnauthorizedException('Missing Google Ads OAuth state');
      }

      const payload = this.jwtService.verify<{
        purpose: string;
        workspaceId: string;
      }>(state, {
        secret: this.configService.getOrThrow<string>('app.jwtSecret'),
      });

      if (payload.purpose !== 'google-ads-connect' || !payload.workspaceId) {
        throw new UnauthorizedException('Invalid Google Ads OAuth state');
      }

      if (!req.user?.refreshToken) {
        throw new UnauthorizedException(
          'Google did not return a refresh token. Re-consent is required for Google Ads access.',
        );
      }

      const accounts = await this.accountsService.connectGoogleAdsOAuth(
        payload.workspaceId,
        req.user.refreshToken,
      );

      res.redirect(
        `${frontendUrl}/dashboard/accounts?connected=${accounts.length}&source=google-ads`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Google Ads connection failed unexpectedly';
      res.redirect(
        `${frontendUrl}/dashboard/accounts?error=${encodeURIComponent(message)}&source=google-ads`,
      );
    }
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

  @Post('dev-login')
  devLogin(@Body() body: DevLoginDto) {
    if (this.configService.get<string>('app.nodeEnv') === 'production') {
      throw new ForbiddenException('Development login is disabled in production');
    }

    return this.authService.loginForDevelopment(body);
  }
}
