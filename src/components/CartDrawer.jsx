import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart, selectSubtotal, selectCount } from '../store/cart.js'
import { formatPrice } from '../data/products.js'
import { startCheckout, CheckoutNotConfiguredError } from '../lib/checkout.js'

export default function CartDrawer() {
  const items = useCart((s) => s.items)
  const isOpen = useCart((s) => s.isOpen)
  const close = useCart((s) => s.close)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const subtotal = useCart(selectSubtotal)
  const count = useCart(selectCount)

  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const checkout = async () => {
    setMsg(null)
    setBusy(true)
    try {
      await startCheckout(items)
    } catch (e) {
      if (e instanceof CheckoutNotConfiguredError) {
        setMsg("Checkout isn't live yet — payments are being set up. Your bag is saved.")
      } else {
        setMsg(e.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div
        className={`drawer-scrim ${isOpen ? 'is-open' : ''}`}
        onClick={close}
        aria-hidden={!isOpen}
      />
      <aside
        className={`drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
      >
        <header className="drawer__head">
          <span className="eyebrow">Your bag ({count})</span>
          <button className="drawer__close" onClick={close} aria-label="Close bag">
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bag is empty.</p>
            <Link to="/shop" className="btn btn--ghost" onClick={close}>
              Shop the ritual
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__items">
              {items.map((i) => (
                <li key={i.id} className="ditem">
                  <img src={i.img} alt={i.name} />
                  <div className="ditem__info">
                    <div className="ditem__name">{i.name}</div>
                    <div className="ditem__price">{formatPrice(i.price)}</div>
                    <div className="qty">
                      <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span>{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase quantity">
                        +
                      </button>
                      <button className="ditem__remove" onClick={() => remove(i.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="drawer__foot">
              <div className="drawer__subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {msg && <p className="drawer__msg">{msg}</p>}
              <button className="btn drawer__checkout" onClick={checkout} disabled={busy}>
                {busy ? 'One moment…' : 'Checkout'}
              </button>
              <p className="drawer__note">Shipping &amp; taxes calculated at checkout.</p>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
