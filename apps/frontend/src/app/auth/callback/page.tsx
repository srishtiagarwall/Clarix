import { redirect } from 'next/navigation';

interface AuthCallbackPageProps {
  searchParams: Promise<{
    token?: string;
    workspaceId?: string;
  }>;
}

export default async function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  const params = await searchParams;
  const token = params.token ?? '';
  const workspaceId = params.workspaceId ?? '';

  redirect(
    `/dashboard?token=${encodeURIComponent(token)}&workspaceId=${encodeURIComponent(workspaceId)}`,
  );
}
