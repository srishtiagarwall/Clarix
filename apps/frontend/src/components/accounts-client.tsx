'use client';

import { useEffect, useState, useTransition } from 'react';
import { apiRequest, getStoredAccessToken } from '../lib/api';
import { Button } from './ui/button';

interface Account {
  id: string;
  accountId: string;
  accountName: string;
  platform: string;
}

interface DiscoveryResponse {
  accessibleCustomers: Array<{ customerId: string; descriptiveName: string }>;
  hierarchy: {
    customerId: string;
    children: Array<{ customerId: string; descriptiveName: string }>;
  };
}

interface AccountsClientProps {
  googleAdsUrl: string;
  callbackStatus?: {
    connected?: string;
    error?: string;
    source?: string;
  };
}

export function AccountsClient({ googleAdsUrl, callbackStatus }: AccountsClientProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [discoveries, setDiscoveries] = useState<Record<string, DiscoveryResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function loadAccounts() {
    if (!getStoredAccessToken()) {
      setLoading(false);
      return;
    }

    try {
      const result = await apiRequest<Account[]>('/accounts');
      setAccounts(result);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load accounts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, []);

  function handleSeedAccount() {
    startTransition(async () => {
      try {
        await apiRequest<Account>('/accounts', {
          method: 'POST',
          body: JSON.stringify({
            accountId: `demo-${Date.now()}`,
            accountName: `Demo MCC ${accounts.length + 1}`,
            refreshToken: 'dev-refresh-token',
          }),
        });

        await loadAccounts();
      } catch (seedError) {
        setError(seedError instanceof Error ? seedError.message : 'Unable to seed a demo account.');
      }
    });
  }

  function handleDiscover(accountId: string) {
    startTransition(async () => {
      try {
        const result = await apiRequest<DiscoveryResponse>(`/accounts/${accountId}/discover`);
        setDiscoveries((current) => ({ ...current, [accountId]: result }));
      } catch (discoveryError) {
        setError(
          discoveryError instanceof Error ? discoveryError.message : 'Unable to discover child accounts.',
        );
      }
    });
  }

  if (!getStoredAccessToken()) {
    return (
      <p style={{ margin: 0, color: 'var(--muted)' }}>
        No local session found. Use dev login or Google OAuth before working with accounts.
      </p>
    );
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <header>
        <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Accounts
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>Connect your MCC account.</h1>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Seed a demo account now, or switch to the real Google Ads OAuth flow once credentials are configured.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          href={googleAdsUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            padding: '0.9rem 1.2rem',
            borderRadius: '999px',
            background: 'var(--accent)',
            color: 'white',
          }}
        >
          Connect Google Ads
        </a>
        <Button onClick={handleSeedAccount} isLoading={isPending}>
          Seed Demo Account
        </Button>
      </div>

      {callbackStatus?.source === 'google-ads' && callbackStatus.connected ? (
        <p style={{ margin: 0, color: '#0f6a3b' }}>
          Google Ads OAuth connected {callbackStatus.connected} account(s) to this workspace.
        </p>
      ) : null}
      {callbackStatus?.source === 'google-ads' && callbackStatus.error ? (
        <p style={{ margin: 0, color: '#9f2a2a' }}>{callbackStatus.error}</p>
      ) : null}
      {loading ? <p style={{ margin: 0, color: 'var(--muted)' }}>Loading accounts...</p> : null}
      {error ? <p style={{ margin: 0, color: '#9f2a2a' }}>{error}</p> : null}

      {!loading && accounts.length === 0 ? (
        <p style={{ margin: 0, color: 'var(--muted)' }}>No connected accounts yet.</p>
      ) : null}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {accounts.map((account) => (
          <article
            key={account.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '22px',
              padding: '1.25rem',
              background: 'var(--surface)',
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0' }}>{account.accountName}</h2>
                <p style={{ margin: 0, color: 'var(--muted)' }}>
                  {account.accountId} · {account.platform}
                </p>
              </div>
              <Button variant="secondary" onClick={() => handleDiscover(account.id)} isLoading={isPending}>
                Discover Child Accounts
              </Button>
            </div>

            {discoveries[account.id] ? (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <p style={{ margin: 0, color: 'var(--muted)' }}>
                  Accessible customers: {discoveries[account.id].accessibleCustomers.length}
                </p>
                <p style={{ margin: 0, color: 'var(--muted)' }}>
                  Hierarchy children: {discoveries[account.id].hierarchy.children.map((child) => child.descriptiveName).join(', ')}
                </p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
