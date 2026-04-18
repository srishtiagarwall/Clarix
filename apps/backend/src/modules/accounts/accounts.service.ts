import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { CreateConnectedAccountDto } from './dto/create-connected-account.dto';
import { ConnectedAccount } from './entities/connected-account.entity';
import { GoogleAdsApiClient } from './google-ads.client';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(ConnectedAccount)
    private readonly accountsRepository: Repository<ConnectedAccount>,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly googleAdsApiClient: GoogleAdsApiClient,
  ) {}

  async listAccounts(workspaceId: string): Promise<ConnectedAccount[]> {
    return this.accountsRepository.find({
      where: { workspaceId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async connectMcc(workspaceId: string, input: CreateConnectedAccountDto) {
    const entity = this.accountsRepository.create({
      workspaceId,
      accountId: input.accountId,
      accountName: input.accountName,
      refreshTokenEncrypted: this.encryptionUtil.encrypt(input.refreshToken),
    });

    return this.accountsRepository.save(entity);
  }

  async discoverChildAccounts(accountId: string) {
    const account = await this.accountsRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    const refreshToken = this.encryptionUtil.decrypt(account.refreshTokenEncrypted);
    const accessibleCustomers = await this.googleAdsApiClient.listAccessibleCustomers(refreshToken);
    const hierarchy = await this.googleAdsApiClient.getAccountHierarchy(account.accountId);

    return {
      account,
      accessibleCustomers,
      hierarchy,
    };
  }

  async deleteAccount(workspaceId: string, accountId: string) {
    const account = await this.accountsRepository.findOne({ where: { id: accountId, workspaceId } });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found in workspace`);
    }

    account.isActive = false;
    return this.accountsRepository.save(account);
  }
}
