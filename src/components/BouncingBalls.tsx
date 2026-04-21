"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function BouncingBalls({ count = 6 }: { count?: number }) {
  const balls = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: 14 + Math.random() * 28,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 7 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balls.map((b) => (
        <motion.div
          key={b.id}
          className="tennis-ball absolute"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            top: "-10%",
            opacity: 0.22,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: ["-10vh", "110vh"],
            x: [0, b.drift, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
