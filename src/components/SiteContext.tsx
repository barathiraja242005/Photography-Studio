"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/types";

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteData;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteData {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error(
      "useSite() must be used inside <SiteProvider>. Make sure the root page wraps content in <SiteProvider value={data}>.",
    );
  }
  return ctx;
}
