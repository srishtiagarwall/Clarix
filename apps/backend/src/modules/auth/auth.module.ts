import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAdsAuthGuard } from './guards/google-ads-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleAdsStrategy } from './strategies/google-ads.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('app.jwtSecret'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('app.jwtExpiresIn') as never,
        },
      }),
    }),
    UsersModule,
    WorkspacesModule,
    AccountsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    GoogleAdsStrategy,
    JwtStrategy,
    GoogleAuthGuard,
    GoogleAdsAuthGuard,
  ],
})
export class AuthModule {}
