import { AuthTokenHydrator } from '../../components/auth-token-hydrator';

interface DashboardPageProps {
  searchParams: Promise<{
    token?: string;
    workspaceId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <AuthTokenHydrator token={params.token} workspaceId={params.workspaceId} />
      <header>
        <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Dashboard
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>Week 1 foundation is in place.</h1>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          Next steps are live Google OAuth credentials, a running Postgres instance, and the first real Google Ads
          API integration.
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
          ['Auth', 'Google login callback flow scaffolded'],
          ['Workspace', 'Workspace auto-created on first login'],
          ['Accounts', 'Encrypted MCC connection storage ready'],
        ].map(([title, description]) => (
          <article
            key={title}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '22px',
              padding: '1.25rem',
              background: 'var(--surface)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>{title}</h2>
            <p style={{ marginBottom: 0, color: 'var(--muted)' }}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
