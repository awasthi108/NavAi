"use client";

import { useEffect, useMemo, useState } from "react";

type UseNowOptions = {
  intervalMs?: number;
  timeZone?: string;
  locale?: string;
  timeZoneLabel?: string;
};

export function useNow(options: UseNowOptions = {}) {
  const { intervalMs = 1000, timeZone = "Asia/Kolkata", locale = "en-IN", timeZoneLabel = "IST" } = options;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const initialId = window.setTimeout(tick, 0);
    const intervalId = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
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
    });
    const suffix = timeZoneLabel ? ` ${timeZoneLabel}` : "";
    return `${df.format(now)}${suffix}`;
  }, [locale, now, timeZone, timeZoneLabel]);

  return { now, formatted };
}
