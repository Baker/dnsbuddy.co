"use client";

import Navigation from "@/components/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="">
        <Navigation />
      </div>
      {children}
    </div>
  );
}
