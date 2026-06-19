import { Link } from 'react-router-dom'

const values = [
  ['Plant-based', 'Botanical actives at the core of every formula — grape seed, Vitamin E, mugwort, rice ferment.'],
  ['Clinically gentle', 'Dermatologically tested and KKM-NPRA certified. Kind to reactive, sensitive skin.'],
  ['Barrier-first', 'We treat the moisture barrier as the foundation of healthy, dewy skin.'],
  ['Probiotic science', 'Ferments that work with the skin’s microbiome, not against it.'],
]

export default function About() {
  return (
    <>
      <header className="page-hero page-hero--tall">
        <div className="page-hero__wash" />
        <div className="container">
          <span className="eyebrow">Our story</span>
          <h1>
            Beauty, <em>raw</em> and engineered.
          </h1>
          <p className="lede">
            ANJOE began with a simple belief: skin thrives when its barrier is
            respected. We pair botanical, probiotic formulas with the rigour of a
            lab — clinically tested, gently made, deeply hydrating.
          </p>
        </div>
      </header>

      <section className="section container about__story">
        <div className="about__story-col reveal">
          <span className="eyebrow">The philosophy</span>
          <h2>Hydration is the whole game.</h2>
        </div>
        <div className="about__story-col reveal">
          <p>
            Every ANJOE product is built around one idea — flood the skin with
            moisture, then protect it. Our probiotic ferments and plant oils
            restore the barrier while antioxidants defend against the day.
          </p>
          <p>
            Formulated and certified in Malaysia under Medicircle Holding, our
            range is dermatologically tested and KKM-NPRA certified — luxury that
            earns its claims.
          </p>
        </div>
      </section>

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

      <section className="section container about__quote">
        <blockquote className="reveal">
          “Elevate your routine with rituals designed to enhance natural beauty
          and promote a youthful, radiant complexion.”
        </blockquote>
      </section>

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
