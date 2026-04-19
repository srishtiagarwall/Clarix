'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { apiRequest } from '../lib/api';
import { Button } from './ui/button';

interface AuthResponse {
  accessToken: string;
  user: {
    workspaceId: string;
  };
}

export function DevLoginButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDevLogin() {
    setError(null);

    startTransition(async () => {
      try {
        const auth = await apiRequest<AuthResponse>('/auth/dev-login', {
          method: 'POST',
          body: JSON.stringify({}),
        });

        window.localStorage.setItem('clarix.accessToken', auth.accessToken);
        window.localStorage.setItem('clarix.workspaceId', auth.user.workspaceId);
        router.push('/dashboard');
      } catch (loginError) {
        setError(
          loginError instanceof Error ? loginError.message : 'Unable to create a development session.',
        );
      }
    });
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
      <Button variant="secondary" size="lg" onClick={handleDevLogin} isLoading={isPending}>
        Use Dev Login
      </Button>
      {error ? <p style={{ margin: 0, color: '#9f2a2a' }}>{error}</p> : null}
    </div>
  );
}
