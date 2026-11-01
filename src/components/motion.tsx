import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise into view once, with a stagger delay. */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Section heading that clips in from below. */
export function SectionHeading({
  children,
  className = "",
  sub,
}: {
  children: ReactNode;
  className?: string;
  sub?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      <motion.h2
        className="heading-section"
        initial={{ opacity: 0, y: reduce ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ clipPath: "inset(0 0 -10% 0)" }}
      >
        {children}
      </motion.h2>
      {sub && (
        <motion.p
          className="mt-2 max-w-xl text-muted-foreground"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
