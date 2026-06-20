import { Link } from 'react-router-dom'

const values = [
  ['Plant-based', 'Botanical actives at the core of every formula — grape seed, Vitamin E, mugwort, rice ferment.'],
  ['Clinically gentle', 'Dermatologically tested and KKM-NPRA certified. Kind to reactive, sensitive skin.'],
  ['Barrier-first', 'We treat the moisture barrier as the foundation of healthy, dewy skin.'],
  ['Probiotic science', 'Ferments that work with the skin’s microbiome, not against it.'],
]

const certs = ['KKM-NPRA Certified', 'Dermatologically Tested', '100% Plant-Based', 'Est. 2020 · Kuala Lumpur']

export default function About() {
  return (
    <>
      <header className="page-hero page-hero--tall">
        <div className="page-hero__wash" />
        <div className="container">
          <span className="eyebrow">Our story</span>
          <h1>
            Beauty, <em>raw</em> — and engineered.
          </h1>
          <p className="lede">
            ANJOE began with a simple belief: skin thrives when its barrier is
            respected. We pair botanical, probiotic formulas with the rigour of a
            pharmacist’s lab — clinically tested, gently made, deeply hydrating.
          </p>
        </div>
      </header>

      {/* FOUNDER */}
      <section className="section container about__founder">
        <div className="about__founder-head reveal">
          <span className="eyebrow">The founder</span>
          <h2>
            Created by <em>Anjoe Koh</em>.
          </h2>
        </div>
        <div className="about__founder-body">
          <p className="lede reveal">
            A UK-trained, dual-licensed pharmacist — and a former beauty queen —
            Anjoe spent a decade practising manual lymphatic massage before
            formulating the range she couldn’t find on the shelf.
          </p>
          <p className="reveal">
            That pharmacist’s discipline runs through everything: low-pH systems
            that cleanse without stripping, ferments chosen for the microbiome,
            barrier lipids measured to reseal. Raw Beauté is clinical care that
            still feels like a ritual.
          </p>
          <p className="reveal">
            Formulated and certified in Malaysia under Medicircle Holding, the
            range is dermatologically tested and KKM-NPRA certified — luxury that
            earns its claims.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="band">
        <div className="container about__values">
          {values.map(([t, d]) => (
            <div className="about__value reveal" key={t}>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="section container about__quote">
        <blockquote className="reveal">
          “Skincare with the discipline of a lab and the gentleness of something grown.”
        </blockquote>
      </section>

      {/* CERTIFICATIONS */}
      <div className="container about__certs reveal">
        {certs.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>

      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>Find your ritual.</h2>
          <p className="lede">Start with the cleanser. Build from there.</p>
          <Link to="/shop" className="btn btn--light">
            Shop the collection
          </Link>
        </div>
      </section>
    </>
  )
}
