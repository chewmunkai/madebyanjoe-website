import SiteChrome from './SiteChrome.jsx'
import { DEFAULT_NAV_LINKS, DEFAULT_JOURNAL_URL } from '../components/Nav.jsx'
import { DEFAULT_FOOTER_TAGLINE, DEFAULT_FOOTER_COLUMNS, DEFAULT_COPYRIGHT, DEFAULT_SOCIALS } from '../components/Footer.jsx'

const text = (label) => ({ type: 'text', label })
const area = (label) => ({ type: 'textarea', label })
const list = (label, arrayFields, getItemSummary) => ({ type: 'array', label, arrayFields, getItemSummary })

/* Editor config for the global header + footer. Single "Header & footer" block. */
export const siteConfig = {
  components: {
    SiteChrome: {
      label: 'Header & footer',
      fields: {
        navLinks: list('Header links', {
          label: text('Label'),
          to: text('Path'),
          hide: { type: 'select', label: 'Show', options: [
            { label: 'Always', value: '' },
            { label: 'Hide on small', value: 'nav__hide-sm' },
            { label: 'Hide on medium', value: 'nav__hide-md' },
          ] },
        }, (l) => l?.label || 'Link'),
        journalUrl: text('Journal URL'),
        footerTagline: area('Footer tagline'),
        footerColumns: list('Footer columns', {
          h: text('Heading'),
          links: list('Links', { label: text('Label'), to: text('Internal path'), href: text('External URL') }, (l) => l?.label || 'Link'),
        }, (c) => c?.h || 'Column'),
        copyright: text('Copyright'),
        socials: list('Social links', { label: text('Label'), href: text('URL') }, (s) => s?.label || 'Social'),
      },
      defaultProps: {
        navLinks: DEFAULT_NAV_LINKS,
        journalUrl: DEFAULT_JOURNAL_URL,
        footerTagline: DEFAULT_FOOTER_TAGLINE,
        footerColumns: DEFAULT_FOOTER_COLUMNS,
        copyright: DEFAULT_COPYRIGHT,
        socials: DEFAULT_SOCIALS,
      },
      render: (props) => <SiteChrome {...props} />,
    },
  },
}
