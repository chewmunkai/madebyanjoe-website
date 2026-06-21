import { useEffect, useState } from 'react'
import { getPublishedLayout } from '../lib/builderApi.js'
import { layoutOr } from './pages.js'

/* Renders a page's PUBLISHED layout from the backend using that page's component
   registry. Paints the in-code default immediately (no flash, identical until
   published), then swaps in the published layout if one exists. No editor wrappers
   → bespoke design stays pixel-perfect. */
export default function PageView({ page }) {
  const [layout, setLayout] = useState(page.defaultLayout)

  useEffect(() => {
    let alive = true
    setLayout(page.defaultLayout)
    getPublishedLayout(page.slug).then((l) => {
      if (alive && l) setLayout(layoutOr(l, page.defaultLayout))
    })
    return () => { alive = false }
  }, [page.slug])

  return (
    <>
      {layout.content.map((block) => {
        const Section = page.sections[block.type]
        if (!Section) return null
        const { id, ...props } = block.props || {}
        return <Section key={id || block.type} {...props} />
      })}
    </>
  )
}
