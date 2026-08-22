import styles from "./page.module.css";
import TabsSection from "./TabsSection";
import Header from "./Header";
import HeroMockup from "./HeroMockup";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.mesh}></div>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className={styles.dot}></span> Now live for Malawi & Kenya checkout
            </div>
            <h1 className={styles.title}>
              Hostinger payments,<br />
              <span className={styles.accent}>simplified.</span>
            </h1>
            <p className={styles.description}>
              Hosting purchase on Hostinger using Malawian Kwacha (MWK) or Kenyan Shillings (KES) via Mobile Money.
            </p>
            <div className={styles.heroCtas}>
              <a href="#tabs" className={styles.btn}>
                Install for Chrome / Brave
              </a>
              <a href="#demo" className={`${styles.btn} ${styles.btnGhost}`}>
                See how it works
              </a>
            </div>

            <HeroMockup />
          </div>
        </section>

        <section className={styles.flow} id="flow">
          <div className={styles.flowHead}>
            <h2>Three steps. One checkout.</h2>
            <p>The extension sits on Hostinger's payment page and handles the whole conversion path for you.</p>
          </div>
          <div className={styles.flowTrack}>
            <div className={styles.flowNode}>
              <div className={styles.flowBadge}><span>📱</span></div>
              <span className={`${styles.flowLabel} mono`}>01 · SETUP</span>
              <h3>One-time KYC</h3>
              <p>Register your details and Mobile Money network securely in the extension just once.</p>
            </div>
            <div className={styles.flowNode}>
              <div className={styles.flowBadge}><span>🛒</span></div>
              <span className={`${styles.flowLabel} mono`}>02 · CHECKOUT</span>
              <h3>Auto-Detection</h3>
              <p>Choose CoinGate at Hostinger checkout. The extension automatically detects the exact amount, just copy the address given.</p>
            </div>
            <div className={styles.flowNode}>
              <div className={styles.flowBadge}><span>💸</span></div>
              <span className={`${styles.flowLabel} mono`}>03 · PAY</span>
              <h3>Pay with Mobile Money</h3>
              <p>Open the extension, paste the address and click pay. You'll receive a prompt on your phone to instantly confirm the payment.</p>
            </div>
          </div>
        </section>

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

        <TabsSection />

        <footer className={styles.footer}>
          <div className={styles.footerCopy}>© {new Date().getFullYear()} Hostase. Not affiliated with Hostinger.</div>
        </footer>
      </main>
    </>
  );
}
