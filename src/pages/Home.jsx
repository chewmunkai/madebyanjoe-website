import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../store/cart.js'
import { getFeatured, getProduct, formatPrice } from '../data/products.js'

const flagship = getProduct('probiotic-amino-cleanser')
const marqueeWords = [
  'Probiotic',
  'Plant-based',
  'Barrier-first',
  'KKM-NPRA certified',
  'Deep hydration',
  'Dewy finish',
]
const ritual = [
  { n: '01', t: 'Cleanse', d: 'Low-pH amino wash lifts the day without stripping the barrier.' },
  { n: '02', t: 'Activate', d: 'Essence + antioxidant serum prime and defend.' },
  { n: '03', t: 'Hydrate', d: 'Probiotic moisture floods every layer.' },
  { n: '04', t: 'Seal', d: 'Barrier cream locks it in overnight.' },
]

export default function Home() {
  const featured = getFeatured().slice(0, 4)
  const add = useCart((s) => s.add)

  return (
    <>
      {/* HERO — placeholder. Wave 2 replaces this block with the WebGL
          water-drop scroll-scrub experience. */}
      <section className="home-hero" id="hero">
        <div className="home-hero__wash" />
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <span className="eyebrow">Raw Beauté · Made in Malaysia</span>
            <h1>
              Hydration,
              <br />
              <em>engineered.</em>
            </h1>
            <p className="lede">
              Plant-based, probiotic skincare that floods the skin with moisture
              and rebuilds the barrier — clinically gentle, visibly dewy.
            </p>
            <div className="home-hero__cta">
              <Link to="/shop" className="btn">
                Shop the ritual
              </Link>
              <Link to="/about" className="textlink">
                Our science →
              </Link>
            </div>
          </div>
          <div className="home-hero__product">
            <div className="home-hero__halo" />
            <img src={flagship.img} alt={flagship.name} />
          </div>
        </div>
        <div className="home-hero__scroll">
          <span className="home-hero__line" />
          Scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__track" aria-hidden="true">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      <section className="section container">
        <div className="sec-head">
          <span className="eyebrow reveal">The heroes</span>
          <div className="sec-head__row">
            <h2 className="reveal">Loved, repurchased, ritual.</h2>
            <Link to="/shop" className="textlink reveal">
              View all →
            </Link>
          </div>
        </div>
        <div className="grid grid--4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ETHOS BAND */}
      <section className="ethos cool">
        <div className="container ethos__inner">
          <h2 className="ethos__statement reveal">
            Skincare with the <em>discipline of a lab</em> and the gentleness of
            something grown.
          </h2>
          <div className="ethos__grid">
            {[
              ['100% plant-based', 'Formulas built on botanical actives — never harsh fillers.'],
              ['KKM-NPRA certified', 'Dermatologically tested and certified in Malaysia.'],
              ['Probiotic-led', 'Ferments that feed the skin’s own microbiome.'],
              ['Barrier-first', 'Every step protects the moisture barrier.'],
            ].map(([t, d]) => (
              <div className="ethos__cell reveal" key={t}>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT — flagship */}
      <section className="spotlight">
        <div className="container spotlight__inner">
          <div className="spotlight__media reveal">
            <div className="spotlight__wash" />
            <img src={flagship.img} alt={flagship.name} />
          </div>
          <div className="spotlight__copy reveal">
            <span className="eyebrow">{flagship.eyebrow}</span>
            <h2>{flagship.name}</h2>
            <p className="lede">{flagship.blurb}</p>
            <ul className="spotlight__notes">
              {flagship.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <div className="spotlight__cta">
              <button className="btn" onClick={() => add(flagship)}>
                Add to bag — {formatPrice(flagship.price)}
              </button>
              <Link to={`/product/${flagship.slug}`} className="textlink">
                Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RITUAL */}
      <section className="section container">
        <div className="sec-head sec-head--center">
          <span className="eyebrow reveal">The ANJOE ritual</span>
          <h2 className="reveal">Four steps to a dewy barrier.</h2>
        </div>
        <div className="ritual">
          {ritual.map((s) => (
            <div className="ritual__step reveal" key={s.n}>
              <span className="ritual__n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__inner reveal">
          <h2>Begin the ritual.</h2>
          <p className="lede">Hydration that holds — barrier that lasts.</p>
          <Link to="/shop" className="btn btn--light">
            Shop all products
          </Link>
        </div>
      </section>
    </>
  )
}
