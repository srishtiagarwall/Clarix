import { AuthTokenHydrator } from '../../components/auth-token-hydrator';
import { DashboardOverview } from '../../components/dashboard-overview';

interface DashboardPageProps {
  searchParams: Promise<{
    token?: string;
    workspaceId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  return (
    <>
      <AuthTokenHydrator token={params.token} workspaceId={params.workspaceId} />
      <DashboardOverview />
    </>
  );
}
