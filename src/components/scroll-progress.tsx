import { motion, useScroll, useSpring } from "framer-motion";

/** Slim neon scroll progress bar pinned to the top of the viewport.
 *  The default browser scrollbar is hidden site-wide in styles.css. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-primary neon-glow"
      style={{ scaleX }}
    />
  );
}
