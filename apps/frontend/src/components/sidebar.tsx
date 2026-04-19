'use client';

import { BarChart3, Users, FileText, Settings, CreditCard, Menu, ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { Route } from 'next';

const navItems = [
  { name: 'Overview', href: '/dashboard' as Route, icon: BarChart3 },
  { name: 'Accounts', href: '/dashboard/accounts' as Route, icon: Users },
  { name: 'Reports', href: '/dashboard/reports' as Route, icon: FileText },
  { name: 'Clients', href: '/dashboard/clients' as Route, icon: Users },
];

const bottomNavItems = [
  { name: 'Billing', href: '/dashboard/billing' as Route, icon: CreditCard },
  { name: 'Settings', href: '/dashboard/workspace/settings' as Route, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? '80px' : '260px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width var(--transition-normal)',
    zIndex: 50,
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    margin: '0.25rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--accent-glow)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    transition: 'all var(--transition-fast)',
    justifyContent: collapsed ? 'center' : 'flex-start',
  });

  return (
    <aside style={sidebarStyle} className="glass">
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
            Clarix<span style={{ color: 'var(--accent-primary)' }}>.</span>
          </span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--text-secondary)', display: 'grid', placeItems: 'center' }}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          color: 'var(--text-muted)',
          padding: '0 1rem',
          opacity: collapsed ? 0 : 1,
          transition: 'opacity var(--transition-fast)',
          whiteSpace: 'nowrap'
        }}>
          Menu
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} style={linkStyle(isActive)} title={item.name}>
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} style={linkStyle(isActive)} title={item.name}>
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
        <div style={{ marginTop: '1rem', padding: '0 1.5rem', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: 'var(--radius-full)', 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-strong)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            U
          </div>
          {!collapsed && (
            <div style={{ marginLeft: '0.75rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>User Name</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
