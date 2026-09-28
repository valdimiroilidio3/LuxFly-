"use client";

import { motion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string[];
  lead?: string;
}) {
  return (
    <header className="shell pt-[152px] pb-[64px] md:pt-[200px] md:pb-[96px]">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="eyebrow text-ink/40"
      >
        {eyebrow}
      </motion.p>

      <h1 className="display mt-7 text-[clamp(2.8rem,10vw,9rem)]">
        {title.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: EASE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {lead && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="mt-10 max-w-[52ch] text-[16px] leading-[1.65] text-ink/60 md:text-[17px]"
        >
          {lead}
        </motion.p>
      )}
    </header>
  );
}
