import { useState } from 'react'

/* 10%-off capture band (Torriden's newsletter section). Front-end stub — wire
   `onSubmit` to your ESP/Shopify when ready; nothing is sent yet. */
export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
  }

  return (
    <section className="news">
      <div className="container news__inner">
        <div className="news__copy">
          <span className="eyebrow">Join the ritual</span>
          <h2>
            10% off your <em>first ritual</em>.
          </h2>
          <p className="lede">
            Hydration notes, restocks and members-only drops — straight to your inbox.
          </p>
        </div>

        {done ? (
          <p className="news__thanks">You’re in — check your inbox for the code. ✦</p>
        ) : (
          <form className="news__form" onSubmit={submit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
            />
            <button className="btn btn--light" type="submit">
              Claim 10%
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
