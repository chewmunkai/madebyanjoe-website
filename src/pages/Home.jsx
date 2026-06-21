import { SECTIONS, loadHomepage } from '../studio/homepage.js'

/* Home renders the brand's real section components DIRECTLY from the studio layout
   (default = the current composition, in order), so the design + animations stay
   exactly as designed until you edit them in /studio. No editor wrappers here. */
export default function Home() {
  const layout = loadHomepage()
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
