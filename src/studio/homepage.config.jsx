import EditorialHero from '../hero/EditorialHero.jsx'
import PressBar from '../sections/PressBar.jsx'
import DiveInScience from '../sections/DiveInScience.jsx'
import BestsellerCarousel from '../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../sections/FeatureDuo.jsx'
import ReelsGallery from '../sections/ReelsGallery.jsx'
import Reviews from '../sections/Reviews.jsx'
import Newsletter from '../sections/Newsletter.jsx'

/* Puck config for the homepage editor. Each block IS a real section component, so
   you compose/reorder your actual homepage. The Hero exposes its copy as editable
   fields; the other sections keep their internal content for now (reorder / add /
   remove them, and we can expose more fields the same way later). */
export const config = {
  components: {
    EditorialHero: {
      label: 'Hero',
      fields: {
        rail: { type: 'text', label: 'Rail label' },
        titleLine1: { type: 'text', label: 'Title — line 1' },
        titleLine2: { type: 'text', label: 'Title — line 2 (italic)' },
        lede: { type: 'textarea', label: 'Subtext' },
        ctaPrimary: { type: 'text', label: 'Primary button' },
        ctaSecondary: { type: 'text', label: 'Secondary link' },
      },
      defaultProps: {
        rail: '01 — The hydration ritual',
        titleLine1: 'Hydration,',
        titleLine2: 'engineered.',
        lede: 'Plant-based, probiotic skincare that floods the skin with moisture and rebuilds the barrier — clinically gentle, visibly dewy.',
        ctaPrimary: 'Shop the ritual',
        ctaSecondary: 'Our science →',
      },
      render: ({ rail, titleLine1, titleLine2, lede, ctaPrimary, ctaSecondary, puck }) => (
        <EditorialHero
          rail={rail}
          titleLine1={titleLine1}
          titleLine2={titleLine2}
          lede={lede}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
          motionless={!!puck?.isEditing}
        />
      ),
    },
    PressBar: { label: 'Press bar', render: () => <PressBar /> },
    DiveInScience: { label: 'Dive-in science', render: () => <DiveInScience /> },
    BestsellerCarousel: { label: 'Bestsellers', render: () => <BestsellerCarousel /> },
    FeatureDuo: { label: 'Feature duo', render: () => <FeatureDuo /> },
    ReelsGallery: { label: 'Reels gallery', render: () => <ReelsGallery /> },
    Reviews: { label: 'Reviews', render: () => <Reviews /> },
    Newsletter: { label: 'Newsletter', render: () => <Newsletter /> },
  },
}
