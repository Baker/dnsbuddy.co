import '@/css/global.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/images/dnsbuddy.ico' sizes='any' />
        <link
          rel='apple-touch-icon'
          href='/images/dnsbuddy.png'
          type='image/png'
          sizes='32x32'
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
      </body>
    </html>
  );
}
