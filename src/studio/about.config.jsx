import About from '../pages/About.jsx'

const text = (label) => ({ type: 'text', label })
const area = (label) => ({ type: 'textarea', label })
const select = (label, ...vals) => ({ type: 'select', label, options: vals.map((v) => ({ label: v, value: v })) })

/* Puck config for the About page. The whole page is ONE editable block (its bespoke
   parallax/glass design stays in code); the fields expose its copy and its four lists
   so the client edits content without touching the layout. defaultProps mirror About's
   in-code defaults. */
export const config = {
  components: {
    AboutPage: {
      label: 'About page',
      fields: {
        heroRail: text('Hero — rail'),
        heroEyebrow: text('Hero — eyebrow'),
        heroTitleA: text('Hero title — before italic'),
        heroTitleEm: text('Hero title — italic'),
        heroTitleB: text('Hero title — after italic'),
        introLede: area('Intro paragraph'),
        founderTitleA: text('Founder title — before italic'),
        founderTitleEm: text('Founder title — italic'),
        founderTitleB: text('Founder title — after italic'),
        founderCopy: {
          type: 'array',
          label: 'Founder paragraphs',
          arrayFields: { text: area('Paragraph') },
          getItemSummary: (_i, n) => `Paragraph ${n + 1}`,
        },
        founderSign: text('Founder signature'),
        timelineTitleA: text('Timeline title — before italic'),
        timelineTitleEm: text('Timeline title — italic'),
        timelineTitleB: text('Timeline title — after italic'),
        timeline: {
          type: 'array',
          label: 'Timeline milestones',
          arrayFields: { tag: text('Tag'), title: text('Title'), body: area('Body'), side: select('Side', 'left', 'right'), tone: select('Tone', 'blush', 'sage') },
          getItemSummary: (item) => item?.title || 'Milestone',
        },
        methodTitleA: text('Method title — before italic'),
        methodTitleEm: text('Method title — italic'),
        methodTitleB: text('Method title — after italic'),
        method: {
          type: 'array',
          label: 'Method cards',
          arrayFields: { idx: text('Number'), head: text('Heading'), body: area('Body'), icon: text('Icon name') },
          getItemSummary: (item) => item?.head || 'Card',
        },
        valuesTitle: text('Values — title'),
        values: {
          type: 'array',
          label: 'Values',
          arrayFields: { title: text('Title'), body: area('Body'), icon: text('Icon name') },
          getItemSummary: (item) => item?.title || 'Value',
        },
        quoteA: area('Quote — before italic'),
        quoteEm: text('Quote — italic'),
        quoteB: text('Quote — after italic'),
        quoteName: text('Quote — name'),
        quoteRole: text('Quote — role'),
        certs: {
          type: 'array',
          label: 'Certifications',
          arrayFields: { label: text('Text') },
          getItemSummary: (item) => item?.label || 'Certification',
        },
        ctaTitle: text('CTA — title'),
        ctaLede: text('CTA — subtext'),
        ctaButton: text('CTA — button'),
      },
      defaultProps: {
        heroRail: 'Raw Beauté — Est. 2020',
        heroEyebrow: 'Our story',
        heroTitleA: 'Beauty, ',
        heroTitleEm: 'raw',
        heroTitleB: ' — and engineered.',
        introLede: 'ANJOE began with a simple belief: skin thrives when its barrier is respected. We pair botanical, probiotic formulas with the rigour of a pharmacist’s lab — clinically tested, gently made, deeply hydrating.',
        founderTitleA: 'Created by ',
        founderTitleEm: 'Anjoe Koh',
        founderTitleB: '.',
        founderCopy: [
          { text: 'A UK-trained, dual-licensed pharmacist — and a former beauty queen — Anjoe spent a decade practising manual lymphatic massage before formulating the range she couldn’t find on the shelf.' },
          { text: 'That pharmacist’s discipline runs through everything: low-pH systems that cleanse without stripping, ferments chosen for the microbiome, barrier lipids measured to reseal. Raw Beauté is clinical care that still feels like a ritual.' },
          { text: 'Formulated and certified in Malaysia under Medicircle Holding, the range is dermatologically tested and KKM-NPRA certified — luxury that earns its claims.' },
        ],
        founderSign: 'Anjoe Koh — Kuala Lumpur',
        timelineTitleA: 'The making of ',
        timelineTitleEm: 'Raw Beauté',
        timelineTitleB: '.',
        timeline: [
          { tag: 'The training', title: 'A pharmacist’s discipline', body: 'A UK-trained, dual-licensed pharmacist learns to read a formula the way a clinician reads a chart — evidence first, claims earned.', side: 'left', tone: 'blush' },
          { tag: 'The hands', title: 'A decade of touch', body: 'Ten years practising manual lymphatic massage — an intimate, daily study of how skin actually behaves, not how it’s marketed.', side: 'right', tone: 'sage' },
          { tag: 'Est. 2020 · Kuala Lumpur', title: 'The range she couldn’t find', body: 'Raw Beauté begins: low-pH systems, microbiome ferments and barrier lipids — the clinically gentle range that wasn’t on the shelf.', side: 'left', tone: 'blush' },
          { tag: 'The proof', title: 'Certified, not just claimed', body: 'Formulated and certified in Malaysia under Medicircle Holding — dermatologically tested and KKM-NPRA certified. Luxury that earns it.', side: 'right', tone: 'sage' },
        ],
        methodTitleA: 'A pharmacist’s discipline, in ',
        methodTitleEm: 'every bottle',
        methodTitleB: '.',
        method: [
          { idx: '01', head: 'Low-pH systems', body: 'Cleansers and essences formulated around the skin’s own acid mantle — they lift the day without stripping the barrier that holds water in.', icon: 'droplet' },
          { idx: '02', head: 'Botanical actives', body: 'Plant actives at the core of every formula: grape seed and Vitamin E, mugwort, rice ferment and cold-pressed plant oils.', icon: 'herb' },
          { idx: '03', head: 'Barrier lipids', body: 'Ceramides and plant oils measured to reseal the moisture barrier — the difference between water sitting on skin and water staying in it.', icon: 'shield' },
        ],
        valuesTitle: 'Four principles, no compromise.',
        values: [
          { title: 'Plant-based', body: 'Botanical actives at the core of every formula — grape seed, Vitamin E, mugwort, rice ferment.', icon: 'seedling' },
          { title: 'Clinically gentle', body: 'Dermatologically tested and KKM-NPRA certified. Kind to reactive, sensitive skin.', icon: 'test-tube' },
          { title: 'Barrier-first', body: 'We treat the moisture barrier as the foundation of healthy, dewy skin.', icon: 'shield' },
          { title: 'Probiotic science', body: 'Ferments that work with the skin’s microbiome, not against it.', icon: 'microbe' },
        ],
        quoteA: 'Skincare with the discipline of a lab and the gentleness of something ',
        quoteEm: 'grown',
        quoteB: '.',
        quoteName: 'Anjoe Koh',
        quoteRole: 'Founder · Pharmacist · Kuala Lumpur',
        certs: [
          { label: 'KKM-NPRA Certified' },
          { label: 'Dermatologically Tested' },
          { label: '100% Plant-Based' },
          { label: 'Est. 2020 · Kuala Lumpur' },
        ],
        ctaTitle: 'Find your ritual.',
        ctaLede: 'Start with the cleanser. Build from there.',
        ctaButton: 'Shop the collection',
      },
      render: (props) => <About {...props} />,
    },
  },
}
