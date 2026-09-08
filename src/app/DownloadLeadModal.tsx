"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { Check, Download, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";
import { submitLead, trackEvent } from "@/lib/analytics";
import { downloadExtensionZip } from "@/lib/downloadExtension";
import { trackMeta } from "@/lib/metaPixel";
import styles from "./page.module.css";

type Phase = "form" | "downloading" | "success" | "error";

type Props = {
  open: boolean;
  initialPhase?: Phase;
  onClose: () => void;
};

/** Country dial codes for WhatsApp lead capture (MW/KE first). */
const COUNTRY_OPTIONS: { code: string; label: string; minDigits: number; maxDigits: number }[] = [
  { code: "+265", label: "🇲🇼 Malawi (+265)", minDigits: 9, maxDigits: 9 },
  { code: "+254", label: "🇰🇪 Kenya (+254)", minDigits: 9, maxDigits: 9 },
  { code: "+256", label: "🇺🇬 Uganda (+256)", minDigits: 9, maxDigits: 9 },
  { code: "+255", label: "🇹🇿 Tanzania (+255)", minDigits: 9, maxDigits: 9 },
  { code: "+250", label: "🇷🇼 Rwanda (+250)", minDigits: 9, maxDigits: 9 },
  { code: "+257", label: "🇧🇮 Burundi (+257)", minDigits: 8, maxDigits: 8 },
  { code: "+260", label: "🇿🇲 Zambia (+260)", minDigits: 9, maxDigits: 9 },
  { code: "+263", label: "🇿🇼 Zimbabwe (+263)", minDigits: 9, maxDigits: 9 },
  { code: "+258", label: "🇲🇿 Mozambique (+258)", minDigits: 9, maxDigits: 9 },
  { code: "+27", label: "🇿🇦 South Africa (+27)", minDigits: 9, maxDigits: 9 },
  { code: "+267", label: "🇧🇼 Botswana (+267)", minDigits: 8, maxDigits: 8 },
  { code: "+264", label: "🇳🇦 Namibia (+264)", minDigits: 9, maxDigits: 9 },
  { code: "+243", label: "🇨🇩 DR Congo (+243)", minDigits: 9, maxDigits: 9 },
  { code: "+234", label: "🇳🇬 Nigeria (+234)", minDigits: 10, maxDigits: 10 },
  { code: "+233", label: "🇬🇭 Ghana (+233)", minDigits: 9, maxDigits: 9 },
  { code: "+251", label: "🇪🇹 Ethiopia (+251)", minDigits: 9, maxDigits: 9 },
  { code: "+211", label: "🇸🇸 South Sudan (+211)", minDigits: 9, maxDigits: 9 },
  { code: "+249", label: "🇸🇩 Sudan (+249)", minDigits: 9, maxDigits: 9 },
  { code: "+252", label: "🇸🇴 Somalia (+252)", minDigits: 8, maxDigits: 9 },
  { code: "+253", label: "🇩🇯 Djibouti (+253)", minDigits: 8, maxDigits: 8 },
  { code: "+44", label: "🇬🇧 United Kingdom (+44)", minDigits: 10, maxDigits: 10 },
  { code: "+1", label: "🇺🇸 / 🇨🇦 USA / Canada (+1)", minDigits: 10, maxDigits: 10 },
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function DownloadLeadModal({ open, initialPhase = "form", onClose }: Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+265");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.code === countryCode) ?? COUNTRY_OPTIONS[0],
    [countryCode]
  );

  useEffect(() => {
    if (!open) return;
    setPhase(initialPhase);
    setError("");
    setSubmitting(false);
    setProgress(null);
  }, [open, initialPhase]);

  useEffect(() => {
    if (!open || initialPhase !== "downloading") return;
    let cancelled = false;

    (async () => {
      try {
        await runDownload();
        if (!cancelled) setPhase("success");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Download failed.");
          setPhase("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialPhase]);

  const canSubmit = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return (
      isValidEmail(email) &&
      digits.length >= selectedCountry.minDigits &&
      digits.length <= selectedCountry.maxDigits &&
      !submitting
    );
  }, [email, phone, selectedCountry, submitting]);

  async function runDownload() {
    setProgress(null);
    track("download_extension");
    sendGAEvent({ event: "download_extension", value: "hostase-extension.zip" });
    await trackEvent("download", { file: "hostase-extension.zip" });
    await downloadExtensionZip((pct) => setProgress(pct));
    trackMeta("ExtensionDownload", { content_name: "hostase-extension.zip" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    const digits = phone.replace(/\D/g, "");
    setSubmitting(true);

    const result = await submitLead({
      email: email.trim(),
      phone: digits,
      country_code: countryCode,
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error || "Something went wrong.");
      return;
    }

    setSubmitting(false);
    setPhase("downloading");

    try {
      await runDownload();
      setPhase("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
      setPhase("error");
    }
  }

  async function handleRetry() {
    setError("");
    setPhase("downloading");
    try {
      await runDownload();
      setPhase("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
      setPhase("error");
    }
  }

  if (!open) return null;

  const canClose = phase !== "downloading";
  const phonePlaceholder =
    selectedCountry.minDigits === selectedCountry.maxDigits
      ? `${"9".repeat(Math.min(selectedCountry.minDigits, 9))}`
      : `${selectedCountry.minDigits}–${selectedCountry.maxDigits} digits`;

  return (
    <div className={styles.leadOverlay} role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <div className={styles.leadModal}>
        {canClose && (
          <button type="button" className={styles.leadClose} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        )}

        {phase === "form" && (
          <>
            <h3 id="lead-title">Leave your contact to download</h3>
            <p className={styles.leadCopy}>
              Leaving your details helps us reach you for installation and setup support.
              Prefer a WhatsApp number so we can guide you quickly.
            </p>
            <form onSubmit={handleSubmit} className={styles.leadForm}>
              <label className={styles.leadLabel}>
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={styles.leadInput}
                />
              </label>
              <label className={styles.leadLabel}>
                WhatsApp number
                <div className={styles.leadPhoneRow}>
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setPhone("");
                    }}
                    className={styles.leadSelectWide}
                    required
                  >
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/[^\d]/g, "").slice(0, selectedCountry.maxDigits)
                      )
                    }
                    placeholder={phonePlaceholder}
                    className={styles.leadInput}
                  />
                </div>
              </label>
              {error && <p className={styles.leadError}>{error}</p>}
              <button
                type="submit"
                className={styles.btn}
                disabled={!canSubmit}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: canSubmit ? 1 : 0.55,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? "Submitting…" : "Submit and download"}
              </button>
            </form>
          </>
        )}

        {phase === "downloading" && (
          <div className={styles.leadStatus}>
            <div className={styles.leadSpinner} aria-hidden />
            <h3 id="lead-title">Downloading your extension…</h3>
            <p className={styles.leadCopy}>
              Please keep this window open. Your download will start automatically.
            </p>
            <div className={styles.leadProgressTrack} aria-hidden>
              {progress == null ? (
                <div className={styles.leadProgressFillIndeterminate} />
              ) : (
                <div className={styles.leadProgressFill} style={{ width: `${progress}%` }} />
              )}
            </div>
            <p className={styles.leadProgressLabel}>
              {progress == null ? "Preparing file…" : `${progress}%`}
            </p>
          </div>
        )}

        {phase === "success" && (
          <div className={styles.leadSuccess}>
            <div className={styles.leadSuccessIcon}>
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 id="lead-title">Download started</h3>
            <p>
              The Hostase extension zip is downloading. Next, unzip it and load it in Chrome or Brave
              using the steps below.
            </p>
            <button type="button" className={styles.btn} onClick={onClose}>
              Continue to install steps
            </button>
          </div>
        )}

        {phase === "error" && (
          <div className={styles.leadStatus}>
            <div className={styles.leadErrorIcon}>!</div>
            <h3 id="lead-title">Download failed</h3>
            <p className={styles.leadCopy}>{error || "Something went wrong. Please try again."}</p>
            <button
              type="button"
              className={styles.btn}
              onClick={handleRetry}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Download size={16} />
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
