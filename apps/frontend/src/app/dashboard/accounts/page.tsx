const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
import { AccountsClient } from '../../../components/accounts-client';

interface AccountsPageProps {
  searchParams: Promise<{
    connected?: string;
    error?: string;
    source?: string;
  }>;
}

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
  const params = await searchParams;
  return <AccountsClient googleAdsUrl={`${apiUrl}/auth/google-ads`} callbackStatus={params} />;
}
