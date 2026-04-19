'use client';

import { useEffect, useState } from 'react';
import { apiRequest, clearStoredAccessToken, getStoredAccessToken } from '../lib/api';

interface Profile {
  id: string;
  email: string;
  name: string;
  workspaceId: string;
}

interface Workspace {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  brandColor: string;
}

interface Account {
  id: string;
  accountId: string;
  accountName: string;
  platform: string;
}

export function DashboardOverview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [profileResult, workspaceResult, accountResult] = await Promise.all([
          apiRequest<Profile>('/auth/me'),
          apiRequest<Workspace>('/workspaces/me'),
          apiRequest<Account[]>('/accounts'),
        ]);

        setProfile(profileResult);
        setWorkspace(workspaceResult);
        setAccounts(accountResult);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
        clearStoredAccessToken();
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Loading workspace data...</p>;
  }

  if (!getStoredAccessToken()) {
    return (
      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
        No session found. Use Google OAuth or the dev login from the landing page.
      </p>
    );
  }

  if (error) {
    return <p style={{ margin: 0, color: '#9f2a2a' }}>{error}</p>;
  }

  if (!profile || !workspace) {
    return null;
  }

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Dashboard
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>{profile.name}</h1>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          This view is now backed by live API responses for your local workspace instead of placeholder cards.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {[
          ['Workspace', workspace.name],
          ['Plan', workspace.plan],
          ['Connected Accounts', String(accounts.length)],
          ['Current User', profile.email],
        ].map(([title, value]) => (
          <article
            key={title}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '22px',
              padding: '1.25rem',
              background: 'var(--surface)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.85rem',
              }}
            >
              {title}
            </p>
            <h2 style={{ margin: 0 }}>{value}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
