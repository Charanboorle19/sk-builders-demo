import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import bgPaper from '../assets/bg-image-2.png'
import journeyLand from '../assets/journey-land.png'
import journeyBuild from '../assets/journey-build.png'
import journeyLiving from '../assets/journey-living.png'
import offerLand from '../assets/offer-land.png'
import offerProperties from '../assets/offer-properties.png'
import offerHomes from '../assets/offer-homes.png'
import offerBuild from '../assets/offer-build.png'
import FeaturedProperties from '../components/FeaturedProperties/FeaturedProperties'
import WhySKBuilders from '../components/WhySKBuilders/WhySKBuilders'
import Gallery from '../components/Gallery/Gallery'
import FaqSection from '../components/FaqSection/FaqSection'
import ContactCta from '../components/ContactCta/ContactCta'
import { siteConfig } from '../config/site'
import { applyTheme, getStoredTheme, THEME_OPTIONS } from '../theme'
import './Demo2Page.css'

const STAGES = [
  {
    id: 'land',
    label: 'Land',
    highlight: 'The Land.',
    image: journeyLand,
    specs: [
      { icon: 'plot', text: '200 SQ YDS' },
      { icon: 'compass', text: 'WEST FACING' },
      { icon: 'road', text: '30 FT ROAD' },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    highlight: 'The House.',
    image: journeyBuild,
    specs: [
      { icon: 'structure', text: 'RCC STRUCTURE' },
      { icon: 'brick', text: 'PREMIUM MATERIALS' },
      { icon: 'clock', text: 'TIMELY EXECUTION' },
    ],
  },
  {
    id: 'property',
    label: 'Property',
    highlight: 'The Property.',
    image: journeyLiving,
    specs: [
      { icon: 'area', text: 'BUILT-UP AREA 3,600 SQ FT' },
      { icon: 'bed', text: '3 BHK' },
      { icon: 'car', text: '2 CAR PARKING' },
    ],
  },
]

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Featured', to: '#featured-properties' },
  { label: 'Why SK', to: '#why-sk-builders' },
  { label: 'Gallery', to: '#gallery' },
  { label: 'FAQ', to: '#faq' },
  { label: 'Contact', to: '#contact' },
  { label: 'Properties', to: '/properties' },
  { label: 'About Us', to: '/#about' },
  { label: 'Our Process', to: '/#process' },
]

const OFFER_CATEGORIES = [
  {
    id: 'land',
    index: '01',
    title: 'Land',
    label: 'LAND',
    tagline: 'Buy or sell residential plots.',
    description:
      'Looking for the right plot, or ready to sell one? We help you find, evaluate, and close on land across South Hyderabad.',
    cta: 'Explore Land',
    to: '/properties',
    image: offerLand,
  },
  {
    id: 'properties',
    index: '02',
    title: 'Properties',
    label: 'PROPERTIES',
    tagline: 'Buy or sell existing properties.',
    description:
      'From resale homes to investment properties, we connect buyers and sellers with transparent pricing and local expertise.',
    cta: 'Explore Properties',
    to: '/properties',
    image: offerProperties,
  },
  {
    id: 'homes',
    index: '03',
    title: 'Homes',
    label: 'HOMES',
    tagline: 'Independent G+2 / G+3 homes for sale.',
    description:
      'Move-in-ready or under-construction homes, thoughtfully planned and built for families who want to own outright.',
    cta: 'Explore Homes',
    to: '/properties',
    image: offerHomes,
  },
  {
    id: 'build',
    index: '04',
    title: 'Build',
    label: 'BUILD',
    tagline: 'Construction & development services.',
    description:
      'Already own land? We handle RCC construction end-to-end — from foundation to handover — with quality materials and on-time execution.',
    cta: 'Talk to Us',
    to: '/#contact',
    image: offerBuild,
  },
]

function SpecIcon({ type }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (type) {
    case 'plot':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" />
          <path d="M4 12h16M12 4v16" />
        </svg>
      )
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" />
        </svg>
      )
    case 'road':
      return (
        <svg {...common}>
          <path d="M8 4h8l2 16H6z" />
          <path d="M12 4v3M12 11v2M12 17v3" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-5h4v5" />
        </svg>
      )
    case 'bed':
      return (
        <svg {...common}>
          <path d="M3 18V9h7a4 4 0 0 1 8 0h3v9" />
          <path d="M3 14h18" />
        </svg>
      )
    case 'car':
      return (
        <svg {...common}>
          <path d="M4 15h16l-1.5-5.5A2 2 0 0 0 16.6 8H7.4a2 2 0 0 0-1.9 1.5z" />
          <circle cx="7.5" cy="16.5" r="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" />
        </svg>
      )
    case 'structure':
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M12 4v16M4 12h16" />
        </svg>
      )
    case 'brick':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="8" height="5" />
          <rect x="13" y="5" width="8" height="5" />
          <rect x="7" y="12" width="10" height="5" />
          <path d="M3 20h18" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </svg>
      )
    case 'area':
      return (
        <svg {...common}>
          <path d="M4 20V9l8-5 8 5v11" />
          <path d="M9 20v-6h6v6" />
        </svg>
      )
    default:
      return null
  }
}

export default function Demo2Page() {
  const [activeStrip, setActiveStrip] = useState(0)
  const [activeOffer, setActiveOffer] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => getStoredTheme())
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const themePickerRef = useRef(null)
  const activeCategory = OFFER_CATEGORIES[activeOffer]
  const activeThemeOption =
    THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0]

  const closeMenu = () => setMenuOpen(false)

  const onSelectTheme = (nextTheme) => {
    setTheme(applyTheme(nextTheme))
    setThemeMenuOpen(false)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStrip((current) => (current + 1) % STAGES.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [activeStrip])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveOffer((current) => (current + 1) % OFFER_CATEGORIES.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [activeOffer])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!themeMenuOpen) return undefined
    const onPointerDown = (event) => {
      if (!themePickerRef.current?.contains(event.target)) {
        setThemeMenuOpen(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setThemeMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [themeMenuOpen])

  const renderThemeOptions = (onPick) =>
    THEME_OPTIONS.map((option) => {
      const isActive = option.id === theme
      return (
        <button
          key={option.id}
          type="button"
          role="option"
          aria-selected={isActive}
          className={`d2-theme-picker__option${isActive ? ' is-active' : ''}`}
          onClick={() => onPick(option.id)}
        >
          <span className="d2-theme-picker__option-swatches" aria-hidden="true">
            <span style={{ background: option.swatchA }} />
            <span style={{ background: option.swatchB }} />
          </span>
          <span className="d2-theme-picker__option-label">{option.label}</span>
          {isActive && <span className="d2-theme-picker__check" aria-hidden="true" />}
        </button>
      )
    })

  const themePickerNav = (
    <div
      className={`d2-theme-picker${themeMenuOpen ? ' is-open' : ''}`}
      ref={themePickerRef}
    >
      <button
        type="button"
        className="d2-theme-picker__button"
        aria-haspopup="listbox"
        aria-expanded={themeMenuOpen}
        aria-label="Choose color palette"
        title="Color palette"
        onClick={() => setThemeMenuOpen((open) => !open)}
      >
        <span
          className="d2-theme-picker__swatch d2-theme-picker__swatch--a"
          style={{ background: activeThemeOption.swatchA }}
          aria-hidden="true"
        />
        <span
          className="d2-theme-picker__swatch d2-theme-picker__swatch--b"
          style={{ background: activeThemeOption.swatchB }}
          aria-hidden="true"
        />
      </button>

      <div
        className="d2-theme-picker__menu"
        role="listbox"
        aria-label="Color palettes"
        hidden={!themeMenuOpen}
      >
        {renderThemeOptions(onSelectTheme)}
      </div>
    </div>
  )

  const themePickerMenu = (
    <div className="d2-theme-picker d2-theme-picker--menu" role="listbox" aria-label="Color palettes">
      <p className="d2-theme-picker__heading">Color palette</p>
      {renderThemeOptions((nextTheme) => {
        onSelectTheme(nextTheme)
        closeMenu()
      })}
    </div>
  )

  return (
    <div className={`d2${menuOpen ? ' is-menu-open' : ''}`}>
      <header className="d2-top">
        <Link className="d2-brand" to="/" onClick={closeMenu}>
          SK BUILDERS
        </Link>

        <nav className="d2-nav" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} className="d2-nav__link" to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="d2-top__actions">
          {themePickerNav}

          <Link className="d2-btn d2-btn--solid d2-top__cta" to="#contact">
            Talk to us →
          </Link>

          <button
            type="button"
            className={`d2-top__menu${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="d2-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="d2-mobile-menu"
        className={`d2-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="d2-menu__nav" aria-label="Mobile">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              className="d2-menu__link"
              to={item.to}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className="d2-btn d2-btn--solid d2-menu__cta"
          to="#contact"
          onClick={closeMenu}
        >
          Talk to us →
        </Link>
        {themePickerMenu}
      </div>

      <section
        className="d2-hero"
        aria-label="SK Builders hero"
        style={{ '--d2-hero-paper': `url(${bgPaper})` }}
      >
        <div className="d2-hero__content">
          <div className="d2-hero__intro">
            <p className="d2-eyebrow">Real Estate Developer · South Hyderabad</p>

            <h1 className="d2-headline">
              <span className="d2-headline__line">Your Complete</span>
              <span className="d2-headline__line">
                Real Estate <span className="d2-headline__line--accent">Partner.</span>
              </span>
            </h1>

            <ul className="d2-services" aria-label="Our services">
              <li>Land</li>
              <li>Properties</li>
              <li>Homes</li>
              <li>Construction</li>
            </ul>

            <p className="d2-sub">
              We buy and sell land, deal in properties, build independent homes, and handle
              construction — South Hyderabad&apos;s real estate partner for every need.
            </p>
          </div>

          <div className="d2-hero__ctas">
            <Link className="d2-btn d2-btn--solid d2-btn--lg" to="/properties">
              Explore properties →
            </Link>
            <Link className="d2-btn d2-btn--ghost d2-btn--lg" to="#contact">
              Talk to us
            </Link>
          </div>

          <dl className="d2-metrics">
            <div className="d2-metrics__item">
              <dt>34+</dt>
              <dd>Families</dd>
            </div>
            <div className="d2-metrics__item">
              <dt>5+</dt>
              <dd>Years</dd>
            </div>
            <div className="d2-metrics__item">
              <dt>South</dt>
              <dd>Hyderabad</dd>
            </div>
          </dl>
        </div>

        <div className="d2-hero__media">
          <aside className="d2-journey" aria-label="Property journey from land to living">
            <div className="d2-journey__panel">
              <div className="d2-journey__strips">
                {STAGES.map((item, index) => (
                  <article
                    key={item.id}
                    className={`d2-strip${index === activeStrip ? ' is-active' : ''}`}
                    onClick={() => setActiveStrip(index)}
                  >
                    <div className="d2-strip__media">
                      <img src={item.image} alt="" />
                    </div>
                    {index === activeStrip ? (
                      <p className="d2-strip__highlight">
                        <span className="d2-strip__highlight-kicker">The</span>
                        <span className="d2-strip__highlight-word">
                          {item.highlight.replace(/^The\s+/i, '')}
                        </span>
                      </p>
                    ) : null}
                    <div className="d2-strip__foot">
                      <p className="d2-strip__label">{item.label}</p>
                      <ul className="d2-strip__specs">
                        {item.specs.map((spec) => (
                          <li key={spec.text}>
                            <span className="d2-strip__icon">
                              <SpecIcon type={spec.icon} />
                            </span>
                            <span>{spec.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
              <div className="d2-journey__dots" aria-hidden="true">
                {STAGES.map((item, index) => (
                  <button
                    key={`${item.id}-dot`}
                    type="button"
                    className={`d2-journey__dot${index === activeStrip ? ' is-active' : ''}`}
                    aria-label={`Show ${item.label}`}
                    onClick={() => setActiveStrip(index)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="d2-offer" id="offer" aria-labelledby="d2-offer-heading">
        <div className="d2-offer__shade" aria-hidden="true" />

        <div className="d2-offer__inner">
          <div className="d2-offer__stage">
            <div className="d2-offer__copy">
              <header className="d2-offer__header">
                <p className="d2-offer__eyebrow">WHAT WE DO</p>
                <h2 className="d2-headline d2-offer__heading" id="d2-offer-heading">
                  <span className="d2-headline__line">Land. Properties. Homes.</span>
                  <span className="d2-headline__line">
                    <span className="d2-headline__line--accent">Construction.</span>
                  </span>
                </h2>
                <p className="d2-offer__lead">
                  Four ways we help you own property in South Hyderabad — buy it, sell it, or build
                  it.
                </p>
              </header>

              <ul className="d2-offer__nav" aria-label="What we do categories">
                {OFFER_CATEGORIES.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`d2-offer__nav-btn${index === activeOffer ? ' is-active' : ''}`}
                      onClick={() => setActiveOffer(index)}
                      aria-current={index === activeOffer ? 'true' : undefined}
                    >
                      <span className="d2-offer__nav-index">{item.index}</span>
                      <span className="d2-offer__nav-main">
                        <span className="d2-offer__nav-label">{item.label}</span>
                        <span className="d2-offer__nav-tagline">{item.tagline}</span>
                      </span>
                      <span className="d2-offer__nav-thumb">
                        <img src={item.image} alt="" />
                      </span>
                      {index === activeOffer ? (
                        <span
                          className="d2-offer__nav-progress"
                          key={`progress-${item.id}-${activeOffer}`}
                        />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d2-offer__feature" key={activeCategory.id}>
              <div className="d2-offer__media">
                <img src={activeCategory.image} alt="" />
              </div>
              <div className="d2-offer__detail">
                <p className="d2-offer__counter">
                  {activeCategory.index} <span>/ 04</span>
                </p>
                <h3 className="d2-offer__title">{activeCategory.title}</h3>
                <p className="d2-offer__tagline">{activeCategory.tagline}</p>
                <p className="d2-offer__desc">{activeCategory.description}</p>
                <Link className="d2-offer__cta" to={activeCategory.to}>
                  {activeCategory.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProperties />
      <WhySKBuilders />
      <Gallery />
      <FaqSection />
      <ContactCta />

      <a
        className="d2-whatsapp"
        href={`https://wa.me/${siteConfig.WHATSAPP_NUMBER}?text=${encodeURIComponent(
          siteConfig.WHATSAPP_PREFILL,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SK Builders on WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16.01 3.2c-7.05 0-12.78 5.72-12.78 12.77 0 2.25.6 4.45 1.73 6.38L3.2 28.8l6.67-1.72a12.74 12.74 0 0 0 6.14 1.56h.01c7.05 0 12.78-5.73 12.78-12.78S23.06 3.2 16.01 3.2zm0 23.3c-1.93 0-3.82-.51-5.48-1.48l-.39-.23-3.96 1.02 1.05-3.86-.25-.4a10.5 10.5 0 0 1-1.61-5.58c0-5.8 4.72-10.52 10.53-10.52 5.8 0 10.52 4.72 10.52 10.52-.01 5.81-4.73 10.53-10.41 10.53zm5.77-7.88c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.45.21 2 .12.61-.1 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37z"
          />
        </svg>
      </a>
    </div>
  )
}
