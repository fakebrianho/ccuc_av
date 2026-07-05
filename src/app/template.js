"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig } from "motion/react";

// Re-mounts on every navigation, giving each page a seamless entrance.
// Single owner of the page transition; pages animate their own inner
// elements but never wrap themselves in another route-level transition.
export default function Template({ children }) {
  const ref = useRef(null);

  // Template re-mounts per navigation: move focus to the new page content
  // so keyboard/screen-reader users aren't stranded on the old position.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          outline: "none",
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
