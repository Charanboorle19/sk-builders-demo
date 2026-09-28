import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import imgPricing from '../../assets/transparent pricing.png'
import imgHmda from '../../assets/hmda approved.png'
import imgFamilies from '../../assets/families.png'
import imgSupport from '../../assets/contact support.png'
import './WhySKBuilders.css'

const TRUST_ITEMS = [
  {
    id: 'pricing',
    index: '01',
    label: 'PRICING',
    title: 'Transparent Pricing',
    tagline: 'Clear numbers. No surprises.',
    description:
      'Every cost is explained upfront — so you know exactly what you are paying for, with no unnecessary surprises along the way.',
    cta: 'Talk to Us',
    to: '/#contact',
    image: imgPricing,
  },
  {
    id: 'hmda',
    index: '02',
    label: 'HMDA',
    title: 'HMDA Approved Plots',
    tagline: 'Approval and documentation first.',
    description:
      'Properties are selected with approvals and paperwork in focus, so you can move forward with confidence on every plot.',
    cta: 'Explore Properties',
    to: '/properties',
    image: imgHmda,
  },
  {
    id: 'experience',
    index: '03',
    label: 'EXPERIENCE',
    title: '5+ Years · 34+ Families',
    tagline: 'Local experience that lasts.',
    description:
      'Years of local work across South Hyderabad — and dozens of families guided from first visit to keys in hand.',
    cta: 'About SK Builders',
    to: '/#about',
    image: imgFamilies,
  },
  {
    id: 'support',
    index: '04',
    label: 'SUPPORT',
    title: 'End-to-End Support',
    tagline: 'Land. Property. Construction.',
    description:
      'Guidance across buying land, choosing property, and building — one team with you at every stage of the journey.',
    cta: 'Start a Conversation',
    to: '/#contact',
    image: imgSupport,
  },
]

const ROTATE_MS = 4500

export default function WhySKBuilders() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = TRUST_ITEMS[activeIndex]

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % TRUST_ITEMS.length)
    }, ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [activeIndex])

  return (
    <section className="d2-why" id="why-sk-builders" aria-labelledby="d2-why-heading">
      <div className="d2-why__shade" aria-hidden="true" />

      <div className="d2-why__inner">
        <div className="d2-why__stage">
          <div className="d2-why__copy">
            <header className="d2-why__header">
              <p className="d2-why__eyebrow">Why SK Builders</p>
              <h2 id="d2-why-heading" className="d2-headline d2-why__heading">
                <span className="d2-headline__line">Built on trust.</span>
                <span className="d2-headline__line">
                  Backed by <span className="d2-headline__line--accent">experience.</span>
                </span>
              </h2>
              <p className="d2-why__lead">
                From choosing the right property to building it, we keep the process
                clear, practical and straightforward.
              </p>
            </header>

            <ul className="d2-why__nav" aria-label="Why SK Builders points">
              {TRUST_ITEMS.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`d2-why__nav-btn${index === activeIndex ? ' is-active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-current={index === activeIndex ? 'true' : undefined}
                  >
                    <span className="d2-why__nav-index">{item.index}</span>
                    <span className="d2-why__nav-main">
                      <span className="d2-why__nav-label">{item.label}</span>
                      <span className="d2-why__nav-tagline">{item.tagline}</span>
                    </span>
                    <span className="d2-why__nav-thumb">
                      <img src={item.image} alt="" />
                    </span>
                    {index === activeIndex ? (
                      <span
                        className="d2-why__nav-progress"
                        key={`progress-${item.id}-${activeIndex}`}
                      />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="d2-why__feature" key={active.id}>
            <div className="d2-why__media">
              <img src={active.image} alt="" />
              <span className="d2-why__media-index" aria-hidden="true">
                {active.index}
              </span>
            </div>
            <div className="d2-why__detail">
              <p className="d2-why__counter">
                {active.index} <span>/ 04</span>
              </p>
              <h3 className="d2-why__title">{active.title}</h3>
              <p className="d2-why__tagline">{active.tagline}</p>
              <p className="d2-why__desc">{active.description}</p>
              <Link className="d2-why__cta" to={active.to}>
                {active.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
