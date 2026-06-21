# Anjoe — Homepage manifest

The homepage's editable surface, declared as data. The studio compiles this into the
editor automatically (`compileManifest`), and `PageView` renders the published layout
from it. Field STRUCTURE + section order live here; the verbatim content defaults live
in `home.js` (a migrated design). New designs put their content inline as `default:`.

```yaml
design: home
label: Homepage
slug: home
route: /

sections:
  - id: hero
    component: EditorialHero
    label: Hero
    editorOverrides: { motionless: true }
    fields:
      - { name: rail,         type: text,     label: 'Rail label' }
      - { name: titleLine1,   type: text,     label: 'Title — line 1' }
      - { name: titleLine2,   type: text,     label: 'Title — line 2 (italic)' }
      - { name: lede,         type: textarea, label: 'Subtext' }
      - { name: ctaPrimary,   type: text,     label: 'Primary button' }
      - { name: ctaSecondary, type: text,     label: 'Secondary link' }
      - name: background
        type: select
        label: 'Background'
        options:
          - { label: 'Video (YouTube)', value: 'youtube' }
          - { label: 'Video (upload)',  value: 'upload' }
          - { label: 'Image (upload)',  value: 'image' }
          - { label: 'None — type only', value: 'none' }
      - { name: youtubeId, type: text,  label: 'YouTube video ID' }
      - { name: media,     type: media, label: 'Uploaded image / video' }
      - { name: animation, type: toggle, label: 'Intro animation' }

  - id: press
    component: PressBar
    label: 'Press bar'
    fields:
      - { name: eyebrow, type: text, label: 'Eyebrow' }
      - name: credentials
        type: list
        label: 'Credentials'
        itemLabel: '{label}'
        itemFallback: 'Credential'
        fields:
          - { name: label, type: text, label: 'Text' }
      - { name: reveal, type: toggle, label: 'Intro animation' }

  - id: science
    component: DiveInScience
    label: 'Dive-in science'
    editorOverrides: { animation: 'off' }
    fields:
      - { name: eyebrow, type: text, label: 'Eyebrow' }
      - { name: titleA,  type: text, label: 'Title — before italic' }
      - { name: titleEm, type: text, label: 'Title — italic word' }
      - { name: titleB,  type: text, label: 'Title — after italic' }
      - { name: ctaText, type: text, label: 'Link text' }
      - { name: ctaHref, type: text, label: 'Link URL' }
      - { name: animation, type: toggle, label: 'Scroll animation' }
      - name: chapters
        type: list
        label: 'Scroll chapters'
        itemLabel: '{t}'
        itemFallback: 'Chapter'
        fields:
          - { name: i,    type: text,     label: 'Number' }
          - { name: t,    type: text,     label: 'Title' }
          - { name: d,    type: textarea, label: 'Description' }
          - { name: slug, type: 'product-ref', label: 'Product slug' }

  - id: bestsellers
    component: BestsellerCarousel
    label: 'Bestsellers'
    fields:
      - { name: eyebrow,     type: text, label: 'Eyebrow' }
      - { name: title,       type: text, label: 'Title' }
      - { name: viewAllText, type: text, label: '"View all" text' }
      - { name: viewAllHref, type: text, label: '"View all" URL' }
      - { name: reveal,      type: toggle, label: 'Intro animation' }
      - name: products
        type: list
        label: 'Products'
        itemLabel: '{slug}'
        itemFallback: 'Product'
        fields:
          - { name: slug,   type: 'product-ref', label: 'Product slug' }
          - { name: rating, type: number, label: 'Rating' }
          - { name: count,  type: number, label: 'Review count' }

  - id: featureduo
    component: FeatureDuo
    label: 'Feature duo'
    fields:
      - { name: f1Eyebrow, type: text,  label: 'Card 1 — eyebrow' }
      - { name: f1Title,   type: text,  label: 'Card 1 — title' }
      - { name: f1Slug,    type: text,  label: 'Card 1 — product slug' }
      - { name: f1Image,   type: media, label: 'Card 1 — image override' }
      - { name: f2Eyebrow, type: text,  label: 'Card 2 — eyebrow' }
      - { name: f2Title,   type: text,  label: 'Card 2 — title' }
      - { name: f2Slug,    type: text,  label: 'Card 2 — product slug' }
      - { name: f2Image,   type: media, label: 'Card 2 — image override' }
      - { name: ctaText,   type: text,  label: 'Button text' }
      - { name: reveal,    type: toggle, label: 'Intro animation' }

  - id: reels
    component: ReelsGallery
    label: 'Reels gallery'
    fields:
      - { name: eyebrow,    type: text,     label: 'Eyebrow' }
      - { name: heading,    type: text,     label: 'Heading' }
      - { name: followText, type: text,     label: 'Follow link text' }
      - { name: followHref, type: text,     label: 'Follow link URL' }
      - { name: igEyebrow,  type: text,     label: 'Instagram eyebrow' }
      - { name: igSub,      type: textarea, label: 'Instagram subtext' }
      - { name: reveal,     type: toggle,   label: 'Intro animation' }
      - name: videos
        type: list
        label: 'Featured videos'
        itemLabel: '{title}'
        itemFallback: 'Video'
        fields:
          - { name: id,    type: text, label: 'YouTube ID' }
          - { name: title, type: text, label: 'Title' }
          - { name: slug,  type: 'product-ref', label: 'Product slug' }
      - name: reels
        type: list
        label: 'Instagram reels'
        itemLabel: '{id}'
        itemFallback: 'Reel'
        fields:
          - { name: id, type: text, label: 'Reel shortcode' }

  - id: reviews
    component: Reviews
    label: 'Reviews'
    fields:
      - { name: eyebrow, type: text, label: 'Eyebrow' }
      - { name: title,   type: text, label: 'Title' }
      - { name: sub,     type: text, label: 'Subtext' }
      - { name: reveal,  type: toggle, label: 'Intro animation' }
      - name: testimonials
        type: list
        label: 'Testimonials'
        itemLabel: 'Testimonial {#}'
        fields:
          - { name: image, type: media, label: 'Image' }

  - id: newsletter
    component: Newsletter
    label: 'Newsletter'
    fields:
      - { name: eyebrow,    type: text,     label: 'Eyebrow' }
      - { name: headingA,   type: text,     label: 'Heading — before italic' }
      - { name: headingEm,  type: text,     label: 'Heading — italic' }
      - { name: headingB,   type: text,     label: 'Heading — after italic' }
      - { name: lede,       type: textarea, label: 'Subtext' }
      - { name: cta,        type: text,     label: 'Button text' }
      - { name: placeholder, type: text,    label: 'Input placeholder' }
      - { name: successText, type: text,    label: 'Success message' }
```
