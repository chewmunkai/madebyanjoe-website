import '../styles/page-legal.css'
import { useEffect, useRef, useState } from 'react'

/* Privacy & Terms — real policy text from madebyanjoe.com, structured for
   readability. Content belongs to Medicircle Holding Sdn Bhd.

   Redesign (Wave 6): a two-column editorial legal layout — a sticky in-page
   section index (scrollspy) on the left, long-form reading typography on the
   right, an oversized Fraunces title with a faded ghost numeral, and subtle
   per-block depth. Works identically for doc="privacy" and doc="terms". */

const PRIVACY = {
  eyebrow: 'Legal',
  h1: 'Privacy <em>policy</em>.',
  short: 'Privacy',
  lede:
    'How Medicircle Holding Sdn Bhd collects, processes and protects your personal data when you use madebyanjoe.com.',
  updated: 'Last updated · June 2026',
  blocks: [
    {
      h: 'Data controller & owner',
      p: [
        'Medicircle Holding Sdn Bhd (201701030879). For any information about your personal data, the purposes of processing, and the parties it is shared with, contact the data controller at hello@madebyanjoe.com.',
      ],
    },
    {
      h: 'Types of data collected',
      p: [
        'Personal data may be freely provided by you, or collected automatically when using this application. Cookies and other tracking tools — used by us or by third-party services — serve to identify users and remember their preferences for the sole purpose of providing the requested service.',
        'Failure to provide certain personal data may make it impossible for the application to provide its services. You assume responsibility for any third-party personal data published or shared through this application.',
      ],
    },
    {
      h: 'Mode & place of processing',
      p: [
        'The data controller processes your data properly and takes appropriate security measures to prevent unauthorised access, disclosure, modification or destruction. Processing is carried out using computers and IT tools, following organisational procedures strictly related to the stated purposes.',
        'In some cases the data may be accessible to people involved in operating the site (administration, sales, marketing, legal, system administration) or to external parties (technical service providers, mail carriers, hosting providers, IT companies) appointed as data processors. The data is processed at the controller’s operating offices and any other place where the parties involved are located.',
      ],
    },
    {
      h: 'Retention time',
      p: [
        'Data is kept for the time necessary to provide the requested service, or as stated by the purposes outlined here. You can always request that the controller suspend or remove your data.',
      ],
    },
    {
      h: 'Your rights',
      p: [
        'You have the right, at any time, to know whether your personal data has been stored and to consult the controller about its contents and origin; to verify its accuracy or ask for it to be supplemented, cancelled, updated or corrected; or to oppose its processing for legitimate reasons. Requests should be sent to hello@madebyanjoe.com.',
        'This application does not support “Do Not Track” requests; please review the privacy policies of any third-party services to determine whether they honour them.',
      ],
    },
    {
      h: 'Cookies & advertising',
      p: [
        'As you browse madebyanjoe.com, advertising cookies may be placed on your device so we can understand your interests. Display-advertising partners (Facebook, Instagram, Google) then enable retargeting on other sites based on your interaction with madebyanjoe.com. These techniques do not collect personal information such as your name, postal address or telephone number; you can opt out via the partners’ pages.',
      ],
    },
    {
      h: 'Changes & contact',
      p: [
        'The controller may change this policy at any time by giving notice on this page — please check it often. If you object to any change you must cease using the application and may request erasure of your personal data.',
        'For more information about our privacy practices, questions or complaints, contact us at hello@madebyanjoe.com.',
      ],
    },
  ],
}

const TERMS = {
  eyebrow: 'Legal',
  h1: 'Terms of <em>service</em>.',
  short: 'Terms',
  lede:
    'The terms on which Medicircle Holding Sdn Bhd offers madebyanjoe.com and its products. By using the site or buying from us, you agree to them.',
  updated: 'Last updated · June 2026',
  blocks: [
    {
      h: 'Overview',
      p: [
        'This website is operated by Medicircle Holding Sdn Bhd (“we”, “us”, “our”). By visiting the site and/or purchasing from us you engage in our “Service” and agree to be bound by these Terms of Service, including the additional terms and policies referenced here. Please read them carefully — if you do not agree, you may not access the site or use any service. Our store is hosted on Appolous Sdn Bhd.',
      ],
    },
    {
      h: '1 · Online store terms',
      p: [
        'You represent that you are at least the age of majority in your state or province, or that you have given consent for any minor dependents to use this site. You may not use our products for any illegal or unauthorised purpose, nor transmit any worms, viruses or destructive code. A breach of any term results in immediate termination of your Services.',
      ],
    },
    {
      h: '2 · General conditions',
      p: [
        'We reserve the right to refuse service to anyone at any time. Your content (excluding credit-card information) may be transferred unencrypted over networks; credit-card information is always encrypted during transfer. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without our express written permission.',
      ],
    },
    {
      h: '3 · Accuracy of information',
      p: [
        'Material on this site is provided for general information only and should not be the sole basis for decisions. Any reliance on it is at your own risk. We may modify the contents at any time but have no obligation to update information.',
      ],
    },
    {
      h: '4 · Modifications to the service & prices',
      p: [
        'Prices are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part of it) at any time without notice, and shall not be liable for any modification, price change, suspension or discontinuance.',
      ],
    },
    {
      h: '5 · Products or services',
      p: [
        'Certain products may be available exclusively online in limited quantities, subject to return or exchange only per our Returns Policy. We have made every effort to display colours and images accurately but cannot guarantee your monitor’s display. We reserve the right to limit sales or quantities of any product on a case-by-case basis.',
      ],
    },
    {
      h: '6 · Billing & account information',
      p: [
        'We reserve the right to refuse, limit or cancel any order, including orders that appear to be placed by dealers, resellers or distributors. You agree to provide current, complete and accurate purchase and account information and to keep it updated so we can complete your transactions and contact you as needed.',
      ],
    },
    {
      h: '7–8 · Optional tools & third-party links',
      p: [
        'We may provide access to third-party tools “as is” and “as available” without warranties, and have no liability arising from their use. Third-party links may direct you to sites not affiliated with us; we are not responsible for their content or practices. Please review third parties’ policies before transacting.',
      ],
    },
    {
      h: '9 · User comments & submissions',
      p: [
        'If you send comments, ideas or suggestions, you agree we may edit, copy, publish, distribute and otherwise use them in any medium without restriction, confidentiality or compensation. Your comments must not violate any third-party right or contain unlawful, abusive, obscene or malicious material. You are solely responsible for any comments you make.',
      ],
    },
    {
      h: '10–12 · Personal information, errors & prohibited uses',
      p: [
        'Your submission of personal information is governed by our Privacy Policy. Occasionally the site may contain typographical errors or inaccuracies, which we may correct, and we may change information or cancel orders without prior notice. You are prohibited from using the site for any unlawful purpose, to infringe intellectual-property rights, to harass or discriminate, to submit false information, to upload malicious code, or to interfere with the site’s security.',
      ],
    },
    {
      h: '13–14 · Disclaimer & indemnification',
      p: [
        'We do not guarantee that the Service will be uninterrupted, timely, secure or error-free. The Service and all products are provided “as is” and “as available” without warranties of any kind. To the maximum extent permitted by law, Medicircle Holding Sdn Bhd is not liable for any direct, indirect, incidental, punitive or consequential damages arising from your use of the Service. You agree to indemnify and hold us harmless from any claim arising out of your breach of these Terms or your violation of any law or third-party right.',
      ],
    },
    {
      h: '15–17 · Severability, termination & entire agreement',
      p: [
        'If any provision is found unlawful or unenforceable, it is severed without affecting the remaining provisions. These Terms are effective until terminated by either party. These Terms, together with any policies posted on this site, constitute the entire agreement between you and us.',
      ],
    },
    {
      h: '18–19 · Changes & contact',
      p: [
        'We reserve the right to update or replace any part of these Terms by posting changes to this page; your continued use constitutes acceptance. Questions about the Terms of Service should be sent to hello@madebyanjoe.com.',
      ],
    },
  ],
}

const pad = (n) => String(n + 1).padStart(2, '0')
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function Legal({ doc = 'privacy' }) {
  const data = doc === 'terms' ? TERMS : PRIVACY
  const ids = data.blocks.map((b, i) => `${doc}-${i}-${slugify(b.h)}`)

  const [active, setActive] = useState(0)
  const blockRefs = useRef([])
  const linkRefs = useRef([])
  const railRef = useRef(null)

  // reset ref arrays when the doc switches (privacy <-> terms)
  blockRefs.current = []
  linkRefs.current = []

  // scrollspy — track the section nearest the top of the viewport
  useEffect(() => {
    const els = blockRefs.current.filter(Boolean)
    if (!els.length) return

    const headerOffset = 140
    const compute = () => {
      let idx = 0
      for (let i = 0; i < els.length; i++) {
        if (els[i].getBoundingClientRect().top - headerOffset <= 1) idx = i
      }
      setActive(idx)
    }

    // IntersectionObserver drives recomputation cheaply; compute() resolves the
    // exact top-most section (robust under Lenis smooth scroll).
    const io = new IntersectionObserver(compute, {
      rootMargin: `-${headerOffset}px 0px -55% 0px`,
      threshold: [0, 1],
    })
    els.forEach((el) => io.observe(el))
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    compute()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [doc])

  // move the index rail to the active link
  useEffect(() => {
    const link = linkRefs.current[active]
    const rail = railRef.current
    if (!link || !rail) return
    rail.style.height = `${link.offsetHeight}px`
    rail.style.transform = `translateY(${link.offsetTop}px)`
  }, [active, doc])

  const goTo = (i) => {
    const el = blockRefs.current[i]
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActive(i)
  }

  return (
    <>
      <header className="legalx-hero">
        <div className="legalx-hero__wash" aria-hidden="true" />
        <span className="legalx-hero__ghost" aria-hidden="true">
          {data.short}
        </span>
        <div className="container">
          <p className="legalx-hero__meta">
            <span className="eyebrow">{data.eyebrow}</span>
            <span className="legalx-hero__owner">
              <b>Medicircle Holding Sdn Bhd</b>
              <i className="legalx-hero__seal" aria-hidden="true" />
              madebyanjoe.com
            </span>
            <span className="legalx-hero__doctype" aria-hidden="true">
              {data.short === 'Privacy' ? 'P' : 'T'} / {data.blocks.length} clauses
            </span>
          </p>
          <h1 dangerouslySetInnerHTML={{ __html: data.h1 }} />
          <p className="lede">{data.lede}</p>
          <div className="legalx-hero__rule" aria-hidden="true">
            <span className="legalx-hero__rulemark">§</span>
          </div>
        </div>
      </header>

      <section className="section container">
        <div className="legalx">
          <nav className="legalx-index glass" aria-label="Document sections">
            <p className="legalx-index__label">
              <span>Index</span>
              <span className="legalx-index__count" aria-hidden="true">
                {pad(active)} / {pad(data.blocks.length - 1)}
              </span>
            </p>
            <ul className="legalx-index__list">
              <span className="legalx-index__rail" ref={railRef} aria-hidden="true" />
              {data.blocks.map((b, i) => (
                <li key={ids[i]}>
                  <button
                    type="button"
                    className={
                      'legalx-index__link' + (active === i ? ' is-active' : '')
                    }
                    ref={(el) => (linkRefs.current[i] = el)}
                    onClick={() => goTo(i)}
                    aria-current={active === i ? 'true' : undefined}
                  >
                    <span className="legalx-index__num" aria-hidden="true">
                      {pad(i)}
                    </span>
                    <span>{b.h}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="legalx-doc">
            <p className="legalx-doc__updated">{data.updated}</p>

            {data.blocks.map((b, i) => (
              <article
                className={
                  'legalx-block glass reveal' +
                  (active === i ? ' is-current' : '')
                }
                id={ids[i]}
                key={ids[i]}
                ref={(el) => (blockRefs.current[i] = el)}
              >
                <span className="legalx-block__folio" aria-hidden="true">
                  §&thinsp;{pad(i)}
                </span>
                <div className="legalx-block__head">
                  <span className="legalx-block__num" aria-hidden="true">
                    {pad(i)}
                  </span>
                  <h2>{b.h}</h2>
                </div>
                {b.p.map((para, j) => (
                  <p key={j} className={j === 0 ? 'legalx-block__lead' : undefined}>
                    {para}
                  </p>
                ))}
              </article>
            ))}

            <p className="legalx-doc__colophon">
              <span className="legalx-doc__colophon-mark" aria-hidden="true" />
              <span>© 2026 Medicircle Holding Sdn Bhd</span>
              <span className="legalx-doc__colophon-reg">201701030879</span>
              <span>All rights reserved.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
