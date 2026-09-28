import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  GALLERY_FILTERS,
  GALLERY_ITEMS,
  GALLERY_PAGE_SIZE,
  filterGalleryItems,
  paginateGalleryItems,
} from '../../data/gallery'
import './Gallery.css'

function useInViewOnce() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return [ref, visible]
}

function useParallax(enabled) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const node = ref.current
    if (!node) return undefined

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const progress = (vh - rect.top) / (vh + rect.height)
        const offset = Math.max(-16, Math.min(16, (progress - 0.5) * 28))
        node.style.setProperty('--gal-parallax', `${offset.toFixed(2)}px`)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])

  return ref
}

function GalleryCard({ item, index, onOpen }) {
  const parallaxRef = useParallax(Boolean(item.parallax))

  return (
    <button
      type="button"
      className={`d2-gal__card d2-gal__card--${item.size}${item.parallax ? ' d2-gal__card--parallax' : ''}`}
      style={{ '--gal-stagger': `${index * 95}ms` }}
      onClick={() => onOpen(item.id)}
      aria-label={`${item.title}, ${item.locality}. View gallery image.`}
    >
      <div className="d2-gal__frame" ref={item.parallax ? parallaxRef : undefined}>
        <img
          className="d2-gal__img"
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="d2-gal__line" aria-hidden="true" />
        <span className="d2-gal__veil" aria-hidden="true" />
        <span className="d2-gal__meta">
          <span className="d2-gal__meta-title">{item.title}</span>
          <span className="d2-gal__meta-place">{item.locality}</span>
          <span className="d2-gal__meta-view">VIEW →</span>
        </span>
      </div>
    </button>
  )
}

function Lightbox({ items, activeId, onClose, onNavigate }) {
  const activeIndex = items.findIndex((item) => item.id === activeId)
  const active = items[activeIndex] || null
  const touchStart = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onNavigate(-1)
      if (event.key === 'ArrowRight') onNavigate(1)
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [active, onClose, onNavigate])

  if (!active) return null

  const categoryLabel =
    GALLERY_FILTERS.find((f) => f.id === active.category)?.label || active.category

  return (
    <div
      className="d2-gal__lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${active.title} — ${active.locality}`}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStart.current = event.changedTouches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const end = event.changedTouches[0]?.clientX
        if (start == null || end == null) return
        const delta = end - start
        if (Math.abs(delta) < 48) return
        onNavigate(delta > 0 ? -1 : 1)
      }}
    >
      <div
        className="d2-gal__lightbox-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="d2-gal__lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          ×
        </button>

        <button
          type="button"
          className="d2-gal__lightbox-nav d2-gal__lightbox-nav--prev"
          onClick={() => onNavigate(-1)}
          aria-label="Previous image"
        >
          ←
        </button>

        <figure className="d2-gal__lightbox-figure" key={active.id}>
          <img src={active.image} alt="" />
          <figcaption className="d2-gal__lightbox-caption">
            <p className="d2-gal__lightbox-cat">{categoryLabel}</p>
            <h3 className="d2-gal__lightbox-title">{active.title}</h3>
            <p className="d2-gal__lightbox-place">{active.locality}</p>
            <p className="d2-gal__lightbox-count">
              {activeIndex + 1} / {items.length}
            </p>
          </figcaption>
        </figure>

        <button
          type="button"
          className="d2-gal__lightbox-nav d2-gal__lightbox-nav--next"
          onClick={() => onNavigate(1)}
          aria-label="Next image"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [sectionRef, revealed] = useInViewOnce()
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [isFiltering, setIsFiltering] = useState(false)
  const [lightboxId, setLightboxId] = useState(null)
  const filterTimer = useRef(null)

  const filteredItems = useMemo(
    () => filterGalleryItems(GALLERY_ITEMS, filter),
    [filter],
  )

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / GALLERY_PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)

  const pageItems = useMemo(
    () => paginateGalleryItems(filteredItems, safePage),
    [filteredItems, safePage],
  )

  const hasNext = safePage < totalPages - 1
  const hasPrev = safePage > 0

  const changePage = useCallback((nextPage) => {
    setLightboxId(null)
    setIsFiltering(true)
    window.clearTimeout(filterTimer.current)
    filterTimer.current = window.setTimeout(() => {
      setPage(nextPage)
      requestAnimationFrame(() => setIsFiltering(false))
    }, 280)
  }, [])

  const applyFilter = useCallback((nextFilter) => {
    if (nextFilter === filter) return
    setLightboxId(null)
    setFilter(nextFilter)
    setPage(0)
    setIsFiltering(true)
    window.clearTimeout(filterTimer.current)
    filterTimer.current = window.setTimeout(() => {
      requestAnimationFrame(() => setIsFiltering(false))
    }, 320)
  }, [filter])

  useEffect(() => () => window.clearTimeout(filterTimer.current), [])

  const navigateLightbox = useCallback(
    (delta) => {
      setLightboxId((current) => {
        if (!current) return current
        const index = filteredItems.findIndex((item) => item.id === current)
        if (index < 0) return current
        const next = (index + delta + filteredItems.length) % filteredItems.length
        return filteredItems[next].id
      })
    },
    [filteredItems],
  )

  return (
    <section
      ref={sectionRef}
      className={`d2-gal${revealed ? ' is-revealed' : ''}`}
      id="gallery"
      aria-labelledby="d2-gal-heading"
    >
      <div className="d2-gal__shade" aria-hidden="true" />

      <div className="d2-gal__inner">
        <header className="d2-gal__header">
          <p className="d2-gal__eyebrow">GALLERY</p>
          <h2 id="d2-gal-heading" className="d2-headline d2-gal__heading">
            <span className="d2-headline__line">A Glimpse Into</span>
            <span className="d2-headline__line">
              What We&apos;ve <span className="d2-headline__line--accent">Built.</span>
            </span>
          </h2>
          <p className="d2-gal__lead">
            From plotted land to finished homes — explore our completed and ongoing
            projects across South Hyderabad.
          </p>
        </header>

        <div className="d2-gal__filters" role="tablist" aria-label="Gallery filters">
          {GALLERY_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`d2-gal__filter${filter === item.id ? ' is-active' : ''}`}
              onClick={() => applyFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className={`d2-gal__masonry${isFiltering ? ' is-filtering' : ''}`}
          aria-live="polite"
        >
          {pageItems.map((item, index) => (
            <GalleryCard
              key={`${item.id}-${safePage}`}
              item={item}
              index={index}
              onOpen={setLightboxId}
            />
          ))}
        </div>

        {filteredItems.length > GALLERY_PAGE_SIZE ? (
          <div className="d2-gal__pager">
            <button
              type="button"
              className="d2-gal__pager-btn"
              onClick={() => changePage(safePage - 1)}
              disabled={!hasPrev || isFiltering}
              aria-label="Previous gallery set"
            >
              ← Prev
            </button>
            <p className="d2-gal__pager-status">
              {safePage + 1} <span>/ {totalPages}</span>
            </p>
            <button
              type="button"
              className="d2-gal__pager-btn"
              onClick={() => changePage(safePage + 1)}
              disabled={!hasNext || isFiltering}
              aria-label="Next gallery set"
            >
              Next →
            </button>
          </div>
        ) : null}
      </div>

      <Lightbox
        items={filteredItems}
        activeId={lightboxId}
        onClose={() => setLightboxId(null)}
        onNavigate={navigateLightbox}
      />
    </section>
  )
}
