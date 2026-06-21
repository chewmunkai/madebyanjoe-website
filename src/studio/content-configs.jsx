import Contact, { DEFAULT_CHANNELS } from '../pages/Contact.jsx'
import FAQ, { DEFAULT_PAYMENTS, DEFAULT_GROUPS } from '../pages/FAQ.jsx'
import Shipping, { DEFAULT_ZONES, DEFAULT_POLICIES } from '../pages/Shipping.jsx'
import Careers, { DEFAULT_ROLES, DEFAULT_VALUES, DEFAULT_CREED } from '../pages/Careers.jsx'
import Legal, { PRIVACY_CONTENT, TERMS_CONTENT } from '../pages/Legal.jsx'

const text = (label) => ({ type: 'text', label })
const area = (label) => ({ type: 'textarea', label })
const list = (label, arrayFields, getItemSummary) => ({ type: 'array', label, arrayFields, getItemSummary })
const wrap = (key) => (arr) => (arr || []).map((v) => ({ [key]: v }))

/* Each content page is a single editable block. defaultProps import the page's own
   defaults (single source of truth) so the editor opens showing current content;
   nested string-lists are wrapped into objects for the array fields (the components
   accept either form, so rendering stays byte-identical). */

export const contactConfig = {
  components: {
    ContactPage: {
      label: 'Contact page',
      fields: {
        introStamp: text('Intro stamp'),
        introCoord: text('Intro coordinates'),
        introTitleA: text('Title — before italic'),
        introTitleEm: text('Title — italic'),
        introTitleB: text('Title — after italic'),
        introLede: area('Intro paragraph'),
        statusOpenLabel: text('Status — open'),
        statusClosedLabel: text('Status — closed'),
        hours: text('Hours'),
        panelLabel: text('Form — label'),
        panelTitleA: text('Form title — before italic'),
        panelTitleEm: text('Form title — italic'),
        sentMessage: area('Form — sent message'),
        sendButton: text('Form — send button'),
        dossierLabel: text('Details — label'),
        company: text('Company'),
        address: text('Address'),
        phone: text('Phone'),
        email: text('Email'),
        instagramUrl: text('Instagram URL'),
        facebookUrl: text('Facebook URL'),
        handle: text('Social handle'),
        locatorLabel: text('Locator — label'),
        locatorTitleA: text('Locator title — before italic'),
        locatorTitleEm: text('Locator title — italic'),
        locatorTitleB: text('Locator title — after italic'),
        locatorLede: area('Locator paragraph'),
        lat: text('Latitude'),
        long: text('Longitude'),
        mapCaption: text('Map caption'),
        consoleLabel: text('Channels — label'),
        consoleTitleA: text('Channels title — before italic'),
        consoleTitleEm: text('Channels title — italic'),
        consoleTitleB: text('Channels title — after italic'),
        channels: list('Channels', {
          idx: text('Number'), icon: text('Icon'), label: text('Label'), title: text('Title'),
          lines: list('Lines', { line: text('Line') }, (i) => i?.line || 'Line'),
          href: text('Link URL'), hrefLabel: text('Link label'),
        }, (c) => c?.label || 'Channel'),
        ctaTitle: text('CTA — title'),
        ctaButton: text('CTA — button'),
        ctaFaqLink: text('CTA — FAQ link'),
      },
      defaultProps: {
        introStamp: 'Get in touch', introCoord: '3.17°N 101.65°E',
        introTitleA: 'Let’s', introTitleEm: 'talk', introTitleB: ' skin.',
        introLede: 'Questions about a formula, an order, or a ritual? Reach the ANJOE team in Mont Kiara — we read every message and reply as quickly as we can.',
        statusOpenLabel: 'Studio open now', statusClosedLabel: 'Studio closed now', hours: 'Mon–Fri, 10am–7pm',
        panelLabel: 'Send a message', panelTitleA: 'Write to ', panelTitleEm: 'us',
        sentMessage: 'Thank you — your message is on its way. We’ll reply within 1–2 business days.', sendButton: 'Send message',
        dossierLabel: 'The details',
        company: 'Medicircle Holding Sdn Bhd (201701030879)',
        address: 'S-20-09 Menara YNH, Kiara 163, Jalan Kiara, Mont Kiara 50480, Kuala Lumpur',
        phone: '03-2702 9531', email: 'hello@madebyanjoe.com',
        instagramUrl: 'https://www.instagram.com/madebyanjoe', facebookUrl: 'https://www.facebook.com/madebyanjoe', handle: '@madebyanjoe',
        locatorLabel: 'Find us', locatorTitleA: 'The studio in ', locatorTitleEm: 'Mont Kiara', locatorTitleB: '.',
        locatorLede: 'Tucked into Menara YNH at Kiara 163 — at the heart of Mont Kiara, Kuala Lumpur. Drop by during studio hours, or reach us any time by message.',
        lat: '3.1670° N', long: '101.6500° E', mapCaption: 'Menara YNH · Kiara 163',
        consoleLabel: 'Every way in', consoleTitleA: 'Three ways to ', consoleTitleEm: 'reach', consoleTitleB: ' us.',
        channels: DEFAULT_CHANNELS.map((c) => ({ ...c, lines: wrap('line')(c.lines) })),
        ctaTitle: 'Rather just email us?', ctaButton: 'Email the team', ctaFaqLink: 'Read the FAQ →',
      },
      render: (props) => <Contact {...props} />,
    },
  },
}

export const faqConfig = {
  components: {
    FaqPage: {
      label: 'FAQ page',
      fields: {
        kicker: text('Kicker'),
        titleA: text('Title — before italic'),
        titleEm: text('Title — italic'),
        titleB: text('Title — after italic'),
        lede: area('Intro paragraph'),
        email: text('Email'),
        consoleLabel: text('Console label'),
        stillTitle: text('"Still searching" text'),
        ctaTitle: text('CTA — title'),
        ctaLede: area('CTA — subtext'),
        payments: list('Payment methods', { label: text('Method') }, (i) => i?.label || 'Method'),
        groups: list('Topics', {
          id: text('ID'), idx: text('Number'), icon: text('Icon'), title: text('Title'), short: text('Short label'), note: text('Note'),
          items: list('Questions', { q: text('Question'), a: area('Answer') }, (i) => i?.q || 'Question'),
        }, (g) => g?.title || 'Topic'),
      },
      defaultProps: {
        kicker: 'Help centre', titleA: 'Everything,', titleEm: 'answered', titleB: '.',
        lede: 'Orders, payment, delivery and getting the most from your ANJOE ritual — sorted by topic, plainly answered.',
        email: 'hello@madebyanjoe.com', consoleLabel: 'answers ready', stillTitle: 'Can’t find your answer in the topics above?',
        ctaTitle: 'Didn’t find your answer?', ctaLede: 'Email the team at hello@madebyanjoe.com and we’ll get back to you.',
        payments: wrap('label')(DEFAULT_PAYMENTS),
        groups: DEFAULT_GROUPS,
      },
      render: (props) => <FAQ {...props} />,
    },
  },
}

export const shippingConfig = {
  components: {
    ShippingPage: {
      label: 'Shipping page',
      fields: {
        heroRail: text('Hero rail'),
        heroCoord: text('Hero coordinate'),
        eyebrow: text('Eyebrow'),
        titleA: text('Title — before italic'),
        titleEm: text('Title — italic'),
        titleB: text('Title — after italic'),
        lede: area('Intro paragraph'),
        ratesEyebrow: text('Rates — eyebrow'),
        ratesTitleA: text('Rates title — before italic'),
        ratesTitleEm: text('Rates title — italic'),
        ratesTitleB: text('Rates title — after italic'),
        ratesNote: text('Rates — note'),
        ratesFoot: area('Rates — footnote'),
        zones: list('Rate zones', {
          idx: text('Number'), key: text('Key'), title: text('Title'), range: text('Range'), band: text('Band'),
          rows: list('Destinations', { region: text('Destination'), rate: text('Rate'), eta: text('Estimated delivery') }, (r) => r?.region || 'Destination'),
        }, (z) => z?.title || 'Zone'),
        policiesEyebrow: text('Policies — eyebrow'),
        policiesTitleA: text('Policies title — before italic'),
        policiesTitleEm: text('Policies title — italic'),
        policiesTitleB: text('Policies title — after italic'),
        policiesLede: area('Policies — paragraph'),
        policies: list('Policies', { q: text('Title'), a: area('Body') }, (p) => p?.q || 'Policy'),
        ctaTitle: text('CTA — title'),
        ctaLede: text('CTA — subtext'),
        email: text('Email'),
      },
      defaultProps: {
        heroRail: 'Shipped worldwide · GDEX Express', heroCoord: '3.1390° N', eyebrow: 'Shipping & returns',
        titleA: 'From KL to ', titleEm: 'your door', titleB: '.',
        lede: 'Shipped from Kuala Lumpur via GDEX Express. Orders are prepared within 1–2 business days — here are the rates, timelines and our returns policy in full.',
        ratesEyebrow: 'Shipping rates', ratesTitleA: 'Where we ', ratesTitleEm: 'deliver', ratesTitleB: '.',
        ratesNote: 'Grouped by region, in MYR — fifteen destinations, three zones.',
        ratesFoot: 'Rates in MYR. Delivery estimates exclude the 1–2 business-day preparation window and any customs clearance.',
        zones: DEFAULT_ZONES,
        policiesEyebrow: 'Returns & policies', policiesTitleA: 'The fine ', policiesTitleEm: 'print', policiesTitleB: '.',
        policiesLede: 'The details worth reading before you order — hygiene, exchanges, damaged parcels, customs and returned deliveries, in full.',
        policies: DEFAULT_POLICIES,
        ctaTitle: 'Questions about a delivery?', ctaLede: 'Reach the team at hello@madebyanjoe.com.', email: 'hello@madebyanjoe.com',
      },
      render: (props) => <Shipping {...props} />,
    },
  },
}

export const careersConfig = {
  components: {
    CareersPage: {
      label: 'Careers page',
      fields: {
        heroCoord: text('Hero coordinate'),
        heroPlace: text('Hero place'),
        heroGhost: text('Hero ghost word'),
        heroEyebrow: text('Eyebrow'),
        heroTitleA: text('Title — before italic'),
        heroTitleEm: text('Title — italic'),
        heroTitleB: text('Title — after italic'),
        heroLede: area('Intro paragraph'),
        whyEyebrow: text('Why — eyebrow'),
        whyTitleA: text('Why title — before italic'),
        whyTitleEm: text('Why title — italic'),
        whyTitleB: text('Why title — after italic'),
        values: list('Values', { icon: text('Icon'), title: text('Title'), body: area('Body') }, (v) => v?.title || 'Value'),
        creed: list('Creed', { label: text('Line') }, (i) => i?.label || 'Line'),
        rolesEyebrow: text('Roles — eyebrow'),
        rolesTitle: text('Roles — title'),
        rolesIntro: area('Roles — intro'),
        roles: list('Roles', {
          title: text('Title'), blurb: area('Blurb'),
          tags: list('Tags', { label: text('Tag') }, (i) => i?.label || 'Tag'),
          scope: list('What you’ll do', { label: text('Item') }, (i) => i?.label || 'Item'),
          needs: list('What we’re after', { label: text('Item') }, (i) => i?.label || 'Item'),
        }, (r) => r?.title || 'Role'),
        applyEyebrow: text('Apply — eyebrow'),
        applyTitle: text('Apply — title'),
        email: text('Email'),
        ctaTitle: text('CTA — title'),
        ctaLede: text('CTA — subtext'),
        ctaButton: text('CTA — button'),
      },
      defaultProps: {
        heroCoord: '3°09′N 101°39′E', heroPlace: 'Mont Kiara · KL', heroGhost: 'Now hiring', heroEyebrow: 'Careers',
        heroTitleA: 'Build the ', heroTitleEm: 'ritual', heroTitleB: ' with us.',
        heroLede: 'We’re a plant-based, probiotic skincare house in Mont Kiara, Kuala Lumpur. We welcome people — interns and fresh graduates included — who care about health, beauty and doing the small things well.',
        whyEyebrow: 'Why join', whyTitleA: 'A studio that values ', whyTitleEm: 'care', whyTitleB: '.',
        values: DEFAULT_VALUES,
        creed: wrap('label')(DEFAULT_CREED),
        rolesEyebrow: 'Open positions', rolesTitle: 'Find a job you love.',
        rolesIntro: 'Two roles, both based in our Mont Kiara studio. Read the scope, then apply by email — we read every application.',
        roles: DEFAULT_ROLES.map((r) => ({ ...r, tags: wrap('label')(r.tags), scope: wrap('label')(r.scope), needs: wrap('label')(r.needs) })),
        applyEyebrow: 'How to apply', applyTitle: 'Tell us your story.', email: 'hello@madebyanjoe.com',
        ctaTitle: 'Don’t see your role?', ctaLede: 'Tell us how you’d help — we’re always listening.', ctaButton: 'Email your resume',
      },
      render: (props) => <Careers {...props} />,
    },
  },
}

const legalFields = {
  eyebrow: text('Eyebrow'),
  h1A: text('Title — before italic'),
  h1Em: text('Title — italic'),
  h1B: text('Title — after italic'),
  short: text('Short name (ghost)'),
  docLetter: text('Doc letter'),
  lede: area('Intro paragraph'),
  updated: text('Updated line'),
  blocks: list('Clauses', {
    h: text('Heading'),
    p: list('Paragraphs', { text: area('Paragraph') }, (i, n) => `Paragraph ${n + 1}`),
  }, (b) => b?.h || 'Clause'),
}
const legalDefaults = (content) => ({
  ...content,
  blocks: content.blocks.map((b) => ({ ...b, p: wrap('text')(b.p) })),
})
const makeLegalConfig = (content) => ({
  components: {
    LegalPage: {
      label: 'Legal page',
      fields: legalFields,
      defaultProps: legalDefaults(content),
      render: (props) => <Legal {...props} />,
    },
  },
})

export const privacyConfig = makeLegalConfig(PRIVACY_CONTENT)
export const termsConfig = makeLegalConfig(TERMS_CONTENT)
