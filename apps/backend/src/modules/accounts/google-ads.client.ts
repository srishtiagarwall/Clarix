import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GoogleAdsCustomer {
  customerId: string;
  descriptiveName: string;
}

@Injectable()
export class GoogleAdsApiClient {
  private readonly logger = new Logger(GoogleAdsApiClient.name);
  private readonly developerToken: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly loginCustomerId: string;

  constructor(private readonly configService: ConfigService) {
    this.developerToken = this.configService.get<string>('google.adsDeveloperToken') ?? '';
    this.clientId = this.configService.get<string>('google.adsClientId') ?? '';
    this.clientSecret = this.configService.get<string>('google.adsClientSecret') ?? '';
    this.loginCustomerId = this.sanitizeCustomerId(
      this.configService.get<string>('google.adsLoginCustomerId') ?? '',
    );
  }

  async listAccessibleCustomers(refreshToken: string): Promise<GoogleAdsCustomer[]> {
    this.ensureConfigured();

    const accessToken = await this.getAccessToken(refreshToken);
    const response = await this.googleAdsFetch<{ resourceNames?: string[] }>(
      'https://googleads.googleapis.com/v19/customers:listAccessibleCustomers',
      {
        method: 'GET',
      },
      accessToken,
    );

    const resourceNames = response.resourceNames ?? [];
    const customers = await Promise.all(
      resourceNames.map(async (resourceName) => {
        const customerId = this.extractCustomerId(resourceName);
        const descriptiveName = await this.getCustomerDisplayName(customerId, accessToken);

        return {
          customerId: this.formatCustomerId(customerId),
          descriptiveName,
        };
      }),
    );

    this.logger.log(`Fetched ${customers.length} accessible Google Ads customers.`);
    return customers;
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

  private async getAccessToken(refreshToken: string) {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch('https://www.googleapis.com/oauth2/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Google OAuth token refresh failed with status ${response.status}`);
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      throw new Error('Google OAuth token refresh response did not include an access token');
    }

    return data.access_token;
  }

  private async getCustomerDisplayName(customerId: string, accessToken: string) {
    const response = await this.googleAdsFetch<{
      results?: Array<{ customer?: { descriptiveName?: string } }>;
    }>(
      `https://googleads.googleapis.com/v19/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        body: JSON.stringify({
          query: 'SELECT customer.descriptive_name FROM customer LIMIT 1',
        }),
      },
      accessToken,
      true,
    );

    return response.results?.[0]?.customer?.descriptiveName ?? this.formatCustomerId(customerId);
  }

  private async googleAdsFetch<T>(
    url: string,
    init: RequestInit,
    accessToken: string,
    includeLoginCustomerId = false,
  ): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    headers.set('developer-token', this.developerToken);

    if (includeLoginCustomerId && this.loginCustomerId) {
      headers.set('login-customer-id', this.loginCustomerId);
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Google Ads API request failed with status ${response.status}: ${body}`);
    }

    return (await response.json()) as T;
  }

  private ensureConfigured() {
    if (!this.developerToken || !this.clientId || !this.clientSecret) {
      throw new ServiceUnavailableException(
        'Google Ads API is not fully configured. Set GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, and GOOGLE_ADS_DEVELOPER_TOKEN.',
      );
    }
  }

  private extractCustomerId(resourceName: string) {
    return resourceName.split('/').pop() ?? resourceName;
  }

  private sanitizeCustomerId(customerId: string) {
    return customerId.replaceAll('-', '');
  }

  private formatCustomerId(customerId: string) {
    const digits = this.sanitizeCustomerId(customerId);
    if (digits.length !== 10) {
      return customerId;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
}
