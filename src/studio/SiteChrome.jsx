import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'

/* Studio preview for the global header + footer. Shows them with the edited content
   so the client can edit links/copy in /studio → "Header & footer". The LIVE header
   and footer (rendered in App) read the same published 'site' props. */
export default function SiteChrome(props) {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: 80 }}>
      <Nav {...props} />
      <div style={{ flex: 1 }} />
      <Footer {...props} />
    </div>
  )
}
