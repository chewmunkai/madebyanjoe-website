import { useCatalog } from '../store/catalog.js'
import { formatPrice } from '../data/products.js'

/* Puck block library for the ANJOE storefront. Each block is a normal React
   component + a `fields` schema Puck turns into a visual editing form. The
   FeaturedProducts block reads the LIVE catalog (Medusa), so editing the store
   visually and editing products in the admin meet in the same place. */

const CREAM = '#F4EFE9'
const INK = '#16150F'
const TONES = {
  ink: { bg: INK, fg: CREAM },
  lime: { bg: '#C9F05B', fg: '#16150F' },
  cream: { bg: CREAM, fg: INK },
}

function Hero({ eyebrow, title, subtitle, ctaLabel, align }) {
  return (
    <section style={{ background: CREAM, color: INK, padding: '7rem 1.5rem', textAlign: align }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        {eyebrow && (
          <div style={{ textTransform: 'uppercase', letterSpacing: '.2em', fontSize: 12, opacity: 0.55, marginBottom: 18 }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2.4rem,6vw,4.6rem)', lineHeight: 1.02, margin: 0, fontWeight: 500 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'Manrope, system-ui, sans-serif', fontSize: '1.15rem', opacity: 0.7, maxWidth: 560, margin: align === 'center' ? '1.4rem auto 0' : '1.4rem 0 0' }}>
            {subtitle}
          </p>
        )}
        {ctaLabel && (
          <a href="/shop" style={{ display: 'inline-block', marginTop: 30, background: INK, color: CREAM, padding: '14px 30px', borderRadius: 100, textDecoration: 'none', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}

function FeaturedProducts({ title, count }) {
  const products = useCatalog((s) => s.products)
  const list = products.slice(0, Math.max(1, Math.min(Number(count) || 4, 12)))
  return (
    <section style={{ background: '#fff', color: INK, padding: '5rem 1.5rem', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 500, marginBottom: 28 }}>{title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 24 }}>
          {list.map((p) => (
            <a key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none', color: INK }}>
              <div style={{ aspectRatio: '1', background: CREAM, borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
                {p.img && <img src={p.img} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>{formatPrice(p.price)}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function TextSection({ heading, body, align }) {
  return (
    <section style={{ background: CREAM, color: INK, padding: '5rem 1.5rem', textAlign: align, fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {heading && <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.9rem', fontWeight: 500, marginTop: 0 }}>{heading}</h2>}
        {body && <p style={{ fontSize: '1.1rem', opacity: 0.72, lineHeight: 1.6 }}>{body}</p>}
      </div>
    </section>
  )
}

function Banner({ text, tone }) {
  const t = TONES[tone] || TONES.ink
  return (
    <div style={{ background: t.bg, color: t.fg, padding: '1rem 1.5rem', textAlign: 'center', fontFamily: 'Manrope, sans-serif', fontSize: 14, letterSpacing: '.04em' }}>
      {text}
    </div>
  )
}

function Spacer({ size }) {
  const h = { s: 32, m: 64, l: 120 }[size] || 64
  return <div style={{ height: h }} />
}

export const config = {
  components: {
    Hero: {
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        ctaLabel: { type: 'text', label: 'Button label' },
        align: { type: 'select', label: 'Align', options: [{ label: 'Center', value: 'center' }, { label: 'Left', value: 'left' }] },
      },
      defaultProps: { eyebrow: 'Made by Anjoe', title: 'Hydration, engineered.', subtitle: 'Plant-based, probiotic skincare that floods the skin with moisture.', ctaLabel: 'Shop the ritual', align: 'center' },
      render: Hero,
    },
    FeaturedProducts: {
      fields: {
        title: { type: 'text', label: 'Section title' },
        count: { type: 'number', label: 'How many', min: 1, max: 12 },
      },
      defaultProps: { title: 'The bestsellers', count: 4 },
      render: FeaturedProducts,
    },
    TextSection: {
      fields: {
        heading: { type: 'text', label: 'Heading' },
        body: { type: 'textarea', label: 'Body' },
        align: { type: 'select', label: 'Align', options: [{ label: 'Center', value: 'center' }, { label: 'Left', value: 'left' }] },
      },
      defaultProps: { heading: 'Barrier-first, always', body: 'Every formula protects the moisture barrier — the difference between water sitting on skin and water staying in it.', align: 'center' },
      render: TextSection,
    },
    Banner: {
      fields: {
        text: { type: 'text', label: 'Text' },
        tone: { type: 'select', label: 'Tone', options: [{ label: 'Ink', value: 'ink' }, { label: 'Lime', value: 'lime' }, { label: 'Cream', value: 'cream' }] },
      },
      defaultProps: { text: 'Free shipping over RM150 · Plant-based · KKM-NPRA certified', tone: 'ink' },
      render: Banner,
    },
    Spacer: {
      fields: { size: { type: 'select', label: 'Size', options: [{ label: 'Small', value: 's' }, { label: 'Medium', value: 'm' }, { label: 'Large', value: 'l' }] } },
      defaultProps: { size: 'm' },
      render: Spacer,
    },
  },
}

/* Starter layout so the canvas opens with something real to edit. */
export const defaultData = {
  root: { props: {} },
  content: [
    { type: 'Banner', props: { id: 'banner-1', text: 'Free shipping over RM150 · Plant-based · KKM-NPRA certified', tone: 'ink' } },
    { type: 'Hero', props: { id: 'hero-1', eyebrow: 'Made by Anjoe', title: 'Hydration, engineered.', subtitle: 'Plant-based, probiotic skincare that floods the skin with moisture.', ctaLabel: 'Shop the ritual', align: 'center' } },
    { type: 'FeaturedProducts', props: { id: 'feat-1', title: 'The bestsellers', count: 4 } },
    { type: 'TextSection', props: { id: 'txt-1', heading: 'Barrier-first, always', body: 'Every formula protects the moisture barrier — the difference between water sitting on skin and water staying in it.', align: 'center' } },
  ],
}
