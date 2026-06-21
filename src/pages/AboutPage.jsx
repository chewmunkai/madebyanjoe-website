import PageView from '../studio/PageView.jsx'
import { PAGES } from '../studio/pages.js'

/* The /about route — renders the About page from its published layout (editable in
   /studio?page=about), falling back to the in-code default. */
export default function AboutPage() {
  return <PageView page={PAGES.about} />
}
