import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deen Al Noor Travels',
  description: 'Travel agency management system for Hajj and Umrah operations'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
