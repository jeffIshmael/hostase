const META_PIXEL_ID = "1582533410234277";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function trackMeta(
  event: "PageView" | "Lead" | "CompleteRegistration" | "Subscribe" | string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      if (event === "PageView" || event === "Lead" || event === "CompleteRegistration" || event === "Subscribe") {
        window.fbq("track", event, params);
      } else {
        window.fbq("trackCustom", event, params);
      }
    }
  } catch {
    // Pixel must never break the site
  }
}

/** Image beacon fallback (works without fbq, useful from extension). */
export function trackMetaBeacon(event: string) {
  if (typeof window === "undefined") return;
  try {
    const img = new Image();
    img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=${encodeURIComponent(event)}&noscript=1`;
  } catch {
    // ignore
  }
}

export { META_PIXEL_ID };
