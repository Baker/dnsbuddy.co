import '@/css/global.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/layout';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='icon'
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>"
        />
      </head>
      <body className=''>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
        <Script src='https://scripts.simpleanalyticscdn.com/latest.js' />
        <noscript>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src='https://queue.simpleanalyticscdn.com/noscript.gif'
            alt=''
            referrerPolicy='no-referrer-when-downgrade'
          />
        </noscript>
      </body>
    </html>
  );
}
