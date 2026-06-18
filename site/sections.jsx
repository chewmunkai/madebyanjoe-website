/* ANJOE — landing sections (React, composed from the DS bundle) */
const { Button, Badge, Rating, Tag, Accordion, IconButton, Input, ProductCard } = window.ANJOEDesignSystem_15a866;
const fmtRM = window.fmtRM || function (n) { return 'RM ' + Number(n).toFixed(2); };

const ANJOE = {
  products: [
    { id: 'serum', name: 'Skin Activating Antioxidant Serum', cat: 'Serum · 30ML',
      price: 258, compareAt: null, rating: 4.8, reviews: 126, badge: { tone: 'navy', label: 'Best Seller' },
      img: 'https://img.appolous.com/product/online/98/13039-skin-activating-antioxidant-serum.webp' },
    { id: 'essence', name: 'Skin Activating Essence Water', cat: 'Essence · 250ML',
      price: 198, compareAt: null, rating: 4.7, reviews: 88, badge: null,
      img: 'https://img.appolous.com/product/online/98/13040-skin-activating-essence-water-250ml.webp' },
    { id: 'mugwort', name: 'Mugwort Plant Treatment Oil', cat: 'Treatment Oil · 150ML',
      price: 189.9, compareAt: null, rating: 4.9, reviews: 204, badge: { tone: 'blue', label: 'KKM Certified' },
      img: 'https://img.appolous.com/product/online/98/14278-mugwort-plant-treatment-oil-150ml.webp' },
    { id: 'cream', name: 'Barrier Repair Cream', cat: 'Moisturiser · 40ML',
      price: 238, compareAt: null, rating: 4.7, reviews: 73, badge: { tone: 'blush', label: 'New' },
      img: 'https://img.appolous.com/product/online/98/14273-barrier-repair-cream-40ml.webp' },
    { id: 'glass', name: 'Confirm Glass Skin', cat: 'Finishing · 50ML',
      price: 100, compareAt: 123, rating: 4.6, reviews: 54, badge: null,
      img: 'https://img.appolous.com/product/online/98/14299-confirm-glass-skin.webp' },
    { id: 'sculptor', name: '3-in-1 Facial Sculptor', cat: 'The Whale · Gua Sha',
      price: 59.9, compareAt: null, rating: 4.9, reviews: 312, badge: { tone: 'blush', label: 'Iconic' },
      img: 'https://img.appolous.com/product/online/98/7224-facial-sculptor.webp' },
  ],
};

/* ---- scroll reveal (manual rAF tween — CSS animation/transition timelines are frozen in preview iframes, but rAF runs) ---- */
function useReveal(delay) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.style.opacity = '1'; el.style.transform = 'none'; return; }
    el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
    let started = false, raf = 0, t1 = 0;
    const tween = () => {
      const dur = 820; let start = null;
      const step = (ts) => {
        if (start == null) start = ts;
        let p = (ts - start - (delay || 0)) / dur;
        if (p < 0) { raf = requestAnimationFrame(step); return; }
        if (p > 1) p = 1;
        const e = 1 - Math.pow(1 - p, 3);
        el.style.opacity = String(e);
        el.style.transform = 'translateY(' + (16 * (1 - e)).toFixed(2) + 'px)';
        if (p < 1) raf = requestAnimationFrame(step);
        else el.style.transform = 'none';
      };
      raf = requestAnimationFrame(step);
    };
    const check = () => {
      if (started) return;
      const r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) * 0.92 && r.bottom > 0) { started = true; cleanup(); tween(); }
    };
    const onScroll = () => requestAnimationFrame(check);
    function cleanup() { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
    requestAnimationFrame(check);
    t1 = setTimeout(check, 180);
    return () => { cleanup(); clearTimeout(t1); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return ref;
}
function Reveal({ children, delay = 0, as = 'div', className = '', style = {}, ...rest }) {
  const ref = useReveal(delay);
  const Tag2 = as;
  return React.createElement(Tag2, { ref, className: 'reveal ' + className, style: { ...style }, ...rest }, children);
}
function Eyebrow({ children, dark }) {
  return <span style={{
    fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase',
    color: dark ? 'rgba(242,246,248,0.7)' : 'var(--ink-400)', display: 'inline-flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ width: 22, height: 1, background: 'currentColor', opacity: 0.6 }} />
    {children}
  </span>;
}

/* ========================= HEADER ========================= */
function SiteHeader({ cartCount, onCart }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', f, { passive: true }); f();
    return () => window.removeEventListener('scroll', f);
  }, []);
  const links = ['Shop', 'Serums', 'Oils', 'The Whale', 'Ritual'];
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 'var(--header-h)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 4vw, 48px)',
      background: scrolled ? 'rgba(251,250,248,0.86)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'background var(--dur-normal) var(--ease-standard), border-color var(--dur-normal)',
    }}>
      <nav style={{ display: 'flex', gap: 26, flex: 1 }}>
        {links.slice(0, 3).map((l) => <a key={l} href="#shop" className="navlink">{l}</a>)}
      </nav>
      <a href="#top" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-wordmark)', fontWeight: 600, fontSize: 22, letterSpacing: '0.30em', color: 'var(--ink-900)', paddingLeft: '0.30em' }}>ANJOE</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.42em', color: 'var(--ink-400)', paddingLeft: '0.42em' }}>RAW BEAUTÉ</span>
      </a>
      <nav style={{ display: 'flex', gap: 26, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        {links.slice(3).map((l) => <a key={l} href="#ritual" className="navlink">{l}</a>)}
        <IconButton ariaLabel="Search"><i data-lucide="search" style={{ width: 18, height: 18 }} /></IconButton>
        <button onClick={onCart} aria-label="Cart" style={{
          position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-900)', padding: 4,
        }}>
          <i data-lucide="shopping-bag" style={{ width: 19, height: 19 }} />
          {cartCount > 0 && <span style={{
            position: 'absolute', top: -4, right: -6, background: 'var(--anjoe-blush-300)', color: 'var(--ink-900)',
            fontFamily: 'var(--font-mono)', fontSize: 10, width: 16, height: 16, borderRadius: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cartCount}</span>}
        </button>
      </nav>
    </header>
  );
}

/* ========================= CINEMA INTRO (scroll-pinned ritual) ========================= */
const RITUAL_STEPS = [
  { n: '01', verb: 'Cleanse', id: 'essence', name: 'Skin Activating Essence Water', vol: '250ML',
    desc: 'A weightless essence floods thirsty skin with moisture and preps the barrier to receive everything that follows.', color: '#C9E7F2' },
  { n: '02', verb: 'Activate', id: 'serum', name: 'Skin Activating Antioxidant Serum', vol: '30ML',
    desc: 'Featherlight antioxidant defence — strengthens the barrier, locks in moisture and shields against environmental stress.', color: '#EFB8CB' },
  { n: '03', verb: 'Treat', id: 'mugwort', name: 'Mugwort Plant Treatment Oil', vol: '150ML',
    desc: '100% plant-based and dermatologically tested. Calms, nourishes and restores — gentle on sensitive, eczema-prone skin.', color: '#D8B27E' },
  { n: '04', verb: 'Seal', id: 'cream', name: 'Barrier Repair Cream', vol: '40ML',
    desc: 'A rich yet breathable cream that rebuilds the barrier overnight for soft, supple, resilient skin by morning.', color: '#F0E6D8' },
];
const HERO_COLOR = '#EFB8CB';
const _clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

function CinemaIntro({ onShop, onAdd }) {
  const wrapRef = React.useRef(null);
  const [prog, setProg] = React.useState(0);
  const [step, setStep] = React.useState(-1);

  React.useEffect(() => {
    let raf = 0, lastP = -1, lastStep = -2, alive = true;
    const heroEnd = 0.16, span = (1 - heroEnd) / RITUAL_STEPS.length;
    const tick = () => {
      if (!alive) return;
      const el = wrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = _clamp01(total > 0 ? -rect.top / total : 0);
        if (window.AnjoeHero) window.AnjoeHero.setScrollProgress(p);
        const s = p < heroEnd ? -1 : Math.min(RITUAL_STEPS.length - 1, Math.floor((p - heroEnd) / span));
        if (Math.abs(p - lastP) > 0.0015 || s !== lastStep) {
          lastP = p; lastStep = s;
          setProg(p); setStep(s);
          if (window.AnjoeHero) window.AnjoeHero.setStepColor(s >= 0 ? RITUAL_STEPS[s].color : HERO_COLOR);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; if (raf) cancelAnimationFrame(raf); };
  }, []);

  const heroEnd = 0.16, span = (1 - heroEnd) / RITUAL_STEPS.length;
  const heroOp = _clamp01(1 - (prog - 0.02) / (heroEnd - 0.04));

  return (
    <div ref={wrapRef} id="top" style={{ position: 'relative', height: 'calc(100vh + 360vh)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        <div className="hero-wash" />
        <canvas id="hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <div style={{ position: 'relative', height: '100%', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px)' }}>

            {/* HERO */}
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', maxWidth: 560, opacity: heroOp, pointerEvents: heroOp > 0.5 ? 'auto' : 'none', transition: 'opacity 120ms linear' }}>
              <Reveal><Eyebrow>Plant-based · Dermatologically tested</Eyebrow></Reveal>
              <Reveal delay={90} as="h1" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.01em', fontSize: 'clamp(48px, 7vw, 104px)', color: 'var(--ink-900)', margin: '22px 0 0' }}>
                Skincare gentle<br />enough to <em style={{ fontStyle: 'italic', color: 'var(--blush-500)' }}>trust</em>.
              </Reveal>
              <Reveal delay={170} as="p" style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.7, color: 'var(--ink-500)', maxWidth: 440, margin: '30px 0 0' }}>
                Handcrafted, allergy-safe formulas made with clean, plant-based ingredients — powerful enough to work, calm enough for the most sensitive skin.
              </Reveal>
              <Reveal delay={250} style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
                <Button variant="primary" size="lg" onClick={onShop}>Shop the ritual</Button>
                <Button variant="secondary" size="lg" iconRight={<i data-lucide="arrow-right" style={{ width: 16, height: 16 }} />}>Discover ANJOE</Button>
              </Reveal>
            </div>

            {/* RITUAL STEPS */}
            {RITUAL_STEPS.map((s, i) => {
              const center = heroEnd + (i + 0.5) * span;
              const d = (prog - center) / (span * 0.62);
              const op = _clamp01(1 - Math.abs(d));
              const ty = Math.max(-60, Math.min(60, d * -90));
              const product = ANJOE.products.find((x) => x.id === s.id);
              return (
                <div key={s.n} style={{ position: 'absolute', top: '50%', transform: `translateY(calc(-50% + ${ty}px))`, maxWidth: 560, opacity: op, pointerEvents: step === i ? 'auto' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--blush-500)' }}>{s.n} / 04</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>The Ritual</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(56px, 9vw, 128px)', lineHeight: 0.98, letterSpacing: '-0.02em', color: 'var(--ink-900)', margin: '8px 0 0' }}>{s.verb}</h2>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(20px,2.4vw,28px)', color: 'var(--ink-700)', margin: '14px 0 0' }}>{s.name}</h3>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(15px,1.3vw,18px)', lineHeight: 1.7, color: 'var(--ink-500)', maxWidth: 430, margin: '16px 0 0' }}>{s.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 30 }}>
                    <Button variant="primary" size="md" onClick={() => onAdd(product)}>Add · {fmtRM(product.price)}</Button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em', color: 'var(--ink-400)' }}>{s.vol} · pH 5.5</span>
                  </div>
                </div>
              );
            })}

            {/* STEP RAIL */}
            <div style={{ position: 'absolute', right: 'clamp(20px,4vw,48px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - heroOp, transition: 'opacity 160ms linear', pointerEvents: 'none' }}>
              {RITUAL_STEPS.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', color: step === i ? 'var(--ink-900)' : 'var(--ink-300)', transition: 'color 200ms' }}>{s.n}</span>
                  <span style={{ width: step === i ? 40 : 20, height: 1.5, background: step === i ? 'var(--blush-500)' : 'var(--ink-300)', transition: 'width 240ms var(--ease-out), background 200ms' }} />
                </div>
              ))}
            </div>

            {/* SCROLL CUE (hero) */}
            <div style={{ position: 'absolute', bottom: 28, left: 'clamp(20px,4vw,48px)', display: 'flex', gap: 28, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--ink-400)', textTransform: 'uppercase', opacity: heroOp, transition: 'opacity 120ms linear' }}>
              <span>001 — Serum</span><span>pH 5.5</span><span>100% Plant-based</span>
            </div>
            <div style={{ position: 'absolute', bottom: 28, right: 'clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', color: 'var(--ink-400)', opacity: heroOp, transition: 'opacity 120ms linear' }}>
              <span>SCROLL</span>
              <span className="scroll-line" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= MARQUEE ========================= */
function Marquee() {
  const items = ['Dermatologically tested', 'Plant-based extract', 'KKM Certified', 'Hypoallergenic', 'Cruelty-free', 'Barrier-strengthening', 'Handcrafted in Malaysia'];
  const row = [...items, ...items];
  return (
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--paper)', overflow: 'hidden', padding: '20px 0' }}>
      <div className="marquee">
        {row.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: 'var(--ink-700)', paddingRight: 28 }}>
            {t}<i data-lucide="leaf" style={{ width: 16, height: 16, color: 'var(--blush-500)' }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ========================= PRODUCT SHOWCASE ========================= */
function Showcase({ onAdd }) {
  return (
    <section id="shop" style={{ padding: 'clamp(72px,9vw,128px) clamp(20px,4vw,48px)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 56 }}>
        <div>
          <Reveal><Eyebrow>The Collection</Eyebrow></Reveal>
          <Reveal delay={80} as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.02, color: 'var(--ink-900)', margin: '16px 0 0', letterSpacing: '-0.01em' }}>
            A daily ritual, <em style={{ fontStyle: 'italic' }}>sculpted by hand</em>
          </Reveal>
        </div>
        <Reveal delay={140}><a href="#shop" className="textlink">View all products <i data-lucide="arrow-right" style={{ width: 15, height: 15 }} /></a></Reveal>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
        {ANJOE.products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 90}>
            <ProductCard
              image={p.img} name={p.name}
              price={fmtRM(p.price)} compareAt={p.compareAt ? fmtRM(p.compareAt) : null}
              badge={p.badge} rating={p.rating} reviewCount={p.reviews}
              onAdd={() => onAdd(p)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ========================= CREDENTIALS STRIP ========================= */
function Credentials() {
  const marks = ['KKM-NPRA Certified', 'Dermatologically Tested', '100% Plant-Based', 'Cruelty-Free', 'Made in Malaysia'];
  return (
    <section style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,48px)' }}>
        <Reveal as="p" style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-400)', margin: '0 0 22px' }}>
          Trusted &amp; certified
        </Reveal>
        <Reveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(20px,4vw,56px)' }}>
          {marks.map((m, i) => (
            <span key={m} style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(20px,4vw,56px)' }}>
              <span style={{ fontFamily: 'var(--font-wordmark)', fontWeight: 600, fontSize: 'clamp(14px,1.5vw,18px)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-700)' }}>{m}</span>
              {i < marks.length - 1 && <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--blush-300)' }} />}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ========================= PHILOSOPHY ========================= */
function Philosophy() {
  const pillars = [
    { i: 'shield-check', t: 'Strengthen', d: 'We build the barrier first — antioxidant-rich, plant-based formulas that defend against daily stress.' },
    { i: 'leaf', t: 'Recover', d: 'Clean, hypoallergenic actives calm and restore even the most sensitive, eczema-prone skin.' },
    { i: 'sparkles', t: 'Resilient', d: 'Skincare as a daily ritual — gentle, repeated care that leaves skin soft, supple and radiant.' },
  ];
  return (
    <section id="ritual" style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'clamp(72px,9vw,128px) clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 720, marginBottom: 'clamp(40px,5vw,72px)' }}>
          <Reveal><Eyebrow>Our Philosophy</Eyebrow></Reveal>
          <Reveal delay={80} as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(34px,4.8vw,62px)', lineHeight: 1.04, color: 'var(--ink-900)', margin: '16px 0 0', letterSpacing: '-0.01em' }}>
            Skincare as a daily act of <em style={{ fontStyle: 'italic' }}>care</em>
          </Reveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(24px,3vw,48px)' }}>
          {pillars.map((p, i) => (
            <Reveal key={p.t} delay={i * 90} style={{ borderTop: '1px solid var(--line)', paddingTop: 26 }}>
              <i data-lucide={p.i} style={{ width: 26, height: 26, color: 'var(--blush-500)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(26px,3vw,36px)', color: 'var(--ink-900)', margin: '18px 0 10px' }}>{p.t}</h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)', margin: 0 }}>{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= WHALE FEATURE ========================= */
function Whale({ onAdd }) {
  const benefits = [
    { i: 'sparkles', t: 'Natural facelift', d: 'Visibly firms, reduces puffiness and the look of fine lines.' },
    { i: 'shield-check', t: 'Crystal acrylic', d: 'Cool to the touch, hypoallergenic, never stains your skincare.' },
    { i: 'heart', t: 'Boosts circulation', d: 'Reaches every facial acupressure point to release tension.' },
  ];
  const sculptor = ANJOE.products.find((p) => p.id === 'sculptor');
  return (
    <section style={{ background: 'var(--anjoe-navy-deep)', color: 'var(--text-on-dark)', position: 'relative', overflow: 'hidden' }}>
      <div className="whale-glow" />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'clamp(72px,9vw,132px) clamp(20px,4vw,48px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div>
          <Reveal><Eyebrow dark>The Signature — Whale Gua Sha</Eyebrow></Reveal>
          <Reveal delay={80} as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(38px,5.4vw,72px)', lineHeight: 1.0, margin: '18px 0 20px', letterSpacing: '-0.01em' }}>
            The ANJOE whale,<br /><em style={{ fontStyle: 'italic', color: 'var(--anjoe-blue)' }}>in your hand</em>
          </Reveal>
          <Reveal delay={130} as="p" style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.7, color: 'rgba(242,246,248,0.75)', maxWidth: 460, margin: '0 0 38px' }}>
            Ergonomically sculpted to contour every edge of your face. A daily massage that lifts, de-puffs and turns your routine into a moment of care.
          </Reveal>
          <div style={{ display: 'grid', gap: 4, marginBottom: 38 }}>
            {benefits.map((b, i) => (
              <Reveal key={b.t} delay={i * 80} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, padding: '18px 0', borderTop: '1px solid rgba(242,246,248,0.14)', alignItems: 'start' }}>
                <i data-lucide={b.i} style={{ width: 22, height: 22, color: 'var(--anjoe-blue)' }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, margin: '0 0 3px' }}>{b.t}</h3>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.6, color: 'rgba(242,246,248,0.6)', margin: 0 }}>{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onAdd(sculptor)} style={{ background: 'var(--paper)', color: 'var(--ink-900)', borderColor: 'var(--paper)' }}>Add the whale · {fmtRM(sculptor.price)}</Button>
            <Rating value={sculptor.rating} count={sculptor.reviews} size={14} />
          </Reveal>
        </div>
        <Reveal delay={120} className="whale-media">
          <img src={sculptor.img} alt="3-in-1 Facial Sculptor whale gua sha"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </Reveal>
      </div>
    </section>
  );
}

/* ========================= TESTIMONIALS ========================= */
function Testimonials() {
  const quotes = [
    { q: 'My eczema-prone skin has never felt calmer. Three weeks in and the redness is gone.', n: 'Nurul A.', r: 5, p: 'Mugwort Treatment Oil' },
    { q: 'The serum is featherlight but my barrier feels genuinely stronger. A forever staple.', n: 'Wei Ling', r: 5, p: 'Antioxidant Serum' },
    { q: 'The gua sha ritual is the calmest part of my evening. Visibly de-puffed by morning.', n: 'Sofia R.', r: 5, p: '3-in-1 Facial Sculptor' },
  ];
  return (
    <section style={{ padding: 'clamp(72px,9vw,128px) clamp(20px,4vw,48px)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <Reveal><Eyebrow>Loved by sensitive skin</Eyebrow></Reveal>
        <Reveal delay={80} as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(34px,4.6vw,58px)', lineHeight: 1.04, color: 'var(--ink-900)', margin: '16px 0 0', letterSpacing: '-0.01em' }}>
          Trusted, gentle, <em style={{ fontStyle: 'italic' }}>proven</em>
        </Reveal>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
        {quotes.map((c, i) => (
          <Reveal key={c.n} delay={i * 90} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Rating value={c.r} size={15} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.4, color: 'var(--ink-900)', margin: 0 }}>“{c.q}”</p>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--ink-900)' }}>{c.n}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{c.p}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ========================= NEWSLETTER + FOOTER ========================= */
function Newsletter() {
  return (
    <section style={{ background: 'var(--blush-50)', borderTop: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(64px,8vw,112px) clamp(20px,4vw,48px)', textAlign: 'center' }}>
        <Reveal><Eyebrow>Join the ritual</Eyebrow></Reveal>
        <Reveal delay={80} as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(32px,4.4vw,54px)', lineHeight: 1.05, color: 'var(--ink-900)', margin: '16px 0 16px', letterSpacing: '-0.01em' }}>
          A little care, delivered
        </Reveal>
        <Reveal delay={120} as="p" style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)', margin: '0 auto 32px', maxWidth: 440 }}>
          Skincare notes, ritual guides and early access — RM 20 off your first order.
        </Reveal>
        <Reveal delay={160} style={{ display: 'flex', gap: 12, maxWidth: 460, margin: '0 auto', alignItems: 'flex-end', textAlign: 'left' }}>
          <div style={{ flex: 1 }}><Input label="Email" type="email" placeholder="you@email.com" /></div>
          <Button variant="primary" size="lg">Subscribe</Button>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols = {
    Shop: ['Serums', 'Oils & Essences', 'Moisturisers', 'Gua Sha Tools', 'Gift Sets'],
    Care: ['About Us', 'The Ritual', 'Ingredients', 'FAQ', 'Contact'],
    Legal: ['Shipping', 'Privacy Policy', 'Terms of Service', 'Careers'],
  };
  return (
    <footer style={{ background: 'var(--anjoe-navy-deep)', color: 'var(--text-on-dark)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(20px,4vw,48px) 40px', display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 'clamp(28px,4vw,56px)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-wordmark)', fontWeight: 600, fontSize: 24, letterSpacing: '0.30em', paddingLeft: '0.30em' }}>ANJOE</div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.7, color: 'rgba(242,246,248,0.6)', maxWidth: 280, marginTop: 16 }}>
            Raw Beauté — handcrafted, plant-based skincare and beauty tools. Gentle enough to trust, powerful enough to work.
          </p>
          <div style={{ display: 'flex', gap: 18, marginTop: 22 }}>
            {[['Instagram', 'IG'], ['Facebook', 'FB'], ['YouTube', 'YT']].map(([name, ab]) => (
              <a key={name} href="#top" aria-label={name} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', color: 'rgba(242,246,248,0.7)', textDecoration: 'none' }} className="footlink">{ab}</a>
            ))}
          </div>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,246,248,0.5)', marginBottom: 18 }}>{h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {items.map((l) => <a key={l} href="#shop" className="footlink">{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(242,246,248,0.12)', padding: '22px clamp(20px,4vw,48px)', maxWidth: 'var(--container-max)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(242,246,248,0.45)' }}>© 2026 MADEBYANJOE · MEDICIRCLE HOLDING</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(242,246,248,0.45)' }}>PRICES IN MALAYSIAN RINGGIT (RM)</span>
      </div>
    </footer>
  );
}

/* ========================= CART DRAWER ========================= */
function CartDrawer({ open, items, onClose, onQty, onRemove }) {
  const { QuantityStepper } = window.ANJOEDesignSystem_15a866;
  const lines = Object.entries(items).map(([id, qty]) => ({ p: ANJOE.products.find((x) => x.id === id), qty })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(30,41,53,0.4)', backdropFilter: 'blur(3px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--dur-normal)' }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 92vw)', zIndex: 91, background: 'var(--paper)', boxShadow: 'var(--shadow-lg)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform var(--dur-slow) var(--ease-out)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 24px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Your Cart</span>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-700)' }}><i data-lucide="x" style={{ width: 20, height: 20 }} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
          {lines.length === 0 && <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--ink-400)', textAlign: 'center', marginTop: 60 }}>Your cart is empty.</p>}
          {lines.map((l) => (
            <div key={l.p.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
              <img src={l.p.img} alt={l.p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-md)', background: 'var(--blue-50)' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink-900)' }}>{l.p.name}</div>
                <div style={{ marginTop: 8 }}><QuantityStepper value={l.qty} onChange={(n) => (n <= 0 ? onRemove(l.p.id) : onQty(l.p.id, n))} /></div>
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-900)' }}>{fmtRM(l.p.price * l.qty)}</span>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div style={{ padding: '20px 24px 26px', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontFamily: 'var(--font-ui)' }}>
              <span style={{ color: 'var(--ink-500)' }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{fmtRM(subtotal)}</span>
            </div>
            <Button variant="primary" size="lg" block>Checkout</Button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-400)', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>TAXES &amp; SHIPPING CALCULATED AT CHECKOUT</p>
          </div>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { ANJOE, Reveal, Eyebrow, SiteHeader, CinemaIntro, Marquee, Credentials, Philosophy, Showcase, Whale, Testimonials, Newsletter, SiteFooter, CartDrawer });
