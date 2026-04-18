import { ReactNode } from 'react';
import { Sidebar } from '../../components/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
      }}
    >
      <Sidebar />
      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  );
}
