'use client';

import { useEffect } from 'react';

interface AuthTokenHydratorProps {
  token?: string;
  workspaceId?: string;
}

export function AuthTokenHydrator({ token, workspaceId }: AuthTokenHydratorProps) {
  useEffect(() => {
    if (token) {
      window.localStorage.setItem('clarix.accessToken', token);
    }

    if (workspaceId) {
      window.localStorage.setItem('clarix.workspaceId', workspaceId);
    }
  }, [token, workspaceId]);

  return null;
}
