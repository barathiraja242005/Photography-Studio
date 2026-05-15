"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Max degrees of rotation in each axis */
  intensity?: number;
  /** CSS perspective in px — lower = more dramatic */
  perspective?: number;
  /** Subtle hover scale to feel "pickup" */
  hoverScale?: number;
}

/**
 * Mouse-follow 3D tilt wrapper.
 * Pointer position drives a spring-tracked rotateX / rotateY on the child.
 * Resets smoothly on mouse leave.
 */
export default function Tilt3D({
  children,
  className,
  intensity = 10,
  perspective = 1400,
  hoverScale = 1.02,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: hoverScale }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ rotateX, rotateY, transformPerspective: perspective }}
      className={cn("[transform-style:preserve-3d] will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
