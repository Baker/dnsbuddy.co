"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0];
// Credit: https://github.com/pacocoursey/next-themes/blob/main/examples/with-app-dir/src/components/ThemeProvider.tsx

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
