import "@/css/global.css";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "DnsBuddy | Index",
  description: "Your friendly neighborhood DNS lookup tool."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>"
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
