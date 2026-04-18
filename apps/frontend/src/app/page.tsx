const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: 'min(980px, 100%)',
          border: '1px solid var(--border)',
          borderRadius: '32px',
          background: 'var(--surface)',
          backdropFilter: 'blur(14px)',
          padding: '3rem',
          display: 'grid',
          gap: '1.5rem',
          boxShadow: '0 24px 60px rgba(25, 33, 38, 0.12)',
        }}
      >
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted)' }}>
          Clarix / Week 1
        </p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.8rem, 6vw, 5.4rem)', lineHeight: 0.95 }}>
          Reporting infrastructure for Google Ads freelancers.
        </h1>
        <p style={{ margin: 0, maxWidth: '60ch', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)' }}>
          This initial build includes the login entrypoint, dashboard shell, backend auth bootstrap, workspace
          provisioning, and the first MCC account connection flow.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={`${apiUrl}/auth/google`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '220px',
              padding: '0.95rem 1.3rem',
              borderRadius: '999px',
              background: 'var(--accent)',
              color: 'white',
            }}
          >
            Continue With Google
          </a>
          <a
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '220px',
              padding: '0.95rem 1.3rem',
              borderRadius: '999px',
              border: '1px solid var(--border)',
            }}
          >
            Open Dashboard Shell
          </a>
        </div>
      </section>
    </main>
  );
}
