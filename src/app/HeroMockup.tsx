"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Currency = "MWK" | "KES";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://chrome-hostinger.vercel.app";

/** Fixed live-style KES rate for the hero mock (matches production executable band). */
const KES_PER_USDC = 132;

/** Example domain size in USDC — derived from the original MWK mock at ~4651 MWK/USDC. */
const EXAMPLE_DOMAIN_USDC = 14647 / 4651;
const FEE_USDC = 1;

const FALLBACK_MWK_PER_USDC = 4651;

const PHONES: Record<Currency, string> = {
  MWK: "+265 99 123 4567",
  KES: "+254 712 345 678",
};

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US");
}

function lineItemsForRate(rate: number) {
  const domain = Math.ceil(EXAMPLE_DOMAIN_USDC * rate);
  const fee = Math.ceil(FEE_USDC * rate);
  return { domain, fee, total: domain + fee };
}

export default function HeroMockup() {
  const [currency, setCurrency] = useState<Currency>("MWK");
  const [mwkPerUsdc, setMwkPerUsdc] = useState(FALLBACK_MWK_PER_USDC);

  useEffect(() => {
    fetch(`${API_URL}/rate?currency=MWK&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.rate === "number" && data.rate > 0) {
          setMwkPerUsdc(data.rate);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  const { domain, fee, total } =
    currency === "MWK"
      ? lineItemsForRate(mwkPerUsdc)
      : lineItemsForRate(KES_PER_USDC);

  return (
    <div className={styles.mockupStage}>
      <div className={styles.mockupAmbient} aria-hidden="true">
        <span className={styles.mockupBlobA} />
        <span className={styles.mockupBlobB} />
      </div>

      <div className={styles.mockupScene}>
        <div className={styles.originCluster} aria-hidden="true">
          <div className={styles.browserChip}>
            <div className={styles.browserTraffic}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.browserUrl}>
              <span className={styles.browserLock} />
              hostinger.com/checkout
            </div>
          </div>

          <div className={styles.originOrb}>
            <span className={styles.originRing} />
            <span className={styles.originRing} />
            <span className={styles.originCore}>H</span>
          </div>

          <div className={styles.originCaption}>
            <strong>Hostinger</strong>
            <span>Coingate checkout</span>
          </div>
        </div>

        <svg
          className={styles.signalSvg}
          viewBox="0 0 160 120"
          fill="none"
          aria-hidden="true"
        >
          <path
            className={styles.signalTrack}
            d="M8 28 C 48 28, 52 92, 80 92 S 112 28, 152 52"
          />
          <path
            className={styles.signalDash}
            d="M8 28 C 48 28, 52 92, 80 92 S 112 28, 152 52"
          />
          <circle className={styles.signalBead} r="4.5" fill="currentColor">
            <animateMotion
              dur="2.8s"
              repeatCount="indefinite"
              path="M8 28 C 48 28, 52 92, 80 92 S 112 28, 152 52"
            />
          </circle>
        </svg>

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

          <div className={styles.currencyToggle} role="group" aria-label="Currency">
            <button
              type="button"
              className={`${styles.currencyToggleBtn} ${currency === "MWK" ? styles.currencyToggleBtnActive : ""}`}
              onClick={() => setCurrency("MWK")}
              aria-pressed={currency === "MWK"}
            >
              MWK
            </button>
            <button
              type="button"
              className={`${styles.currencyToggleBtn} ${currency === "KES" ? styles.currencyToggleBtnActive : ""}`}
              onClick={() => setCurrency("KES")}
              aria-pressed={currency === "KES"}
            >
              KES
            </button>
          </div>

          <div className={styles.mockupDivider}></div>

          <div className={styles.mockupLineItems}>
            <div className={styles.mockupLineItem}>
              <span>Domain Purchase</span>
              <span className={styles.mockupLineItemValue}>
                {formatAmount(domain)} {currency}
              </span>
            </div>
            <div className={styles.mockupLineItem}>
              <span>Network Fee</span>
              <span className={styles.mockupLineItemValue}>
                {formatAmount(fee)} {currency}
              </span>
            </div>
          </div>

          <div className={styles.mockupDivider}></div>

          <div className={styles.mockupTotalRow}>
            <div className={styles.mockupTotalLeft}>
              <span className={styles.mockupTotalLabel}>Total {currency}</span>
            </div>
            <span className={styles.mockupTotalValue}>
              {formatAmount(total)} {currency}
            </span>
          </div>

          <div className={styles.mockupDivider} style={{ borderStyle: "dashed" }}></div>

          <div className={styles.mockupLineItems} style={{ marginBottom: "16px" }}>
            <div className={styles.mockupLineItem}>
              <span>Mobile Money No.</span>
              <span className={styles.mockupLineItemValue}>{PHONES[currency]}</span>
            </div>
          </div>

          <button type="button" className={styles.mockupCta}>
            Pay {formatAmount(total)} {currency}
          </button>
        </div>

        <div className={styles.phoneNode} aria-hidden="true">
          <div className={styles.phoneBody}>
            <span className={styles.phoneNotch} />
            <span className={styles.phonePrompt}>
              <span className={styles.phonePromptDot} />
              Confirm payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
