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

/* Upload an image/video to Medusa's file store (admin-auth) and return its public
   URL. Used by the studio's image fields so the client uploads their own media.
   Multipart — let the browser set the Content-Type boundary (don't set it). */
export async function uploadMedia(file) {
  const token = getAdminToken()
  if (!token) { const e = new Error('Not signed in'); e.status = 401; throw e }
  const fd = new FormData()
  fd.append('files', file)
  const res = await fetch(`${MEDUSA_URL}/admin/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  if (res.status === 401) {
    clearAdminToken()
    const e = new Error('Session expired — please sign in again.'); e.status = 401; throw e
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || data?.error || `Upload failed (${res.status})`)
  const url = data?.files?.[0]?.url
  if (!url) throw new Error('Upload returned no URL')
  // The local file provider may return its own base host (e.g. localhost in prod);
  // pin the file to the storefront's configured Medusa origin so it resolves from
  // any browser. The file is served at the same /static path on that origin.
  try { return MEDUSA_URL + new URL(url).pathname } catch { return url }
}
