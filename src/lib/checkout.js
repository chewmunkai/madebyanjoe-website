/* Commerce adapter.
   Money paths are sacred: we NEVER fake a checkout. If no provider is
   configured via env, startCheckout throws CheckoutNotConfiguredError and the
   UI shows an honest "not live yet" state instead of pretending to charge.

   To go live, set VITE_COMMERCE_PROVIDER (snipcart | shopify | stripe) plus the
   provider's keys, then implement the matching start* function below. */

const PROVIDER = import.meta.env.VITE_COMMERCE_PROVIDER

export class CheckoutNotConfiguredError extends Error {
  constructor() {
    super('Checkout provider not configured')
    this.name = 'CheckoutNotConfiguredError'
  }
}

export function isCheckoutConfigured() {
  return Boolean(PROVIDER)
}

export async function startCheckout(items) {
  if (!items?.length) throw new Error('Cart is empty')
  if (!PROVIDER) throw new CheckoutNotConfiguredError()

  switch (PROVIDER) {
    case 'stripe':
      return startStripeCheckout(items)
    case 'shopify':
      return startShopifyCheckout(items)
    case 'snipcart':
      return startSnipcartCheckout(items)
    default:
      throw new Error(`Unknown VITE_COMMERCE_PROVIDER: ${PROVIDER}`)
  }
}

// --- Provider stubs (wired once real merchant credentials exist) ---
async function startStripeCheckout() {
  // Needs a serverless endpoint that creates a Checkout Session from line items.
  throw new Error('Stripe checkout not wired yet — provide VITE_STRIPE_* keys + session endpoint.')
}
async function startShopifyCheckout() {
  // Needs Storefront API token + cart create/checkoutUrl flow.
  throw new Error('Shopify checkout not wired yet — provide VITE_SHOPIFY_* config.')
}
async function startSnipcartCheckout() {
  // Drop-in: add the Snipcart snippet + public API key, then this opens the cart.
  throw new Error('Snipcart checkout not wired yet — add the Snipcart snippet + VITE_SNIPCART_KEY.')
}
