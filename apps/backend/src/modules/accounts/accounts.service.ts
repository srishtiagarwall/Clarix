import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { CreateConnectedAccountDto } from './dto/create-connected-account.dto';
import { ConnectedAccount } from './entities/connected-account.entity';
import { GoogleAdsApiClient } from './google-ads.client';

type ConnectedAccountView = Omit<ConnectedAccount, 'refreshTokenEncrypted'>;

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(ConnectedAccount)
    private readonly accountsRepository: Repository<ConnectedAccount>,
    private readonly encryptionUtil: EncryptionUtil,
    private readonly googleAdsApiClient: GoogleAdsApiClient,
  ) {}

  async listAccounts(workspaceId: string): Promise<ConnectedAccountView[]> {
    const accounts = await this.accountsRepository.find({
      where: { workspaceId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    return accounts.map(({ refreshTokenEncrypted: _refreshTokenEncrypted, ...account }) => account);
  }

  async connectMcc(workspaceId: string, input: CreateConnectedAccountDto): Promise<ConnectedAccountView> {
    const entity = this.accountsRepository.create({
      workspaceId,
      accountId: input.accountId,
      accountName: input.accountName,
      refreshTokenEncrypted: this.encryptionUtil.encrypt(input.refreshToken),
    });

    const saved = await this.accountsRepository.save(entity);
    const { refreshTokenEncrypted: _refreshTokenEncrypted, ...account } = saved;
    return account;
  }

  async connectGoogleAdsOAuth(workspaceId: string, refreshToken: string): Promise<ConnectedAccountView[]> {
    const accessibleCustomers =
      await this.googleAdsApiClient.listAccessibleCustomers(refreshToken);

    const encryptedRefreshToken = this.encryptionUtil.encrypt(refreshToken);
    const savedAccounts: ConnectedAccount[] = [];

    for (const customer of accessibleCustomers) {
      const existing = await this.accountsRepository.findOne({
        where: {
          workspaceId,
          platform: 'google_ads',
          accountId: customer.customerId,
        },
      });

      const entity =
        existing ??
        this.accountsRepository.create({
          workspaceId,
          platform: 'google_ads',
          accountId: customer.customerId,
        });

      entity.accountName = customer.descriptiveName;
      entity.refreshTokenEncrypted = encryptedRefreshToken;
      entity.isActive = true;

      savedAccounts.push(await this.accountsRepository.save(entity));
    }

    return savedAccounts.map(({ refreshTokenEncrypted: _refreshTokenEncrypted, ...account }) => account);
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
