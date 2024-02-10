import "@/css/global.css";

import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

import { Domine, Open_Sans } from "next/font/google";

const domine = Domine({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-domine",
});

const openSans = Open_Sans({
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${domine.variable} ${openSans.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
