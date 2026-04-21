"use client";
import { motion } from "framer-motion";

export function Court({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="court-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f5a32" />
          <stop offset="100%" stopColor="#0d2a18" />
        </linearGradient>
        <linearGradient id="net-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>
      <rect width="600" height="340" rx="22" fill="url(#court-g)" />
      {/* outer court */}
      <motion.rect
        x="50"
        y="40"
        width="500"
        height="260"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* singles sideline */}
      <motion.rect
        x="80"
        y="40"
        width="440"
        height="260"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
      />
      {/* service boxes */}
      <motion.line
        x1="80"
        y1="110"
        x2="520"
        y2="110"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.line
        x1="80"
        y1="230"
        x2="520"
        y2="230"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.line
        x1="300"
        y1="110"
        x2="300"
        y2="230"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      {/* center mark */}
      <line x1="300" y1="40" x2="300" y2="52" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      <line x1="300" y1="288" x2="300" y2="300" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      {/* net */}
      <rect x="298" y="40" width="4" height="260" fill="url(#net-g)" />
      <motion.line
        x1="50"
        y1="170"
        x2="550"
        y2="170"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.9 }}
      />
    </svg>
  );
}
