/* Credential strip — no fabricated magazine logos (the brand has no verifiable
   press features). Instead, the genuine credibility: a pharmacist founder and
   real certifications. All text is editable in /studio; defaults below = the
   current strip. */
const DEFAULT_CREDENTIALS = [
  'Pharmacist-founded',
  'KKM-NPRA Certified',
  'Dermatologically Tested',
  '100% Plant-Based',
  'Est. 2020 · Kuala Lumpur',
]

export default function PressBar({
  eyebrow = 'Created by Anjoe Koh — UK-trained pharmacist',
  credentials = DEFAULT_CREDENTIALS,
  reveal = 'on',
} = {}) {
  // Accept either ['text', …] (defaults) or [{label}, …] (from the editor's list field).
  const items = (Array.isArray(credentials) && credentials.length ? credentials : DEFAULT_CREDENTIALS)
    .map((c) => (typeof c === 'string' ? c : c?.label))
    .filter(Boolean)

  return (
    <section className={'pressbar' + (reveal !== 'off' ? ' reveal' : '')}>
      <div className="container pressbar__inner">
        <span className="pressbar__eyebrow">{eyebrow}</span>
        <ul className="pressbar__row">
          {items.map((c, i) => (
            <li key={c + i}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
