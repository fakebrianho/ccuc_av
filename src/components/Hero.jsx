"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/motion/SmoothScroll";
import WeekStatus from "@/components/WeekStatus";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef(null);
  const lenis = useLenis();

  // Keep ScrollTrigger in sync with Lenis-driven scroll.
  useEffect(() => {
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    return () => lenis.off("scroll", update);
  }, [lenis]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.line}`, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.15,
      });
      gsap.from(`.${styles.sub}, .${styles.ctas}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.7,
        ease: "power2.out",
      });

      gsap.utils.toArray(`.${styles.panel}`).forEach((panel) => {
        gsap.from(panel, {
          opacity: 0,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.mask}>
            <span className={styles.line}>CCUC AV</span>
          </span>
        </h1>
        <p className={styles.sub}>
          The audio &amp; visual department of CCUC.
        </p>
        <WeekStatus />
        <div className={styles.ctas}>
          <Link href="/submit" className={styles.primary}>
            Submit a ticket
          </Link>
          <Link href="/tracker" className={styles.secondary}>
            View the tracker
          </Link>
        </div>
      </section>

      <section className={styles.panels}>
        <div className={styles.panel}>
          <h2>Team</h2>
          <p>Who we are and how to reach us.</p>
          <Link href="/team" className={styles.panelLink}>
            See the team →
          </Link>
        </div>
        <div className={styles.panel}>
          <h2>Responsibilities</h2>
          <p>What the AV department covers, and what it doesn&apos;t.</p>
          <Link href="/responsibilities" className={styles.panelLink}>
            Our responsibilities →
          </Link>
        </div>
        <div className={styles.panel}>
          <h2>Tickets</h2>
          <p>Report an issue or request AV support, then track its status.</p>
          <Link href="/submit" className={styles.panelLink}>
            Open a ticket →
          </Link>
        </div>
      </section>
    </div>
  );
}
