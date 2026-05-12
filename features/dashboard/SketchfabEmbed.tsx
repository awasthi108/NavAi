"use client";

import { cn } from "@/lib/cn";

type SketchfabEmbedProps = {
  title: string;
  modelId: string;
  className?: string;
};

export function SketchfabEmbed({ title, modelId, className }: SketchfabEmbedProps) {
  const src = `https://sketchfab.com/models/${modelId}/embed`;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(900px_280px_at_40%_0%,rgba(34,211,238,0.14),transparent_55%)]" />
      <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.14)] bg-black/40 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_18px_60px_rgba(0,0,0,0.55)]">
        <iframe
          title={title}
          src={src}
          allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
          allowFullScreen
          className="block h-full w-full"
          loading="lazy"
          frameBorder={0}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}

