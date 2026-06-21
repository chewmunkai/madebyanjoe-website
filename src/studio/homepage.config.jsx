import EditorialHero from '../hero/EditorialHero.jsx'
import PressBar from '../sections/PressBar.jsx'
import DiveInScience, { DEFAULT_CHAPTERS } from '../sections/DiveInScience.jsx'
import BestsellerCarousel from '../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../sections/FeatureDuo.jsx'
import ReelsGallery from '../sections/ReelsGallery.jsx'
import Reviews from '../sections/Reviews.jsx'
import Newsletter from '../sections/Newsletter.jsx'
import { imageField } from './fields.jsx'

const text = (label) => ({ type: 'text', label })
const area = (label) => ({ type: 'textarea', label })
// On/Off toggle for a section's intro animation.
const onOff = (label) => ({
  type: 'radio',
  label,
  options: [{ label: 'On', value: 'on' }, { label: 'Off', value: 'off' }],
})
const num = (label) => ({ type: 'number', label })

// Defaults for the editable lists (mirror each section's in-code defaults so the
// editor opens showing the current items).
const REVIEW_BASE = 'https://img.appolous.com/themes/_store/anjoe/testimonials/'
const DEFAULT_TESTIMONIALS = [8, 30, 65, 68, 85, 91, 93, 94, 95, 96, 103, 2, 6, 12, 15, 23, 32, 40, 50, 54, 88].map(
  (id) => ({ image: `${REVIEW_BASE}${id}.webp` })
)
const DEFAULT_BESTSELLERS = [
  { slug: 'probiotic-amino-cleanser', rating: 4.9, count: 214 },
  { slug: 'essence-water', rating: 4.9, count: 192 },
  { slug: 'antioxidant-serum', rating: 4.8, count: 167 },
  { slug: 'barrier-repair-cream', rating: 4.8, count: 121 },
  { slug: 'probiotic-mask', rating: 4.9, count: 143 },
  { slug: 'mugwort-treatment-oil', rating: 4.7, count: 88 },
  { slug: 'barrier-repair-combo', rating: 4.9, count: 64 },
]
const DEFAULT_VIDEOS = [
  { id: 'NHoRI6BIun8', title: 'HydraGlow Combo', slug: 'hydraglow-combo' },
  { id: 'WnluJXC215Y', title: 'Skin Activating Combo', slug: 'skin-activating-combo' },
  { id: 'bjn2UrUF5Sw', title: 'Lymphatic Drainage Brush', slug: 'cellulite-massager' },
]
const DEFAULT_REELS = ['DCO2T2LSdOe', 'DG5jIfPS6AF', 'DE41RXbShg6', 'C7MO2Mvxzr4', 'C_soITryuE7', 'C6bCXXVxh5N'].map(
  (id) => ({ id })
)

/* Puck config for the homepage editor. Each block IS a real section component, so
   you compose/reorder your actual homepage, edit its content, swap its media, and
   toggle its intro animation. defaultProps mirror the live defaults, so opening a
   block shows the current values. Section internals (scroll choreography, layout)
   stay code — this edits content + composition + media + animation presets. */
export const config = {
  components: {
    EditorialHero: {
      label: 'Hero',
      fields: {
        rail: text('Rail label'),
        titleLine1: text('Title — line 1'),
        titleLine2: text('Title — line 2 (italic)'),
        lede: area('Subtext'),
        ctaPrimary: text('Primary button'),
        ctaSecondary: text('Secondary link'),
        background: {
          type: 'select',
          label: 'Background',
          options: [
            { label: 'Video (YouTube)', value: 'youtube' },
            { label: 'Video (upload)', value: 'upload' },
            { label: 'Image (upload)', value: 'image' },
            { label: 'None — type only', value: 'none' },
          ],
        },
        youtubeId: text('YouTube video ID'),
        media: imageField('Uploaded image / video'),
        animation: onOff('Intro animation'),
      },
      defaultProps: {
        rail: '01 — The hydration ritual',
        titleLine1: 'Hydration,',
        titleLine2: 'engineered.',
        lede: 'Plant-based, probiotic skincare that floods the skin with moisture and rebuilds the barrier — clinically gentle, visibly dewy.',
        ctaPrimary: 'Shop the ritual',
        ctaSecondary: 'Our science →',
        background: 'youtube',
        youtubeId: 'NHoRI6BIun8',
        media: '',
        animation: 'on',
      },
      render: ({ puck, ...props }) => <EditorialHero {...props} motionless={!!puck?.isEditing} />,
    },

    PressBar: {
      label: 'Press bar',
      fields: {
        eyebrow: text('Eyebrow'),
        credentials: {
          type: 'array',
          label: 'Credentials',
          arrayFields: { label: text('Text') },
          getItemSummary: (item) => item?.label || 'Credential',
        },
        reveal: onOff('Intro animation'),
      },
      defaultProps: {
        eyebrow: 'Created by Anjoe Koh — UK-trained pharmacist',
        credentials: [
          { label: 'Pharmacist-founded' },
          { label: 'KKM-NPRA Certified' },
          { label: 'Dermatologically Tested' },
          { label: '100% Plant-Based' },
          { label: 'Est. 2020 · Kuala Lumpur' },
        ],
        reveal: 'on',
      },
      render: (props) => <PressBar {...props} />,
    },

    DiveInScience: {
      label: 'Dive-in science',
      fields: {
        eyebrow: text('Eyebrow'),
        titleA: text('Title — before italic'),
        titleEm: text('Title — italic word'),
        titleB: text('Title — after italic'),
        ctaText: text('Link text'),
        ctaHref: text('Link URL'),
        animation: onOff('Scroll animation'),
        chapters: {
          type: 'array',
          label: 'Scroll chapters',
          arrayFields: {
            i: text('Number'),
            t: text('Title'),
            d: area('Description'),
            slug: text('Product slug'),
          },
          getItemSummary: (c) => c?.t || 'Chapter',
        },
      },
      defaultProps: {
        eyebrow: 'Dive in — the science',
        titleA: 'What hydration ',
        titleEm: 'actually',
        titleB: ' needs.',
        ctaText: 'Explore the ritual →',
        ctaHref: '/shop',
        animation: 'on',
        chapters: DEFAULT_CHAPTERS,
      },
      render: (props) => <DiveInScience {...props} />,
    },

    BestsellerCarousel: {
      label: 'Bestsellers',
      fields: {
        eyebrow: text('Eyebrow'),
        title: text('Title'),
        viewAllText: text('"View all" text'),
        viewAllHref: text('"View all" URL'),
        reveal: onOff('Intro animation'),
        products: {
          type: 'array',
          label: 'Products',
          arrayFields: { slug: text('Product slug'), rating: num('Rating'), count: num('Review count') },
          getItemSummary: (item) => item?.slug || 'Product',
        },
      },
      defaultProps: {
        eyebrow: 'Loved & repurchased',
        title: 'The bestsellers.',
        viewAllText: 'View all →',
        viewAllHref: '/shop',
        reveal: 'on',
        products: DEFAULT_BESTSELLERS,
      },
      render: (props) => <BestsellerCarousel {...props} />,
    },

    FeatureDuo: {
      label: 'Feature duo',
      fields: {
        f1Eyebrow: text('Card 1 — eyebrow'),
        f1Title: text('Card 1 — title'),
        f1Slug: text('Card 1 — product slug'),
        f1Image: imageField('Card 1 — image override'),
        f2Eyebrow: text('Card 2 — eyebrow'),
        f2Title: text('Card 2 — title'),
        f2Slug: text('Card 2 — product slug'),
        f2Image: imageField('Card 2 — image override'),
        ctaText: text('Button text'),
        reveal: onOff('Intro animation'),
      },
      defaultProps: {
        f1Eyebrow: 'Probiotic sheet mask',
        f1Title: 'Quench & Glow, in one sheet.',
        f1Slug: 'probiotic-mask',
        f1Image: '',
        f2Eyebrow: 'Antioxidant serum',
        f2Title: 'Defend, brighten, glow.',
        f2Slug: 'antioxidant-serum',
        f2Image: '',
        ctaText: 'Learn more',
        reveal: 'on',
      },
      render: (props) => <FeatureDuo {...props} />,
    },

    ReelsGallery: {
      label: 'Reels gallery',
      fields: {
        eyebrow: text('Eyebrow'),
        heading: text('Heading'),
        followText: text('Follow link text'),
        followHref: text('Follow link URL'),
        igEyebrow: text('Instagram eyebrow'),
        igSub: area('Instagram subtext'),
        reveal: onOff('Intro animation'),
        videos: {
          type: 'array',
          label: 'Featured videos',
          arrayFields: { id: text('YouTube ID'), title: text('Title'), slug: text('Product slug') },
          getItemSummary: (item) => item?.title || 'Video',
        },
        reels: {
          type: 'array',
          label: 'Instagram reels',
          arrayFields: { id: text('Reel shortcode') },
          getItemSummary: (item) => item?.id || 'Reel',
        },
      },
      defaultProps: {
        eyebrow: 'Watch the ritual',
        heading: '@madebyanjoe',
        followText: 'Follow the ritual →',
        followHref: 'https://www.instagram.com/madebyanjoe/',
        igEyebrow: 'On Instagram',
        igSub: 'Real reels from the @madebyanjoe community — tap any to watch.',
        reveal: 'on',
        videos: DEFAULT_VIDEOS,
        reels: DEFAULT_REELS,
      },
      render: (props) => <ReelsGallery {...props} />,
    },

    Reviews: {
      label: 'Reviews',
      fields: {
        eyebrow: text('Eyebrow'),
        title: text('Title'),
        sub: text('Subtext'),
        reveal: onOff('Intro animation'),
        testimonials: {
          type: 'array',
          label: 'Testimonials',
          arrayFields: { image: imageField('Image') },
          getItemSummary: (_item, i) => `Testimonial ${i + 1}`,
        },
      },
      defaultProps: {
        eyebrow: 'What you’re saying',
        title: 'Real words, real skin.',
        sub: 'Unedited messages from the ANJOE community.',
        reveal: 'on',
        testimonials: DEFAULT_TESTIMONIALS,
      },
      render: (props) => <Reviews {...props} />,
    },

    Newsletter: {
      label: 'Newsletter',
      fields: {
        eyebrow: text('Eyebrow'),
        headingA: text('Heading — before italic'),
        headingEm: text('Heading — italic'),
        headingB: text('Heading — after italic'),
        lede: area('Subtext'),
        cta: text('Button text'),
        placeholder: text('Input placeholder'),
        successText: text('Success message'),
      },
      defaultProps: {
        eyebrow: 'Join the ritual',
        headingA: '10% off your ',
        headingEm: 'first ritual',
        headingB: '.',
        lede: 'Hydration notes, restocks and members-only drops — straight to your inbox.',
        cta: 'Claim 10%',
        placeholder: 'Email address',
        successText: 'You’re in — check your inbox for the code. ✦',
      },
      render: (props) => <Newsletter {...props} />,
    },
  },
}
