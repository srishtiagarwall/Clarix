import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Clarix | AI Reporting for Google Ads',
  description: 'Automated, beautiful Google Ads reporting for freelancers and agencies.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gradient-texture" />
        {children}
      </body>
    </html>
  );
}
