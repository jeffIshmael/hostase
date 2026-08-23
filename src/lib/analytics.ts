const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://chrome-hostinger.vercel.app";
const SESSION_COOKIE = "hostase_sid";
const SESSION_MAX_AGE_DAYS = 30;

export type AnalyticsEventType = "page_view" | "download" | "demo_view" | "cta_click";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getOrCreateSessionId(): string {
  let sid = readCookie(SESSION_COOKIE);
  if (!sid) {
    sid = crypto.randomUUID();
    writeCookie(SESSION_COOKIE, sid, SESSION_MAX_AGE_DAYS);
  }
  return sid;
}

function parseUtmParams(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };
}

async function postAnalytics(path: string, body: Record<string, unknown>) {
  try {
    await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Analytics must never break the landing page
  }
}

export async function registerSession() {
  const session_id = getOrCreateSessionId();
  const utm = parseUtmParams();
  await postAnalytics("/analytics/session", {
    session_id,
    ...utm,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    landing_path: typeof window !== "undefined" ? window.location.pathname : "/",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  });
}

export async function trackEvent(
  event_type: AnalyticsEventType,
  metadata?: Record<string, string>
) {
  const session_id = getOrCreateSessionId();
  await postAnalytics("/analytics/event", {
    session_id,
    event_type,
    path: typeof window !== "undefined" ? window.location.pathname : "/",
    metadata,
  });
}
