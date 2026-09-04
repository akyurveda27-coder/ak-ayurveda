// Client-side helper: all admin writes go through the server-side, cookie-protected
// /api/admin/db route (service role) — the browser never writes to Supabase directly.

type AdminResult<T = unknown> = { data: T | null; error: { message: string } | null }

async function call<T = unknown>(payload: Record<string, unknown>): Promise<AdminResult<T>> {
  try {
    const res = await fetch('/api/admin/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))

    if (res.status === 401) {
      // Session expired — send the admin back to the login screen.
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ak_admin_auth')
        window.location.reload()
      }
      return { data: null, error: { message: 'Session expired — please log in again.' } }
    }

    if (!res.ok) return fail(json.error ?? 'Request failed')
    return { data: (json.data ?? null) as T, error: null }
  } catch {
    return fail('Network error — please try again.')
  }
}

// Surface every failed write, wherever it was triggered from: a save that
// silently fails looks identical to one that worked.
function fail<T>(message: string): AdminResult<T> {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ak-admin-error', { detail: message }))
  }
  return { data: null, error: { message } }
}

type Values = Record<string, unknown> | Record<string, unknown>[]
type Options = { returning?: 'single'; onConflict?: string }

export const adminDb = {
  select: <T = unknown>(
    table: string,
    options: { select?: string; order?: { column: string; ascending?: boolean } } = {}
  ) => call<T[]>({ table, action: 'select', ...options }),

  insert: <T = unknown>(table: string, values: Values, options: Options = {}) =>
    call<T>({ table, action: 'insert', values, ...options }),

  upsert: <T = unknown>(table: string, values: Values, options: Options = {}) =>
    call<T>({ table, action: 'upsert', values, ...options }),

  update: <T = unknown>(table: string, values: Record<string, unknown>, match: Record<string, unknown>) =>
    call<T>({ table, action: 'update', values, match }),

  remove: <T = unknown>(table: string, match: Record<string, unknown>) =>
    call<T>({ table, action: 'delete', match }),
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) return { ok: true }
    const json = await res.json().catch(() => ({}))
    return { ok: false, error: json.error ?? 'Login failed' }
  } catch {
    return { ok: false, error: 'Network error — please try again.' }
  }
}

export async function adminCheckSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/login', { cache: 'no-store' })
    if (!res.ok) return false
    return Boolean((await res.json())?.authenticated)
  } catch {
    return false
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', { method: 'POST' })
  } catch {
    // ignore — cookie clears on expiry anyway
  }
}
