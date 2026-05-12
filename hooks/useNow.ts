"use client";

import { useEffect, useMemo, useState } from "react";

type UseNowOptions = {
  intervalMs?: number;
  timeZone?: string;
  locale?: string;
};

export function useNow(options: UseNowOptions = {}) {
  const { intervalMs = 1000, timeZone = "UTC", locale = "en-US" } = options;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  const formatted = useMemo(() => {
    if (!now) {
      return "Syncing...";
    }

    const df = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
    return df.format(now);
  }, [locale, now, timeZone]);

  return { now, formatted };
}
