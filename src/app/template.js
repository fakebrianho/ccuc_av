"use client";

import { motion, MotionConfig } from "motion/react";

// Re-mounts on every navigation, giving each page a seamless entrance.
// Single owner of the page transition; pages animate their own inner
// elements but never wrap themselves in another route-level transition.
export default function Template({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
