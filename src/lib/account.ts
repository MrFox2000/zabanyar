/**
 * Email accounts on Supabase, using its REST API directly (no SDK dependency).
 *
 * Nothing here runs until NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY exist; without them `authConfigured()` is false
 * and the app keeps working in guest mode.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SESSION_KEY = "zabanyar.session.v1";

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  email: string;
};

export function authConfigured(): boolean {
  return Boolean(URL_BASE && ANON_KEY);
}

function headers(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: ANON_KEY,
    "Content-Type": "application/json",
    ...extra,
  };
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { msg?: string; error_description?: string; message?: string };
    return body.msg ?? body.error_description ?? body.message ?? `http_${response.status}`;
  } catch {
    return `http_${response.status}`;
  }
}

/** friendly Persian text for the errors a learner can actually hit */
export function authMessage(error: string): string {
  const text = error.toLowerCase();
  if (text.includes("already registered") || text.includes("already been registered")) return "این ایمیل قبلاً ثبت شده — وارد شو";
  if (text.includes("invalid login") || text.includes("invalid_grant")) return "ایمیل یا رمز اشتباه است";
  if (text.includes("password") && text.includes("6")) return "رمز باید حداقل ۶ کاراکتر باشد";
  if (text.includes("email") && text.includes("invalid")) return "ایمیل معتبر نیست";
  if (text.includes("email not confirmed")) return "ایمیل تأیید نشده — صندوقت را چک کن";
  if (text.includes("rate") || text.includes("too many")) return "تلاش زیادی — چند دقیقه بعد امتحان کن";
  return "خطا در ارتباط با سرور حساب";
}

function sessionFrom(raw: Record<string, unknown>): Session | null {
  const user = raw.user as { id?: string; email?: string } | undefined;
  if (!raw.access_token || !user?.id) return null;
  return {
    access_token: String(raw.access_token),
    refresh_token: String(raw.refresh_token ?? ""),
    expires_at: Number(raw.expires_at ?? 0) || Date.now() / 1000 + Number(raw.expires_in ?? 3600),
    user_id: user.id,
    email: user.email ?? "",
  };
}

export async function signUp(email: string, password: string): Promise<{ session: Session | null; needsConfirm: boolean } | { error: string }> {
  if (!authConfigured()) return { error: "auth_not_configured" };
  const response = await fetch(`${URL_BASE}/auth/v1/signup`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return { error: await parseError(response) };

  const body = (await response.json()) as Record<string, unknown>;
  const session = sessionFrom(body);
  if (session) {
    setSession(session);
    return { session, needsConfirm: false };
  }
  // project requires email confirmation: no token yet
  return { session: null, needsConfirm: true };
}

export async function signIn(email: string, password: string): Promise<{ session: Session } | { error: string }> {
  if (!authConfigured()) return { error: "auth_not_configured" };
  const response = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return { error: await parseError(response) };
  const session = sessionFrom((await response.json()) as Record<string, unknown>);
  if (!session) return { error: "invalid_response" };
  setSession(session);
  return { session };
}

export async function signOut(): Promise<void> {
  const session = getSession();
  setSession(null);
  if (!authConfigured() || !session) return;
  await fetch(`${URL_BASE}/auth/v1/logout`, {
    method: "POST",
    headers: headers({ Authorization: `Bearer ${session.access_token}` }),
  }).catch(() => undefined);
}

export async function sendReset(email: string): Promise<boolean> {
  if (!authConfigured()) return false;
  const response = await fetch(`${URL_BASE}/auth/v1/recover`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
  });
  return response.ok;
}

/** keeps the session alive across visits */
export async function freshSession(): Promise<Session | null> {
  const session = getSession();
  if (!session) return null;
  if (session.expires_at * 1000 > Date.now() + 60_000) return session;
  if (!authConfigured() || !session.refresh_token) {
    setSession(null);
    return null;
  }
  const response = await fetch(`${URL_BASE}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) {
    setSession(null);
    return null;
  }
  const next = sessionFrom((await response.json()) as Record<string, unknown>);
  setSession(next);
  return next;
}

/* ── progress rows ──────────────────────────────────────────────────────── */

export type RemoteProgress = { data: Record<string, unknown>; updated_at: string };

export async function fetchProgress(session: Session): Promise<RemoteProgress | null> {
  const response = await fetch(
    `${URL_BASE}/rest/v1/progress?user_id=eq.${session.user_id}&select=data,updated_at`,
    { headers: headers({ Authorization: `Bearer ${session.access_token}` }) },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as RemoteProgress[];
  return rows[0] ?? null;
}

export async function pushProgress(session: Session, data: Record<string, unknown>): Promise<boolean> {
  const response = await fetch(`${URL_BASE}/rest/v1/progress`, {
    method: "POST",
    headers: headers({
      Authorization: `Bearer ${session.access_token}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify([{ user_id: session.user_id, data, updated_at: new Date().toISOString() }]),
  });
  return response.ok;
}
