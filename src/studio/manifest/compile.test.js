import { describe, it, expect } from 'vitest'
import { parseManifest } from './parse.js'
import { compileManifest } from './compile.jsx'

const Foo = () => null
const mod = { components: { Foo }, defaults: { Foo: { heading: 'Hi' } } }

// A tiny self-contained manifest exercising every field kind + editorOverrides.
const md = [
  '# test',
  '',
  '```yaml',
  'design: t',
  'label: Test',
  'slug: t',
  'route: /t',
  'sections:',
  '  - id: main',
  '    component: Foo',
  '    label: Main',
  '    editorOverrides: { motionless: true }',
  '    fields:',
  '      - { name: heading, type: text, label: Heading }',
  '      - { name: body, type: textarea, label: Body }',
  '      - { name: speed, type: range, label: Speed, min: 0, max: 2, step: 0.1, unit: s }',
  '      - { name: ease, type: ease, label: Ease }',
  '      - { name: pic, type: media, label: Pic }',
  '      - { name: on, type: toggle, label: On }',
  '      - name: items',
  '        type: list',
  '        label: Items',
  "        itemLabel: '{t}'",
  '        itemFallback: Item',
  '        fields:',
  '          - { name: t, type: text, label: T }',
  '```',
  '',
].join('\n')

describe('manifest compiler', () => {
  it('parses the yaml block', () => {
    const m = parseManifest(md)
    expect(m.design).toBe('t')
    expect(m.sections).toHaveLength(1)
  })

  it('throws on a manifest with no yaml block', () => {
    expect(() => parseManifest('# just prose')).toThrow()
  })

  it('maps each field type to the right Puck descriptor', () => {
    const f = compileManifest(md, mod).config.components.Foo.fields
    expect(f.heading.type).toBe('text')
    expect(f.body.type).toBe('textarea')
    expect(f.speed.type).toBe('custom') // rangeField (slider)
    expect(f.ease.type).toBe('select') // easeField
    expect(f.pic.type).toBe('custom') // imageField
    expect(f.on.type).toBe('radio') // on/off toggle
    expect(f.on.options).toEqual([{ label: 'On', value: 'on' }, { label: 'Off', value: 'off' }])
    expect(f.items.type).toBe('array')
    expect(f.items.arrayFields.t.type).toBe('text')
  })

  it('builds getItemSummary from itemLabel (+ fallback)', () => {
    const items = compileManifest(md, mod).config.components.Foo.fields.items
    expect(items.getItemSummary({ t: 'Hydration' }, 0)).toBe('Hydration')
    expect(items.getItemSummary({}, 2)).toBe('Item') // fallback when template resolves empty
  })

  it('merges defaults with the design module winning, and builds the layout + registry', () => {
    const p = compileManifest(md, mod)
    expect(p.slug).toBe('t')
    expect(p.path).toBe('/t')
    expect(p.config.components.Foo.defaultProps.heading).toBe('Hi') // module default wins
    expect(p.defaultLayout.content[0]).toEqual({ type: 'Foo', props: { id: 'main' } })
    expect(p.sections.Foo).toBe(Foo)
  })

  it('produces a render function (editorOverrides applied while editing)', () => {
    const render = compileManifest(md, mod).config.components.Foo.render
    expect(typeof render).toBe('function')
  })
})
