/* Reviews — the brand's real customer testimonials, shown as received: the
   screenshot itself is the review (no transcription). Served straight from the
   live store's CDN. */
const BASE = 'https://img.appolous.com/themes/_store/anjoe/testimonials/'
const ids = [8, 30, 65, 68, 85, 91, 93, 94, 95, 96, 103]

export default function Reviews() {
  return (
    <section className="rv">
      <div className="container rv__head">
        <span className="eyebrow">What you’re saying</span>
        <div className="rv__head-row">
          <h2 className="reveal">Real words, real skin.</h2>
          <span className="rv__sub">Unedited messages from the ANJOE community.</span>
        </div>
      </div>
      <div className="container rv__wall">
        {ids.map((n, i) => (
          <figure className="rv__shot reveal" key={n}>
            <img src={`${BASE}${n}.webp`} alt={`Customer testimonial ${i + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}
