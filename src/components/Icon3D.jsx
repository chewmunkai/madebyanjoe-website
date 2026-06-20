/* Brand-matched 3D "clay" iconography. Each icon is built from a 2-stop tonal
   gradient (light → deep) for volume, a soft radial gloss highlight, and minimal
   detail — all in the ANJOE palette (blush / sage / cream / ink) so the step
   explainers read dimensional without the off-brand glossy-emoji look. */

const BLUSH = ['#f4e2e7', '#c98b97']
const BLUSH_DEEP = ['#eccfd6', '#b3717e']
const SAGE = ['#e4ebdc', '#84977a']
const SAGE_DEEP = ['#cfdac3', '#6f8366']
const CREAM = ['#fdfaf4', '#e3d8c4']

function Lin(id, [a, b], x1 = 16, y1 = 10, x2 = 46, y2 = 56) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  )
}
function Gloss(id, cx, cy, r) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
  )
}

const ICONS = {
  droplet: (
    <>
      <defs>
        {Lin('i-drop', BLUSH, 18, 8, 46, 56)}
        {Gloss('i-dropH', 25, 32, 13)}
      </defs>
      <path d="M32 7C42 22 49 33 49 41a17 17 0 0 1-34 0C15 33 22 22 32 7Z" fill="url(#i-drop)" />
      <ellipse cx="25" cy="34" rx="6" ry="10" fill="url(#i-dropH)" />
    </>
  ),
  herb: (
    <>
      <defs>
        {Lin('i-herb', SAGE, 12, 10, 52, 52)}
        {Gloss('i-herbH', 26, 22, 14)}
      </defs>
      <path d="M12 52C12 28 30 10 54 10 54 34 36 52 12 52Z" fill="url(#i-herb)" />
      <path d="M19 47C30 33 41 24 49 18" stroke="#5f7059" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7" />
      <ellipse cx="28" cy="24" rx="9" ry="6" fill="url(#i-herbH)" transform="rotate(-38 28 24)" />
    </>
  ),
  shield: (
    <>
      <defs>
        {Lin('i-sh', BLUSH_DEEP, 12, 8, 52, 56)}
        {Gloss('i-shH', 24, 22, 14)}
      </defs>
      <path d="M32 6 53 15v16c0 13-9 22-21 27-12-5-21-14-21-27V15Z" fill="url(#i-sh)" />
      <path d="M32 22c4 6 7 9 7 12a7 7 0 0 1-14 0c0-3 3-6 7-12Z" fill="#fdfaf4" opacity="0.92" />
      <ellipse cx="24" cy="20" rx="8" ry="11" fill="url(#i-shH)" transform="rotate(-18 24 20)" />
    </>
  ),
  seedling: (
    <>
      <defs>
        {Lin('i-seedM', BLUSH_DEEP, 16, 44, 48, 56)}
        {Lin('i-seedL', SAGE_DEEP, 16, 14, 48, 38)}
        {Gloss('i-seedH', 26, 22, 12)}
      </defs>
      <ellipse cx="32" cy="50" rx="18" ry="7.5" fill="url(#i-seedM)" />
      <path d="M32 51V26" stroke="#6f8366" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 37C24 37 17.5 31 17.5 23 26 23 32 29 32 37Z" fill="url(#i-seedL)" />
      <path d="M32 31C40 31 47.5 25 47.5 17 39 17 32 23 32 31Z" fill="url(#i-seedL)" />
      <ellipse cx="25" cy="29" rx="5" ry="7" fill="url(#i-seedH)" transform="rotate(-40 25 29)" />
    </>
  ),
  'test-tube': (
    <>
      <defs>
        {Lin('i-glass', CREAM, 18, 12, 46, 52)}
        {Lin('i-liq', BLUSH, 20, 30, 44, 52)}
        {Gloss('i-tubeH', 26, 24, 16)}
      </defs>
      <rect x="18" y="10" width="28" height="5" rx="2.5" fill="#e3d8c4" />
      <path d="M21 15h22v25a11 11 0 0 1-22 0Z" fill="url(#i-glass)" stroke="#d8cdb8" strokeWidth="1" />
      <path d="M21 31h22v9a11 11 0 0 1-22 0Z" fill="url(#i-liq)" />
      <circle cx="29" cy="40" r="2.2" fill="#fff" opacity="0.55" />
      <circle cx="35" cy="45" r="1.6" fill="#fff" opacity="0.5" />
      <rect x="25" y="18" width="3.4" height="20" rx="1.7" fill="#fff" opacity="0.5" />
    </>
  ),
  microbe: (
    <>
      <defs>
        {Lin('i-cell', SAGE, 14, 12, 50, 52)}
        {Gloss('i-cellH', 25, 24, 14)}
      </defs>
      <path d="M32 12c7 0 9 4 14 6s4 9 1 14 0 11-5 14-11 0-16-1-12-4-13-10 3-10 4-16 8-7 15-7Z" fill="url(#i-cell)" />
      <circle cx="34" cy="34" r="5.5" fill="#fdfaf4" opacity="0.9" />
      <circle cx="24" cy="28" r="2.4" fill="#5f7059" opacity="0.55" />
      <circle cx="40" cy="24" r="2" fill="#5f7059" opacity="0.5" />
      <circle cx="27" cy="42" r="2" fill="#5f7059" opacity="0.5" />
      <ellipse cx="24" cy="25" rx="7" ry="9" fill="url(#i-cellH)" transform="rotate(-25 24 25)" />
    </>
  ),
  sparkles: (
    <>
      <defs>
        {Lin('i-spk', BLUSH, 12, 10, 52, 54)}
        {Gloss('i-spkH', 26, 26, 14)}
      </defs>
      <path d="M30 8c2 14 6 18 20 20-14 2-18 6-20 20-2-14-6-18-20-20 14-2 18-6 20-20Z" fill="url(#i-spk)" />
      <path d="M48 8c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7Z" fill="url(#i-spk)" />
      <ellipse cx="24" cy="24" rx="6" ry="8" fill="url(#i-spkH)" transform="rotate(-30 24 24)" />
    </>
  ),
}

export default function Icon3D({ name, className }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg className={className} viewBox="0 0 64 64" width="64" height="64" fill="none" aria-hidden="true" focusable="false">
      {icon}
    </svg>
  )
}
