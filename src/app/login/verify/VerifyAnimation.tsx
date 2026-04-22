"use client";
import { motion } from "framer-motion";
import { BouncingBalls } from "@/components/BouncingBalls";

export function VerifyAnimation() {
  return (
    <>
      <BouncingBalls count={3} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full max-w-md surface rounded-3xl p-10 text-center shadow-2xl"
      >
        <div className="relative mx-auto h-28 w-28">
          <motion.div
            className="absolute inset-0 rounded-full border border-ball/30"
            animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-ball/20"
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
          <div className="absolute inset-4 rounded-full bg-ball/15 grid place-items-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <EmailIcon />
            </motion.div>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-2xl md:text-3xl font-semibold tracking-tight"
        >
          Revisa tu <span className="text-ball">email</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-white/60 text-sm leading-relaxed"
        >
          Te enviamos un enlace mágico. Tócalo desde el mismo dispositivo para entrar al torneo.
          <br />
          El enlace expira en 10 minutos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs text-white/35"
        >
          ¿No te llegó? Revisa el spam o vuelve a intentar.
        </motion.div>
      </motion.div>
    </>
  );
}

function EmailIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4ff3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
