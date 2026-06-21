import EditorialHero from '../hero/EditorialHero.jsx'
import PressBar from '../sections/PressBar.jsx'
import DiveInScience from '../sections/DiveInScience.jsx'
import BestsellerCarousel from '../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../sections/FeatureDuo.jsx'
import ReelsGallery from '../sections/ReelsGallery.jsx'
import Reviews from '../sections/Reviews.jsx'
import Newsletter from '../sections/Newsletter.jsx'

/* The homepage is composed from the brand's REAL section components. The live page
   (Home.jsx) renders them DIRECTLY from a layout — no editor wrappers — so the bespoke
   design + animations stay pixel-perfect. /studio edits the same layout and publishes
   it to the Medusa page_builder module; Home reads the published copy back. */

export const SECTIONS = {
  EditorialHero,
  PressBar,
  DiveInScience,
  BestsellerCarousel,
  FeatureDuo,
  ReelsGallery,
  Reviews,
  Newsletter,
}

// The page's slug in the page_builder backend.
export const HOME_SLUG = 'home'

// Default = the current homepage composition, in order. Until a custom layout is
// published, the homepage looks exactly as it does today — and it stays working even
// if the backend is briefly unreachable.
export const defaultHomepage = {
  root: { props: {} },
  content: [
    { type: 'EditorialHero', props: { id: 'hero' } },
    { type: 'PressBar', props: { id: 'press' } },
    { type: 'DiveInScience', props: { id: 'science' } },
    { type: 'BestsellerCarousel', props: { id: 'bestsellers' } },
    { type: 'FeatureDuo', props: { id: 'featureduo' } },
    { type: 'ReelsGallery', props: { id: 'reels' } },
    { type: 'Reviews', props: { id: 'reviews' } },
    { type: 'Newsletter', props: { id: 'newsletter' } },
  ],
}

// Guard against an empty/garbage layout — fall back to the default composition.
export function normalizeLayout(layout) {
  return layout && Array.isArray(layout.content) && layout.content.length ? layout : defaultHomepage
}
