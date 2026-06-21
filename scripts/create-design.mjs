#!/usr/bin/env node
/* create-design — scaffold a new self-manifesting design.

   Usage:  npm run create-design -- <key> [route]
           (key = kebab-case, e.g. "lookbook"; route = storefront path, default "/")

   Generates src/designs/<key>/<key>.manifest.md + <key>.js with a starter section +
   animation, ready to register in src/studio/pages.js. See docs/DESIGN-BUILD-GUIDE.md. */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const [key, routeArg] = process.argv.slice(2)

if (!key || !/^[a-z0-9-]+$/.test(key)) {
  console.error('Usage: npm run create-design -- <key> [route]   (key = kebab-case)')
  process.exit(1)
}

const route = routeArg || '/'
const dir = join(root, 'src', 'designs', key)
const manifestPath = join(dir, `${key}.manifest.md`)
const modulePath = join(dir, `${key}.js`)

if (existsSync(manifestPath) || existsSync(modulePath)) {
  console.error(`Design "${key}" already exists at src/designs/${key}/ — aborting.`)
  process.exit(1)
}

const Title = key.replace(/(^|-)([a-z0-9])/g, (_, d, c) => (d ? ' ' : '') + c.toUpperCase()).trim()
const fence = '```'

const manifest = [
  `# ${Title} — manifest`,
  '',
  "Declare this design's editable surface here, then register it in src/studio/pages.js.",
  'See docs/DESIGN-BUILD-GUIDE.md for the full schema.',
  '',
  `${fence}yaml`,
  `design: ${key}`,
  `label: ${Title}`,
  `slug: ${key}`,
  `route: '${route}'`,
  '',
  'sections:',
  '  - id: main',
  '    component: ExampleSection',
  "    label: 'Example section'",
  '    # editorOverrides: { motionless: true }   # for scroll/hero sections',
  '    fields:',
  "      - { name: heading, type: text, label: 'Heading', default: 'Edit me' }",
  "      - { name: body, type: textarea, label: 'Body', default: '' }",
  "      - { name: image, type: media, label: 'Image' }",
  '    animations:',
  '      - name: intro',
  '        preset: fade-up',
  '        editorFallback: static',
  '        editorFallbackProp: animation',
  fence,
  '',
].join('\n')

const moduleJs = [
  `/* designs/${key} — design module: components + (optional) verbatim defaults.`,
  '   New designs can keep `defaults` empty and put content inline in the manifest. */',
  '',
  "// import ExampleSection from '../../sections/ExampleSection.jsx'",
  '',
  'export const components = {',
  '  // ExampleSection,',
  '}',
  '',
  'export const defaults = {',
  '  // ComponentName: { /* verbatim default props (for migrated designs) */ },',
  '}',
  '',
].join('\n')

mkdirSync(dir, { recursive: true })
writeFileSync(manifestPath, manifest)
writeFileSync(modulePath, moduleJs)

console.log(`Created src/designs/${key}/${key}.manifest.md`)
console.log(`Created src/designs/${key}/${key}.js`)
console.log('')
console.log('Next:')
console.log(`  1. Build the section component(s), prop-driven (default = current value).`)
console.log(`  2. Fill the manifest (fields + animations + editorFallback for scroll sections).`)
console.log(`  3. Register in src/studio/pages.js:`)
console.log(`       import md from '../designs/${key}/${key}.manifest.md?raw'`)
console.log(`       import * as mod from '../designs/${key}/${key}.js'`)
console.log(`       '${key}': compileManifest(md, mod),`)
console.log(`  4. Render via <PageView page={PAGES['${key}']} /> (or usePublishedProps).`)
