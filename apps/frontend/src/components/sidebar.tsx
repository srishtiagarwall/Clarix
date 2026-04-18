const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/accounts', label: 'Accounts' },
];

export function Sidebar() {
  return (
    <aside
      style={{
        borderRight: '1px solid var(--border)',
        padding: '2rem 1.25rem',
        background: 'rgba(255,255,255,0.54)',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Clarix
        </p>
        <h2 style={{ marginBottom: 0 }}>Operator Console</h2>
      </div>
      <nav style={{ display: 'grid', gap: '0.75rem' }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '18px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
