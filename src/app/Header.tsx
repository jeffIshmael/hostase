"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
        <Image src="/images/logo.png" alt="Hostase Logo" width={32} height={32} style={{borderRadius: '8px'}} />
        <span style={{marginLeft: '12px'}}>Hostase</span>
      </div>
      <a href="#tabs" className={pageStyles.btn}>
        Get Extension
      </a>
    </header>
  );
}
