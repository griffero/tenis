"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  className?: string;
  spin?: boolean;
  bounce?: boolean;
}

export function TennisBall({ size = 80, className, spin = true, bounce = false }: Props) {
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={
        bounce
          ? { y: [0, -size * 0.7, 0, -size * 0.35, 0], scaleY: [1, 1, 0.9, 1, 1] }
          : undefined
      }
      transition={bounce ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <motion.div
        className="tennis-ball"
        style={{ width: size, height: size }}
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: 9, repeat: Infinity, ease: "linear" } : undefined}
      />
    </motion.div>
  );
}
