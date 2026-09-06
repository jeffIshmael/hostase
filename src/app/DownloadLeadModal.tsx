"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { Check, Download, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { sendGAEvent } from "@next/third-parties/google";
import { submitLead, trackEvent } from "@/lib/analytics";
import { downloadExtensionZip } from "@/lib/downloadExtension";
import styles from "./page.module.css";

type Phase = "form" | "downloading" | "success" | "error";

type Props = {
  open: boolean;
  initialPhase?: Phase;
  onClose: () => void;
};

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
    return isValidEmail(email) && digits.length === 9 && !submitting;
  }, [email, phone, submitting]);

  async function runDownload() {
    setProgress(null);
    track("download_extension");
    sendGAEvent({ event: "download_extension", value: "hostase-extension.zip" });
    await trackEvent("download", { file: "hostase-extension.zip" });
    await downloadExtensionZip((pct) => setProgress(pct));
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
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={styles.leadSelect}
                    required
                  >
                    <option value="+265">🇲🇼 +265</option>
                    <option value="+254">🇰🇪 +254</option>
                  </select>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 9))}
                    placeholder="9XXXXXXXX"
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
            <button type="button" className={styles.btn} onClick={handleRetry} style={{ width: "100%", justifyContent: "center" }}>
              <Download size={16} />
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
