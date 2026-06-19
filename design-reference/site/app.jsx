/* ANJOE — app composition: cart, Tweaks, three.js hero wiring */
const { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakRadio } = window;

const WASHES = {
  Whale:    { env: ['#C9E7F2', '#FBFAF8', '#F7DCE4'], liquid: '#EFB8CB',
              css: 'radial-gradient(120% 90% at 70% 18%, #C9E7F2 0%, #F2F8FB 38%, #FBFAF8 62%, #F7DCE4 100%)' },
  Blush:    { env: ['#F7DCE4', '#FBFAF8', '#F9E6EC'], liquid: '#EFB8CB',
              css: 'radial-gradient(120% 90% at 68% 16%, #F7DCE4 0%, #FCF4F7 40%, #FBFAF8 66%, #F9E6EC 100%)' },
  Clinical: { env: ['#E2F0F6', '#FFFFFF', '#F4F1EC'], liquid: '#A6C7D8',
              css: 'radial-gradient(120% 90% at 72% 18%, #E2F0F6 0%, #FFFFFF 44%, #FBFAF8 70%, #F4F1EC 100%)' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "wash": "Whale",
  "object": "serum",
  "typeFeel": "Editorial"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cart, setCart] = React.useState({});
  const [cartOpen, setCartOpen] = React.useState(false);
  const heroInit = React.useRef(false);

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);
  const add = (p, qty = 1) => { setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + qty })); setCartOpen(true); };
  const setQty = (id, n) => setCart((c) => ({ ...c, [id]: n }));
  const remove = (id) => setCart((c) => { const x = { ...c }; delete x[id]; return x; });

  // init three.js hero once
  React.useEffect(() => {
    if (heroInit.current) return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.AnjoeHero || !window.THREE) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const w = WASHES[t.wash] || WASHES.Whale;
    window.AnjoeHero.init(canvas, { object: t.object, envColors: w.env, liquid: w.liquid, reduced });
    heroInit.current = true;
  }, []);

  // apply wash (CSS + three.js)
  React.useEffect(() => {
    const w = WASHES[t.wash] || WASHES.Whale;
    document.documentElement.style.setProperty('--hero-wash', w.css);
    if (heroInit.current && window.AnjoeHero) window.AnjoeHero.setWash(w.env, w.liquid);
  }, [t.wash]);

  // apply 3d object
  React.useEffect(() => {
    if (heroInit.current && window.AnjoeHero) window.AnjoeHero.setObject(t.object);
  }, [t.object]);

  // apply type feel
  React.useEffect(() => {
    document.body.dataset.type = (t.typeFeel || 'Editorial').toLowerCase();
  }, [t.typeFeel]);

  // refresh lucide icons after every render
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <React.Fragment>
      <SiteHeader cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <CinemaIntro onShop={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} onAdd={add} />
      <Marquee />
      <Credentials />
      <Showcase onAdd={add} />
      <Philosophy />
      <Whale onAdd={add} />
      <Testimonials />
      <Newsletter />
      <SiteFooter />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={setQty} onRemove={remove} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="3D Hero" />
        <TweakSelect label="Vessel" value={t.object}
          options={[
            { value: 'serum', label: 'Serum bottle' },
            { value: 'dropper', label: 'Dropper oil' },
            { value: 'jar', label: 'Cream jar' },
            { value: 'blob', label: 'Essence droplet' },
          ]}
          onChange={(v) => setTweak('object', v)} />
        <TweakSection label="Atmosphere" />
        <TweakRadio label="Colour wash" value={t.wash}
          options={['Whale', 'Blush', 'Clinical']}
          onChange={(v) => setTweak('wash', v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="Type feel" value={t.typeFeel}
          options={['Editorial', 'Classic', 'Modern']}
          onChange={(v) => setTweak('typeFeel', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
