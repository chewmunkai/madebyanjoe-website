import { load } from 'js-yaml'

/* parse.js — turn a design manifest (.md) into a plain manifest object.

   A manifest is human-readable markdown wrapping exactly ONE fenced YAML block
   (```yaml … ```). That block is the machine-readable source of truth — the prose
   around it is for humans. We extract the block and parse it with js-yaml.

   Throws a readable Error if the block is missing or invalid, so a bad manifest
   fails loudly at build/boot rather than silently producing an empty editor. */
export function parseManifest(mdText, label = 'manifest') {
  const m = /```ya?ml\s*\n([\s\S]*?)```/.exec(String(mdText || ''))
  if (!m) throw new Error(`${label}: no \`\`\`yaml block found in the manifest`)
  let data
  try {
    data = load(m[1])
  } catch (e) {
    throw new Error(`${label}: YAML parse error — ${e.message}`)
  }
  if (!data || typeof data !== 'object') throw new Error(`${label}: manifest is empty`)
  if (!Array.isArray(data.sections)) throw new Error(`${label}: manifest needs a sections[] list`)
  return data
}
