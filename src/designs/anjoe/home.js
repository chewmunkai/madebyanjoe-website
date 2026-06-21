/* designs/anjoe/home.js — the Anjoe homepage design module.

   A design module pairs the manifest's section names with (a) the real React
   components and (b) their default props. For this MIGRATED design the defaults are
   copied verbatim from the original hand-written Puck config, so the compiled editor
   + live render are byte-identical to before. New designs instead carry their content
   inline in the manifest (the compiler supports both).

   Pattern: manifest = field STRUCTURE + section order; design module = components +
   verbatim defaults. The compiler stitches them into a PAGES entry. */

import EditorialHero from '../../hero/EditorialHero.jsx'
import PressBar from '../../sections/PressBar.jsx'
import DiveInScience, { DEFAULT_CHAPTERS } from '../../sections/DiveInScience.jsx'
import BestsellerCarousel from '../../sections/BestsellerCarousel.jsx'
import FeatureDuo from '../../sections/FeatureDuo.jsx'
import ReelsGallery from '../../sections/ReelsGallery.jsx'
import Reviews from '../../sections/Reviews.jsx'
import Newsletter from '../../sections/Newsletter.jsx'

export const components = {
  EditorialHero,
  PressBar,
  DiveInScience,
  BestsellerCarousel,
  FeatureDuo,
  ReelsGallery,
  Reviews,
  Newsletter,
}

// List defaults — mirror each section's in-code defaults so the editor opens on the
// current content (verbatim from the original config).
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

export const defaults = {
  EditorialHero: {
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
    introDuration: 1.15,
    introEase: 'power4.out',
  },
  PressBar: {
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
  DiveInScience: {
    eyebrow: 'Dive in — the science',
    titleA: 'What hydration ',
    titleEm: 'actually',
    titleB: ' needs.',
    ctaText: 'Explore the ritual →',
    ctaHref: '/shop',
    animation: 'on',
    trackVh: 440,
    chapters: DEFAULT_CHAPTERS,
  },
  BestsellerCarousel: {
    eyebrow: 'Loved & repurchased',
    title: 'The bestsellers.',
    viewAllText: 'View all →',
    viewAllHref: '/shop',
    reveal: 'on',
    products: DEFAULT_BESTSELLERS,
  },
  FeatureDuo: {
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
  ReelsGallery: {
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
  Reviews: {
    eyebrow: 'What you’re saying',
    title: 'Real words, real skin.',
    sub: 'Unedited messages from the ANJOE community.',
    reveal: 'on',
    testimonials: DEFAULT_TESTIMONIALS,
  },
  Newsletter: {
    eyebrow: 'Join the ritual',
    headingA: '10% off your ',
    headingEm: 'first ritual',
    headingB: '.',
    lede: 'Hydration notes, restocks and members-only drops — straight to your inbox.',
    cta: 'Claim 10%',
    placeholder: 'Email address',
    successText: 'You’re in — check your inbox for the code. ✦',
  },
}
