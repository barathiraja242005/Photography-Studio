"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * BgVideo — autoplay, muted, looped, playsInline.
 * Falls back to a poster image if the video fails to play.
 * Pauses when off-screen to save CPU/battery.
 */
export default function BgVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={cn("h-full w-full object-cover", className)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
