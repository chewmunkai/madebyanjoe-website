/* Credential strip — no fabricated magazine logos (the brand has no verifiable
   press features). Instead, the genuine credibility: a pharmacist founder and
   real certifications, all sourced from madebyanjoe.com / public records. */
const credentials = [
  'Pharmacist-founded',
  'KKM-NPRA Certified',
  'Dermatologically Tested',
  '100% Plant-Based',
  'Est. 2020 · Kuala Lumpur',
]

export default function PressBar() {
  return (
    <section className="pressbar reveal">
      <div className="container pressbar__inner">
        <span className="pressbar__eyebrow">
          Created by Anjoe Koh — UK-trained pharmacist
        </span>
        <ul className="pressbar__row">
          {credentials.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
