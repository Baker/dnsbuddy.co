"use client";

import Footer from "@/components/footer";
import Navigation from "@/components/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Navigation />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
