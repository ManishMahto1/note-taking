import type { Metadata } from 'next';
import './globals.css';
import AppWrapper from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'HD Notes App',
  description: 'A note-taking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}