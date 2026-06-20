import EditorialHero from '../hero/EditorialHero.jsx'
import PressBar from '../sections/PressBar.jsx'
import ClinicalResults from '../sections/ClinicalResults.jsx'
import DiveInScience from '../sections/DiveInScience.jsx'
import BestsellerCarousel from '../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../sections/FeatureDuo.jsx'
import ReelsGallery from '../sections/ReelsGallery.jsx'
import Reviews from '../sections/Reviews.jsx'
import Newsletter from '../sections/Newsletter.jsx'

/* Home — Torriden-modeled narrative:
   hero → credentials → clinical proof → ingredient scrollytelling →
   bestseller drag-carousel → @madebyanjoe videos → real testimonials →
   10%-off capture. */
export default function Home() {
  return (
    <>
      <EditorialHero />
      <PressBar />
      <ClinicalResults />
      <DiveInScience />
      <BestsellerCarousel />
      <FeatureDuo />
      <ReelsGallery />
      <Reviews />
      <Newsletter />
    </>
  )
}
