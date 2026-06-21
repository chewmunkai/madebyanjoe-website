import EditorialHero from '../hero/EditorialHero.jsx'
import PressBar from '../sections/PressBar.jsx'
import DiveInScience from '../sections/DiveInScience.jsx'
import BestsellerCarousel from '../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../sections/FeatureDuo.jsx'
import ReelsGallery from '../sections/ReelsGallery.jsx'
import Reviews from '../sections/Reviews.jsx'
import Newsletter from '../sections/Newsletter.jsx'

/* The homepage is composed from the brand's REAL section components. The live page
   (Home.jsx) renders them DIRECTLY from this layout — no editor wrappers — so the
   bespoke design + animations stay pixel-perfect. The /studio editor edits this
   same layout (order + the hero's content) and publishes it. */

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

export const HOMEPAGE_KEY = 'anjoe-homepage'

// Default = the current homepage composition, in order. Until you publish a custom
// layout, the homepage looks exactly as it does today.
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

export function loadHomepage() {
  try {
    const saved = JSON.parse(localStorage.getItem(HOMEPAGE_KEY))
    return saved && Array.isArray(saved.content) && saved.content.length ? saved : defaultHomepage
  } catch {
    return defaultHomepage
  }
}
