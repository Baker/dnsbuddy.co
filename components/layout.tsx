'use client';

import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-col'>
      <Navigation />
      <div className='flex-grow'>{children}</div>
      <Footer />
    </div>
  );
}
