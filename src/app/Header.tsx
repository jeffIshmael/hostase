"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import pageStyles from "./page.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        Hostase
      </div>
      <a href="#tabs" className={pageStyles.btn}>
        Get Extension
      </a>
    </header>
  );
}
