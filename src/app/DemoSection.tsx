"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./page.module.css";

export default function DemoSection() {
  const fired = useRef(false);

  useEffect(() => {
    const section = document.getElementById("demo");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (fired.current) return;
        if (entries.some((e) => e.isIntersecting)) {
          fired.current = true;
          trackEvent("demo_view");
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.demoSection} id="demo">
      <div className={styles.demoHead}>
        <h2>Watch the demo</h2>
        <p>See how Hostase works from checkout to mobile money payment in under two minutes.</p>
      </div>
      <div className={styles.videoFrame}>
        <iframe
          src="https://www.youtube.com/embed/yAh1Q1F9B0o"
          title="Hostase demo — pay for Hostinger with mobile money"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
