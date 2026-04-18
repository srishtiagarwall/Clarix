const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function AccountsPage() {
  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <header>
        <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Accounts
        </p>
        <h1 style={{ marginBottom: '0.5rem' }}>Connect your MCC account.</h1>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          The backend route for Google Ads OAuth is prepared. Once credentials are set, this entrypoint can begin the
          real Ads authorization flow.
        </p>
      </header>
      <a
        href={`${apiUrl}/auth/google-ads`}
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
    </section>
  );
}
