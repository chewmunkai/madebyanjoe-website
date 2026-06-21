/* motion/presets — the catalog of named, parameterized animations a design can
   reference from its manifest. Each preset declares its KNOBS (and sane defaults);
   the manifest compiler turns every knob into an editor control (a "bar"). Section
   components read the knob props and drive their own GSAP/CSS from them.

   This is what makes "every animation becomes a customizable bar" deterministic: a
   design speaks in presets + knobs, and the editor generates the controls for free.
   `editorFallback` declares how the section should render inside the editor (where
   scroll/intro animations never fire) — `static` shows the reduced-motion layout. */

export const EASES = [
  'power2.out', 'power3.out', 'power4.out', 'expo.out',
  'back.out(1.4)', 'sine.inOut', 'circ.out', 'none',
]

export const PRESETS = {
  'fade-up': {
    label: 'Fade up',
    editorFallback: 'static',
    knobs: {
      enabled: { label: 'Enabled', toggle: true, default: true },
      duration: { label: 'Duration', range: [0, 2], step: 0.05, unit: 's', default: 0.8 },
      delay: { label: 'Delay', range: [0, 1], step: 0.05, unit: 's', default: 0 },
      distance: { label: 'Travel', range: [0, 200], step: 2, unit: 'px', default: 40 },
      ease: { label: 'Easing', ease: true, default: 'power3.out' },
    },
  },
  'stagger-in': {
    label: 'Stagger in',
    editorFallback: 'static',
    knobs: {
      enabled: { label: 'Enabled', toggle: true, default: true },
      duration: { label: 'Duration', range: [0, 2], step: 0.05, unit: 's', default: 0.9 },
      stagger: { label: 'Stagger', range: [0, 0.5], step: 0.01, unit: 's', default: 0.12 },
      distance: { label: 'Travel', range: [0, 200], step: 2, unit: 'px', default: 32 },
      ease: { label: 'Easing', ease: true, default: 'power3.out' },
    },
  },
  'scroll-chapter': {
    label: 'Scroll reveal (chapters)',
    editorFallback: 'static',
    knobs: {
      enabled: { label: 'Enabled', toggle: true, default: true },
      // trackVh can auto-scale to a list length via `auto: <listName>` in the manifest.
      trackVh: { label: 'Scroll length', range: [100, 800], step: 10, unit: 'vh', default: 440 },
    },
  },
  parallax: {
    label: 'Parallax',
    editorFallback: 'static',
    knobs: {
      enabled: { label: 'Enabled', toggle: true, default: true },
      strength: { label: 'Strength', range: [0, 1], step: 0.05, default: 0.3 },
    },
  },
  'reveal-on-view': {
    label: 'Reveal on view',
    editorFallback: 'static',
    knobs: {
      enabled: { label: 'Enabled', toggle: true, default: true },
      duration: { label: 'Duration', range: [0, 2], step: 0.05, unit: 's', default: 0.7 },
      threshold: { label: 'Trigger at', range: [0, 1], step: 0.05, default: 0.12 },
    },
  },
}

export function presetKeys() {
  return Object.keys(PRESETS)
}
