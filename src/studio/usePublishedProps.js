import { useEffect, useState } from 'react'
import { getPublishedLayout } from '../lib/builderApi.js'

/* Fetch the published props of a single-block settings slug (e.g. 'site' for the
   header/footer, 'product' for the product template). Returns {} until loaded / if
   nothing is published, so the consuming component renders its own defaults first
   (no flash, identical design until edited). Lets non-page chrome be edited in the
   studio too. */
export function usePublishedProps(slug) {
  const [props, setProps] = useState(null)
  useEffect(() => {
    let alive = true
    getPublishedLayout(slug).then((l) => {
      if (!alive) return
      const block = l && Array.isArray(l.content) ? l.content[0] : null
      if (block && block.props) {
        const { id, ...rest } = block.props
        setProps(rest)
      }
    })
    return () => { alive = false }
  }, [slug])
  return props || {}
}
