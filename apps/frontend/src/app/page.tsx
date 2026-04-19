'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart3, Clock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.5s ease-in',
      }}
      className="animate-fade-in"
    >
      {/* Top Nav (Minimal) */}
      <nav style={{
        width: 'min(1200px, 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        marginBottom: '4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'grid', placeItems: 'center' }}>
            <BarChart3 size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
            Clarix<span style={{ color: 'var(--accent-primary)' }}>.</span>
          </span>
        </div>
        <div>
          <a href={`${apiUrl}/auth/google`}>
            <Button variant="ghost">Log in</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          width: 'min(980px, 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
          marginBottom: '6rem',
        }}
      >
        <div style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1rem', 
          borderRadius: 'var(--radius-full)', 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-strong)',
          fontSize: '0.875rem',
          color: 'var(--accent-primary)',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          ✨ Now available for Google Ads Freelancers
        </div>
        
        <h1 style={{ margin: 0, fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Stop formatting <span style={{ color: 'var(--text-muted)' }}>PDFs.</span><br />
          Start <span style={{ 
            background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>analyzing.</span>
        </h1>
        
        <p style={{ margin: 0, maxWidth: '65ch', fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Clarix connects to your Google Ads MCC, syncs metrics automatically, generates AI-driven insights, and delivers branded PDF reports to your clients.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={`${apiUrl}/auth/google`}>
            <Button size="lg" style={{ gap: '0.5rem' }}>
              Get Started for Free <ArrowRight size={18} />
            </Button>
          </a>
          <a href="/dashboard">
            <Button variant="secondary" size="lg">
              View Demo Dashboard
            </Button>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        width: 'min(1200px, 100%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '6rem',
      }}>
        <Card hoverLift glow>
          <Zap style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} size={32} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Automated Sync</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Never pull data manually again. Daily syncs ensure your metrics are always up-to-date and ready for reporting.</p>
        </Card>
        
        <Card hoverLift glow>
          <BarChart3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} size={32} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Narratives</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Gemini 1.5 Flash analyzes your performance data and writes professional summaries highlighting key wins and areas of focus.</p>
        </Card>
        
        <Card hoverLift glow>
          <Clock style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} size={32} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Scheduled Delivery</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Set it and forget it. Reports are automatically generated as branded PDFs and emailed to your clients on the 1st of every month.</p>
        </Card>
      </section>
    </main>
  );
}
