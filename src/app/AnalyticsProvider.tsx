"use client";

import { useEffect } from "react";
import { registerSession, trackEvent } from "@/lib/analytics";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerSession().then(() => trackEvent("page_view"));
  }, []);

  return <>{children}</>;
}
