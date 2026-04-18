import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleAdsApiClient {
  private readonly logger = new Logger(GoogleAdsApiClient.name);

  async listAccessibleCustomers(refreshToken: string) {
    this.logger.log(`Stub listAccessibleCustomers called for token ${refreshToken.slice(0, 4)}...`);
    return [
      { customerId: '123-456-7890', descriptiveName: 'Demo MCC Account' },
      { customerId: '987-654-3210', descriptiveName: 'Demo Child Account' },
    ];
  }

  async getAccountHierarchy(customerId: string) {
    return {
      customerId,
      children: [
        { customerId: '111-222-3333', descriptiveName: 'Child Account A' },
        { customerId: '444-555-6666', descriptiveName: 'Child Account B' },
      ],
    };
  }
}
