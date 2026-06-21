import { useState } from 'react'

/* 10%-off capture band. Front-end stub — wire `onSubmit` to your ESP/Shopify when
   ready; nothing is sent yet. All copy is editable in /studio (defaults = current). */
export default function Newsletter({
  eyebrow = 'Join the ritual',
  headingA = '10% off your ',
  headingEm = 'first ritual',
  headingB = '.',
  lede = 'Hydration notes, restocks and members-only drops — straight to your inbox.',
  cta = 'Claim 10%',
  placeholder = 'Email address',
  successText = 'You’re in — check your inbox for the code. ✦',
} = {}) {
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
          <span className="eyebrow">{eyebrow}</span>
          <h2>
            {headingA}
            <em>{headingEm}</em>
            {headingB}
          </h2>
          <p className="lede">{lede}</p>
        </div>

        {done ? (
          <p className="news__thanks">{successText}</p>
        ) : (
          <form className="news__form" onSubmit={submit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-label="Email address"
            />
            <button className="btn btn--light" type="submit">
              {cta}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
