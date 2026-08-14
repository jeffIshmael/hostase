import styles from "./page.module.css";
import TabsSection from "./TabsSection";
import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.mesh}></div>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className={styles.dot}></span> Now live for Malawi checkout
            </div>
            <h1 className={styles.title}>
              Hostinger payments,<br />
              <span className={styles.accent}>simplified.</span>
            </h1>
            <p className={styles.description}>
              Paying for hosting on Hostinger using Malawian Kwacha (Mobile Money).
            </p>
            <div className={styles.heroCtas}>
              <a href="/hostase-extension.zip" download className={styles.btn}>
                Install for Chrome / Brave
              </a>
              <a href="#flow" className={`${styles.btn} ${styles.btnGhost}`}>
                See how it works
              </a>
            </div>

            <div className={styles.mockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupMerchant}>
                  <span className={styles.mockupMerchantIcon}>H</span>
                  <div className={styles.mockupMerchantText}>
                    <span className={styles.mockupMerchantName}>Hostinger</span>
                    <span className={styles.mockupOrderId}>Order #HS-88213</span>
                  </div>
                </div>
                <span className={styles.mockupBadge}>Pending</span>
              </div>

              <div className={styles.mockupDivider}></div>

              <div className={styles.mockupLineItems}>
                <div className={styles.mockupLineItem}>
                  <span>Domain Purchase</span>
                  <span className={styles.mockupLineItemValue}>86,500 MWK</span>
                </div>
                <div className={styles.mockupLineItem}>
                  <span>Network Fee</span>
                  <span className={styles.mockupLineItemValue}>4650 MWK</span>
                </div>
              </div>

              <div className={styles.mockupDivider}></div>

              <div className={styles.mockupTotalRow}>
                <div className={styles.mockupTotalLeft}>
                  <span className={styles.mockupTotalLabel}>Total MWK</span>
                </div>
                <span className={styles.mockupTotalValue}>91,150 MWK</span>
              </div>

              <div className={styles.mockupDivider} style={{ borderStyle: 'dashed' }}></div>

              <div className={styles.mockupLineItems} style={{ marginBottom: '16px' }}>
                <div className={styles.mockupLineItem}>
                  <span>Mobile Money No.</span>
                  <span className={styles.mockupLineItemValue}>+265 99 123 4567</span>
                </div>
              </div>

              <button className={styles.mockupCta}>Pay 91,150 MWK</button>
            </div>
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
              <p>Choose CoinGate at Hostinger checkout. The extension automatically detects the exact USDC amount and wallet address.</p>
            </div>
            <div className={styles.flowNode}>
              <div className={styles.flowBadge}><span>💸</span></div>
              <span className={`${styles.flowLabel} mono`}>03 · PAY</span>
              <h3>Pay with Mobile Money</h3>
              <p>Open the extension and click pay. You'll receive a prompt on your phone to instantly confirm the payment.</p>
            </div>
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
