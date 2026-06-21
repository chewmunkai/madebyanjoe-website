/* customerApi.js — member accounts on Medusa v2's customer + auth modules (core).
   Register / login / logout / profile / order history. The customer's session JWT is
   held in localStorage and sent as a Bearer token (alongside the publishable key) on
   the /store/customers + /store/orders calls. Mirrors medusa.js conventions; never
   fakes auth — a real Medusa backend must be wired (VITE_MEDUSA_URL + key). */

import { MEDUSA_URL, PUBLISHABLE_KEY, isMedusaConfigured } from './medusa.js'

const TOKEN_KEY = 'anjoe-customer-token'

export function getCustomerToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null } catch { return null }
}
function setToken(t) { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* ignore */ } }
export function clearCustomerToken() { try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ } }
export function isLoggedIn() { return !!getCustomerToken() }

function headers(token) {
  const h = { 'Content-Type': 'application/json' }
  if (PUBLISHABLE_KEY) h['x-publishable-api-key'] = PUBLISHABLE_KEY
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function call(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    method,
    headers: headers(token),
    body: body != null ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = null
  if (text) { try { data = JSON.parse(text) } catch { data = text } }
  if (res.status === 401) {
    clearCustomerToken()
    const e = new Error('Please sign in again.'); e.status = 401; throw e
  }
  if (!res.ok) {
    const e = new Error((data && (data.message || data.error)) || `Request failed (${res.status})`)
    e.status = res.status; throw e
  }
  return data
}

/* The emailpass auth provider returns a JWT. `register` mints an identity token;
   `login` (no action) returns the session token. */
async function authEmailpass(action, email, password) {
  const path = action === 'register' ? '/auth/customer/emailpass/register' : '/auth/customer/emailpass'
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    method: 'POST', headers: headers(null), body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.token) throw new Error(data?.message || 'Authentication failed — check your details.')
  return data.token
}

/* Register = create the auth identity → create the customer profile with that token →
   log in for a session token. (The Medusa v2 emailpass registration flow.) */
export async function register({ email, password, first_name = '', last_name = '' }) {
  if (!isMedusaConfigured()) throw new Error('Accounts are not available yet.')
  const regToken = await authEmailpass('register', email, password)
  await call('/store/customers', { method: 'POST', token: regToken, body: { email, first_name, last_name } })
  const token = await authEmailpass('', email, password)
  setToken(token)
  return getCustomer()
}

export async function login(email, password) {
  if (!isMedusaConfigured()) throw new Error('Accounts are not available yet.')
  const token = await authEmailpass('', email, password)
  setToken(token)
  return getCustomer()
}

export function logout() { clearCustomerToken() }

/* The logged-in customer, or null if not signed in / token expired. */
export async function getCustomer() {
  const token = getCustomerToken()
  if (!token) return null
  try {
    const d = await call('/store/customers/me', { token })
    return d?.customer || null
  } catch (e) {
    if (e.status === 401) return null
    throw e
  }
}

/* The customer's recent orders (for the account order-history view). */
export async function getOrders() {
  const token = getCustomerToken()
  if (!token) return []
  const d = await call('/store/orders?limit=20&order=-created_at', { token })
  return d?.orders || []
}

/* The customer's loyalty points: { balance, lifetime_earned, config, transactions }.
   Returns null if not signed in / the loyalty module isn't live yet. */
export async function getPoints() {
  const token = getCustomerToken()
  if (!token) return null
  try {
    return await call('/store/loyalty/me', { token })
  } catch {
    return null
  }
}
