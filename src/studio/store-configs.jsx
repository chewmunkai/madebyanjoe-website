import Shop, { DEFAULT_ZONES } from '../pages/Shop.jsx'
import ProductSettings from './ProductSettings.jsx'
import { DEFAULT_PRODUCT_SETTINGS } from '../pages/Product.jsx'

const text = (label) => ({ type: 'text', label })
const area = (label) => ({ type: 'textarea', label })
const list = (label, arrayFields, getItemSummary) => ({ type: 'array', label, arrayFields, getItemSummary })
const wrap = (key) => (arr) => (arr || []).map((v) => ({ [key]: v }))

export const shopConfig = {
  components: {
    ShopPage: {
      label: 'Shop page',
      fields: {
        hiddenTitle: text('Page title (screen-reader)'),
        filterLabel: text('Filter label'),
        emptyMessage: text('Empty-filter message'),
        zones: list('Zone headings', {
          key: text('Group key'), idx: text('Number'), kind: text('Kind label'),
          titleA: text('Title — before italic'), titleEm: text('Title — italic'), titleB: text('Title — after italic'),
        }, (z) => z?.kind || 'Zone'),
      },
      defaultProps: {
        hiddenTitle: 'Shop — the ANJOE collection',
        filterLabel: 'Filter',
        emptyMessage: 'Nothing here yet — try another filter.',
        zones: DEFAULT_ZONES,
      },
      render: (props) => <Shop {...props} />,
    },
  },
}

export const productConfig = {
  components: {
    ProductSettings: {
      label: 'Product template',
      fields: {
        ratingText: text('Rating line'),
        trust: list('Trust badges', { label: text('Badge') }, (i) => i?.label || 'Badge'),
        assurance: list('Assurances', { label: text('Line') }, (i) => i?.label || 'Line'),
        accordion: list('Info accordions', { q: text('Title'), a: area('Body') }, (i) => i?.q || 'Item'),
        ritualEyebrow: text('Ritual — eyebrow'),
        ritualTitleA: text('Ritual title — before italic'),
        ritualTitleEm: text('Ritual title — italic'),
        ritualTitleB: text('Ritual title — after italic'),
        notFoundEyebrow: text('404 — eyebrow'),
        notFoundTitle: text('404 — title'),
      },
      defaultProps: {
        ...DEFAULT_PRODUCT_SETTINGS,
        trust: wrap('label')(DEFAULT_PRODUCT_SETTINGS.trust),
        assurance: wrap('label')(DEFAULT_PRODUCT_SETTINGS.assurance),
      },
      render: (props) => <ProductSettings {...props} />,
    },
  },
}
