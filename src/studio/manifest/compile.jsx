import { imageField, rangeField, easeField } from '../fields.jsx'
import { parseManifest } from './parse.js'
import { PRESETS } from '../../motion/presets/index.js'

/* compile.jsx — the manifest → editor compiler.

   Given a parsed manifest (the design's self-description) and a design module
   ({ components, defaults }), produce the exact same shape the hand-written Puck
   configs produced: a PAGES entry with { key, label, slug, path, config, sections,
   defaultLayout }. This is what makes "drop the manifest in → the editor orients
   itself" work, with no per-design Puck wiring.

   Design rule preserved: prop-drive everything with current values as defaults, so
   nothing changes until edited. Defaults come from the design module (verbatim, for
   migrated designs) merged over any inline manifest defaults (for new designs). */

const ON_OFF = [{ label: 'On', value: 'on' }, { label: 'Off', value: 'off' }]

// Interpolate an itemLabel template: {field} → item[field], {#} → 1-based index.
function interp(tmpl, item, i) {
  return String(tmpl).replace(/\{(#|\w+)\}/g, (_, k) => (k === '#' ? String(i + 1) : (item?.[k] ?? '')))
}

function normalizeOptions(options = []) {
  return options.map((o) => (typeof o === 'string' ? { label: o, value: o } : { label: o.label, value: o.value }))
}

/* One manifest field → one Puck field descriptor. Mirrors the helpers the
   hand-written configs used (text/textarea/number/radio-on-off/select/array/custom). */
function compileField(f) {
  const label = f.label
  switch (f.type) {
    case 'text':
    case 'product-ref':
    case 'route-ref':
    case 'color':
      return { type: 'text', label }
    case 'textarea':
    case 'richtext':
      return { type: 'textarea', label }
    case 'number':
      return { type: 'number', label }
    case 'range':
      return rangeField({ label, min: f.min ?? 0, max: f.max ?? 100, step: f.step ?? 1, unit: f.unit })
    case 'ease':
      return easeField(label)
    case 'toggle':
      return { type: 'radio', label, options: ON_OFF }
    case 'select':
      return { type: 'select', label, options: normalizeOptions(f.options) }
    case 'media':
      return imageField(label)
    case 'list': {
      const arrayFields = {}
      for (const sub of f.fields || []) arrayFields[sub.name] = compileField(sub)
      const tmpl = f.itemLabel
      const fallback = f.itemFallback || 'Item'
      return {
        type: 'array',
        label,
        arrayFields,
        getItemSummary: tmpl
          ? (item, i) => interp(tmpl, item, i) || fallback
          : (_item, i) => `${fallback} ${i + 1}`,
      }
    }
    default:
      return { type: 'text', label }
  }
}

// One animation knob → one editor control (the "bar").
function compileKnob(name, knob) {
  const label = knob.label || name
  if (knob.range) {
    const [min, max] = knob.range
    return rangeField({ label, min, max, step: knob.step ?? 1, unit: knob.unit })
  }
  if (knob.ease) return easeField(label)
  if (knob.toggle) return { type: 'radio', label, options: ON_OFF }
  if (knob.options) return { type: 'select', label, options: normalizeOptions(knob.options) }
  return { type: 'number', label }
}

/* An `animations` entry → an object field grouping its knobs, plus the default
   knob values. A preset supplies default knobs; the manifest may override them. */
function compileAnimation(anim) {
  const preset = PRESETS[anim.preset] || {}
  const knobs = { ...(preset.knobs || {}), ...(anim.knobs || {}) }
  const objectFields = {}
  const defaults = {}
  for (const [k, knob] of Object.entries(knobs)) {
    objectFields[k] = compileKnob(k, knob)
    if (knob.default !== undefined) defaults[k] = knob.default
  }
  return {
    field: { type: 'object', label: anim.label || anim.name, objectFields },
    defaultValue: defaults,
  }
}

/* When editing, Puck never fires page-intro/scroll animations, so motion sections
   render blank. editorOverrides + an animation's editorFallback both resolve to
   "inject these props while puck.isEditing" so the section shows its static layout. */
function resolveEditorOverrides(section) {
  const ov = { ...(section.editorOverrides || {}) }
  for (const anim of section.animations || []) {
    if (anim.editorFallback && anim.editorFallback !== 'none' && anim.editorFallbackProp) {
      ov[anim.editorFallbackProp] = anim.editorFallback === 'static' ? 'off' : anim.editorFallback
    }
  }
  return ov
}

function makeRender(Comp, editorOverrides) {
  if (editorOverrides && Object.keys(editorOverrides).length) {
    return ({ puck, ...props }) => <Comp {...props} {...(puck?.isEditing ? editorOverrides : {})} />
  }
  return (props) => <Comp {...props} />
}

function compileSection(s, mod) {
  const Comp = mod.components?.[s.component]
  if (!Comp) throw new Error(`manifest: no component "${s.component}" in the design registry`)

  const fields = {}
  const inlineDefaults = {}
  for (const f of s.fields || []) {
    fields[f.name] = compileField(f)
    if (f.default !== undefined) inlineDefaults[f.name] = f.default
  }
  for (const anim of s.animations || []) {
    const { field, defaultValue } = compileAnimation(anim)
    fields[anim.name] = field
    inlineDefaults[anim.name] = defaultValue
  }

  // Design-module defaults win (verbatim, for migrated designs); inline manifest
  // defaults seed new designs that carry their own content.
  const defaultProps = { ...inlineDefaults, ...(mod.defaults?.[s.component] || {}) }

  return {
    label: s.label || s.component,
    fields,
    defaultProps,
    render: makeRender(Comp, resolveEditorOverrides(s)),
  }
}

/* Compile a parsed manifest + design module into a PAGES registry entry. */
export function compileDesign(manifest, mod) {
  const components = {}
  const configComponents = {}
  for (const s of manifest.sections) {
    configComponents[s.component] = compileSection(s, mod)
    components[s.component] = mod.components[s.component]
  }

  const defaultLayout = {
    root: { props: {} },
    content: manifest.sections.map((s) => ({ type: s.component, props: { id: s.id } })),
  }

  return {
    key: manifest.design,
    label: manifest.label || manifest.design,
    slug: manifest.slug || manifest.design,
    path: manifest.route || '/',
    config: { components: configComponents },
    sections: components,
    defaultLayout,
  }
}

/* Convenience: raw manifest .md text + design module → PAGES entry. */
export function compileManifest(mdText, mod) {
  return compileDesign(parseManifest(mdText, mod?.label), mod)
}
