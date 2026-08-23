"use client";

import { trackEvent } from "@/lib/analytics";
import styles from "./page.module.css";

export default function HeroCtas() {
  return (
    <div className={styles.heroCtas}>
      <a
        href="#tabs"
        className={styles.btn}
        onClick={() => trackEvent("cta_click", { target: "install" })}
      >
        Install for Chrome / Brave
      </a>
      <a
        href="#demo"
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={() => trackEvent("cta_click", { target: "demo" })}
      >
        See how it works
      </a>
    </div>
  );
}
