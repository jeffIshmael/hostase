"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import styles from "./page.module.css";

function CopyableCode({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={styles.codeSnippet} 
      style={{ 
        cursor: 'pointer', 
        padding: '8px 12px', 
        background: 'var(--bg-base)', 
        borderRadius: '6px', 
        border: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: 'var(--slate-600)',
        fontSize: '0.85rem'
      }}
    >
      <span>{text}</span>
      {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} style={{ color: 'var(--slate-500)' }} />}
    </button>
  );
}

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  return (
    <section className={styles.tabsSection} id="tabs">
      <div className={styles.tabTrack}>
        <button
          className={`${styles.tabBtn} ${activeTab === 0 ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab(0)}
        >
          How to Install
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 1 ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab(1)}
        >
          How to Use
        </button>
        <div
          className={styles.tabSlider}
          style={{ transform: activeTab === 0 ? "translateX(0)" : "translateX(100%)" }}
        ></div>
      </div>

      <div className={styles.tabPanel} style={{ display: activeTab === 0 ? "block" : "none" }}>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>1</div>
            <h4>Download the Extension</h4>
            <p>Download the zipped package, then <strong>unzip/extract</strong> it to a folder on your computer.</p>
            <a href="/hostase-extension.zip" download className={styles.downloadBtn}>
              <Download size={16} />
              <span>Download .zip Folder</span>
            </a>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>2</div>
            <h4>Open the Extensions page</h4>
            <p>Open a new tab and paste one of them in the URL bar.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <CopyableCode text="chrome://extensions" />
              <CopyableCode text="brave://extensions" />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>3</div>
            <h4>Enable Developer Mode</h4>
            <p>Toggle it on in the top-right corner.</p>
            <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/toggle.png" alt="Developer mode toggle" className={styles.frameImage} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>4</div>
            <h4>Load Unpacked</h4>
            <p>Click the <strong>Load unpacked</strong> button and select the unzipped folder that you downloaded.</p>
            <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/unpack.png" alt="Load unpacked dialog" className={styles.frameImage} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>5</div>
            <h4>Pin it</h4>
            <p>Pin the extension so it's one click away on checkout.</p>
             <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/pin.png" alt="Load unpacked dialog" className={styles.frameImage} />
            </div>
          </div>
           <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>5</div>
            <h4>Sign in</h4>
            <p>Open the extention and sign in with your email.</p>
             <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/signin.png" alt="Get started" className={styles.frameImage} />
            </div>
          </div>
           <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>5</div>
            <h4>Complete profile details.</h4>
            <p>Complete your profile details.</p>
             <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/details.png" alt="Complete profle details" className={styles.frameImage} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabPanel} style={{ display: activeTab === 1 ? "block" : "none" }}>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>1</div>
            <h4>Search for a Domain</h4>
            <p>Go to <a href="https://hostinger.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-500)', textDecoration: 'underline' }}>Hostinger</a> and search for a domain of your choice.</p>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>2</div>
            <h4>Select CoinGate at Checkout</h4>
            <p>In the checkout page, select additional payment methods and choose <strong>CoinGate</strong>.</p>
            <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/Coingate.png" alt="Select CoinGate" className={styles.frameImage} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>3</div>
            <h4>Select Currency and Network</h4>
            <p>Click <strong>Select currency</strong> and choose currency <strong>USDC</strong> and network <strong>Base</strong>.</p>
            <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/network&currency.png" alt="Select Network and Currency" className={styles.frameImage} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>4</div>
            <h4>Copy Payment Details</h4>
            <p>A final screen will show your invoice. Copy the <strong>address</strong> provided.</p>
            <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/checkout.png" alt="Checkout details" className={styles.frameImage} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={`${styles.stepNum} mono`}>5</div>
            <h4>Pay with Hostase</h4>
            <p>Open the Hostase extension and paste the copied address. We'll automatically calculate the cost in MWK. Confirm details and <strong>Make Payment</strong>.</p>
             <div className={styles.frame}>
              <div className={styles.frameBar}><span></span><span></span><span></span></div>
              <img src="/images/address.png" alt="Checkout details" className={styles.frameImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
