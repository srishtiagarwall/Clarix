import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { ConnectedAccount } from './entities/connected-account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { GoogleAdsApiClient } from './google-ads.client';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedAccount])],
  controllers: [AccountsController],
  providers: [AccountsService, GoogleAdsApiClient, EncryptionUtil],
  exports: [AccountsService],
})
export class AccountsModule {}
