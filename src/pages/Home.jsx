import { useEffect, useState } from 'react'
import { SECTIONS, defaultHomepage, HOME_SLUG, normalizeLayout } from '../studio/homepage.js'
import { getLiveLayout } from '../lib/builderApi.js'

/* Home renders the brand's real section components from the PUBLISHED layout (managed
   in /studio). It paints the in-code default immediately — so there's no blank flash
   and the design is identical until something is published — then swaps in the
   published layout if one exists. No editor wrappers → pixel-perfect. */
export default function Home() {
  const [layout, setLayout] = useState(defaultHomepage)

  useEffect(() => {
    let alive = true
    getLiveLayout(HOME_SLUG).then((l) => {
      if (alive && l) setLayout(normalizeLayout(l))
    })
    return () => { alive = false }
  }, [])

  return (
    <>
      {layout.content.map((block) => {
        const Section = SECTIONS[block.type]
        if (!Section) return null
        const { id, ...props } = block.props || {}
        return <Section key={id || block.type} {...props} />
      })}
    </>
  )
}
