/* builderApi.js — the storefront's bridge to the Medusa page_builder module.

   Two audiences:
   - PUBLIC: getPublishedLayout(slug) reads the live layout for a page (no auth).
   - ADMIN (/studio only): email/password login → bearer token → save draft / publish.

   The admin token is a Medusa user JWT held in localStorage; it only ever leaves the
   browser as an Authorization header to the Medusa backend. (For the productized,
   multi-tenant version we'd move this to an httpOnly-cookie session on a dedicated
   builder origin — acceptable for single-store Anjoe today.) */

import { MEDUSA_URL, get } from './medusa.js'

const TOKEN_KEY = 'anjoe-admin-token'

/* ── Public read ─────────────────────────────────────────────── */

// The published Puck layout for a slug, or null if nothing is published yet.
// Never throws — a builder hiccup must not break the storefront (caller falls back).
export async function getPublishedLayout(slug) {
  try {
    const data = await get(`/store/page-layouts/${encodeURIComponent(slug)}`)
    return data?.layout ?? null
  } catch {
    return null
  }
}

/* ── Admin auth ──────────────────────────────────────────────── */

export function getAdminToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null } catch { return null }
}
function setAdminToken(t) { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* ignore */ } }
export function clearAdminToken() { try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ } }

// Exchange admin email/password for a bearer token. Throws a readable Error on failure.
export async function adminLogin(email, password) {
  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || 'Login failed — check your email and password.')
  }
  setAdminToken(data.token)
  return data.token
}

/* ── Admin layout calls (require a token) ────────────────────── */

async function adminFetch(path, { method = 'GET', body } = {}) {
  const token = getAdminToken()
  if (!token) { const e = new Error('Not signed in'); e.status = 401; throw e }
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body != null ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    clearAdminToken()
    const e = new Error('Session expired — please sign in again.'); e.status = 401; throw e
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || data?.message || `Request failed (${res.status})`)
  return data
}

// Load the draft to edit (server falls back to published / null).
export function getDraft(slug) {
  return adminFetch(`/admin/page-layouts/${encodeURIComponent(slug)}`)
}
// Save the working draft (private — does not go live).
export function saveDraft(slug, layout) {
  return adminFetch(`/admin/page-layouts/${encodeURIComponent(slug)}`, { method: 'PUT', body: { layout } })
}
// Publish: make the layout live for shoppers.
export function publishLayout(slug, layout) {
  return adminFetch(`/admin/page-layouts/${encodeURIComponent(slug)}/publish`, { method: 'POST', body: { layout } })
}
