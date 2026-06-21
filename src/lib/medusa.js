/* medusa.js — tiny fetch client for the Medusa v2 Store API.
   No SDK, no new npm deps: just `fetch` plus the two things every Store API
   call needs — the base URL and the publishable key header (which scopes the
   response to our sales channel).

   Config comes from Vite env (set in .env / .env.local):
     VITE_MEDUSA_URL              — Store API base, e.g. https://store.example.com
     VITE_MEDUSA_PUBLISHABLE_KEY  — pk_... key for the storefront sales channel

   Both fall back to local-dev defaults so the app still boots without a .env. */

export const MEDUSA_URL = (
  import.meta.env.VITE_MEDUSA_URL || 'http://localhost:9000'
).replace(/\/+$/, '') // trim trailing slash so path joins stay clean

export const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || ''

/* True only when we actually have a backend + key wired. The catalog and
   checkout layers use this to decide whether to hit Medusa or fall back. */
export function isMedusaConfigured() {
  return Boolean(import.meta.env.VITE_MEDUSA_URL && PUBLISHABLE_KEY)
}

/* Build the headers every Store API request needs. The publishable key header
   (x-publishable-api-key) is REQUIRED on all calls — without it Medusa returns
   an empty/forbidden response. */
function baseHeaders(extra) {
  const h = { 'Content-Type': 'application/json', ...extra }
  if (PUBLISHABLE_KEY) h['x-publishable-api-key'] = PUBLISHABLE_KEY
  return h
}

/* Core request helper. Throws a readable Error on non-2xx so callers can
   surface honest failures instead of silently swallowing them. */
async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    method,
    headers: baseHeaders(headers),
    body: body != null ? JSON.stringify(body) : undefined,
  })

  // Try to parse JSON either way — error bodies usually carry a `message`.
  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === 'string' && data) ||
      `Medusa request failed: ${res.status} ${res.statusText}`
    const err = new Error(msg)
    err.status = res.status
    err.body = data
    throw err
  }

  return data
}

/* GET helper. `query` is an object → URL search params (skips null/undefined). */
export function get(path, query) {
  const qs = query
    ? '?' +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : ''
  return request(`${path}${qs}`)
}

/* POST helper. */
export function post(path, body) {
  return request(path, { method: 'POST', body })
}

/* DELETE helper (Medusa uses DELETE for removing line items). */
export function del(path) {
  return request(path, { method: 'DELETE' })
}
