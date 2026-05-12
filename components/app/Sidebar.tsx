"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

export type NavItemKey = "dashboard" | "insights" | "system";

const navItems: Array<{
  key: NavItemKey;
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    key: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    description: "Control & telemetry",
    icon: <GridIcon />,
  },
  {
    key: "insights",
    href: "/insights",
    label: "Insights",
    description: "Anomalies & forecasts",
    icon: <PulseIcon />,
  },
  {
    key: "system",
    href: "/system",
    label: "System",
    description: "Runtime health",
    icon: <CpuIcon />,
  },
];

type SidebarProps = {
  collapsed: boolean;
  active: NavItemKey;
  onToggle: () => void;
  className?: string;
};

export function Sidebar({ collapsed, active, onToggle, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-dvh",
        "border-r border-[rgba(148,163,184,0.14)]",
        "bg-[linear-gradient(180deg,rgba(0,0,0,0.92),rgba(2,6,23,0.64))]",
        "backdrop-blur-2xl",
        className,
      )}
      style={{ width: collapsed ? 72 : "clamp(72px, 22vw, 280px)" }}
    >
      <div className="relative flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(34,211,238,0.22)] bg-[rgba(2,6,23,0.55)] glow-cyan">
              <LogoMark />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-0 max-[900px]:hidden"
                >
                  <div className="truncate text-sm font-semibold tracking-tight text-slate-50">
                    NavAI
                  </div>
                  <div className="truncate text-xs text-muted">GNSS Intelligence Platform</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl",
              "border border-[rgba(148,163,184,0.16)] bg-[rgba(2,6,23,0.52)]",
              "text-slate-200/85 transition-[transform,box-shadow,border-color] duration-200",
              "hover:border-[rgba(34,211,238,0.30)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.16),0_0_22px_rgba(34,211,238,0.12)]",
              "active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-3">
          {navItems.map((item) => (
            <SidebarItem
              key={item.key}
              collapsed={collapsed}
              active={active === item.key}
              href={item.href}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </nav>

        <div className="px-3 pb-4 max-[900px]:hidden">
          <div className="rounded-[18px] border border-[rgba(148,163,184,0.16)] bg-[rgba(2,6,23,0.44)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-200/70">
                Signal Integrity
              </div>
              <div className="text-xs font-semibold text-cyan-300/90">Nominal</div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(148,163,184,0.12)]">
              <div className="h-full w-[78%] rounded-full [background:linear-gradient(90deg,rgba(34,211,238,0.95),rgba(59,130,246,0.75))] shadow-[0_0_24px_rgba(34,211,238,0.18)]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  collapsed,
  active,
  href,
  icon,
  label,
  description,
}: {
  collapsed: boolean;
  active: boolean;
  href: string;
  icon: ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left",
        "border border-transparent",
        "transition-[border-color,box-shadow,background-color,transform] duration-200",
        active
          ? "bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.18)] shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_26px_rgba(34,211,238,0.10)]"
          : "hover:bg-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.14)]",
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl",
          active
            ? "bg-[rgba(2,6,23,0.50)] text-cyan-300/90"
            : "bg-[rgba(2,6,23,0.42)] text-slate-200/80 group-hover:text-slate-100",
          "border border-[rgba(148,163,184,0.14)]",
        )}
      >
        {icon}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.16 }}
            className="min-w-0 flex-1 max-[900px]:hidden"
          >
            <div className="truncate text-sm font-semibold tracking-tight text-slate-50">{label}</div>
            <div className="truncate text-xs text-muted">{description}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!collapsed ? (
        <div
          className={cn(
            "h-2 w-2 rounded-full max-[900px]:hidden",
            active ? "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]" : "bg-slate-400/30",
          )}
        />
      ) : null}
    </Link>
  );
}

function LogoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.8l7.7 4.4v9.6L12 21.2 4.3 16.8V7.2L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-cyan-300/90"
      />
      <path
        d="M7.1 9.1h9.8M8.3 12h7.4M9.6 14.9h4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="text-slate-100/70"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 6.75 9.25 12l5.25 5.25"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 6.75 14.75 12 9.5 17.25"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.75 4.75h6.5v6.5h-6.5v-6.5ZM12.75 4.75h6.5v6.5h-6.5v-6.5ZM4.75 12.75h6.5v6.5h-6.5v-6.5ZM12.75 12.75h6.5v6.5h-6.5v-6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 12h4l2-5 5 12 2-7h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 9h6v6H9V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 3v3M12 3v3M17 3v3M7 21v-3M12 21v-3M17 21v-3M3 7h3M3 12h3M3 17h3M21 7h-3M21 12h-3M21 17h-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 7h10v10H7V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-slate-100/40"
      />
    </svg>
  );
}
