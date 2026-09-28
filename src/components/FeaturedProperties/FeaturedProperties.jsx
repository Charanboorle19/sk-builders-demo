import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

import { MAPBOX_TOKEN, HAS_MAPBOX_TOKEN } from '../../config/mapbox'
import { SOUTH_HYDERABAD_VIEW } from '../../data/locations'
import {
  FEATURED_BUDGET_BOUNDS,
  FEATURED_FACINGS,
  FEATURED_SERVICE_TYPES,
  featuredLocalities,
  featuredProperties,
} from '../../data/featuredProperties'
import { readThemeColor } from '../../theme'
import './FeaturedProperties.css'

const MAP_STYLE = 'mapbox://styles/mapbox/light-v11'
const LIST_PAGE_SIZE_DESKTOP = 6
const LIST_PAGE_SIZE_MOBILE = 4

const QUIZ_STEPS = [
  {
    id: 'purpose',
    question: 'Buying for…',
    options: [
      { value: 'investment', label: 'Investment' },
      { value: 'live', label: 'To live' },
    ],
  },
  {
    id: 'budget',
    question: 'Budget range',
    options: [
      { value: 'under25', label: 'Under ₹25K' },
      { value: 'mid', label: '₹25–40K' },
      { value: 'over40', label: '₹40K+' },
    ],
  },
  {
    id: 'locality',
    question: 'Preferred locality',
    options: featuredLocalities
      .filter((l) => l !== 'All')
      .map((l) => ({ value: l, label: l })),
  },
]

const BUDGET_PRESETS = {
  under25: { min: FEATURED_BUDGET_BOUNDS.min, max: 25000 },
  mid: { min: 25000, max: 40000 },
  over40: { min: 40000, max: FEATURED_BUDGET_BOUNDS.max },
}

function formatBudget(value) {
  return `₹${Math.round(value / 1000)}K`
}

function applyWarmMapStyle(map) {
  const base = readThemeColor('--map-base', readThemeColor('--bg-map', '#b7ab98'))
  const land = readThemeColor('--map-land', readThemeColor('--bg-map', '#b7ab98'))
  const water = readThemeColor('--map-water', readThemeColor('--muted-properties', '#6f6558'))
  const road = readThemeColor('--map-road', water)
  const roadMinor = readThemeColor('--map-road-minor', land)
  const building = readThemeColor('--map-building', water)
  const paint = [
    ['background', 'background-color', base],
    ['land', 'background-color', land],
    ['national-park', 'fill-color', land],
    ['landuse', 'fill-color', land],
    ['land-structure-polygon', 'fill-color', land],
    ['water', 'fill-color', water],
    ['waterway', 'line-color', water],
    ['road-primary', 'line-color', road],
    ['road-secondary-tertiary', 'line-color', road],
    ['road-motorway-trunk', 'line-color', road],
    ['road-street', 'line-color', roadMinor],
    ['road-minor', 'line-color', roadMinor],
    ['bridge-primary', 'line-color', road],
    ['bridge-secondary-tertiary', 'line-color', road],
    ['bridge-street', 'line-color', roadMinor],
    ['building', 'fill-color', building],
    ['building', 'fill-opacity', 0.45],
  ]

  paint.forEach(([layer, prop, value]) => {
    try {
      if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value)
    } catch {
      /* layer may not exist on this style */
    }
  })
}

export default function FeaturedProperties() {
  const mapRef = useRef(null)
  const listRef = useRef(null)
  const cardRefs = useRef({})

  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({
    purpose: null,
    budget: null,
    locality: null,
  })
  const [quizDone, setQuizDone] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  const [service, setService] = useState('All')
  const [locality, setLocality] = useState('All')
  const [facing, setFacing] = useState('All')
  const [budgetMin, setBudgetMin] = useState(FEATURED_BUDGET_BOUNDS.min)
  const [budgetMax, setBudgetMax] = useState(FEATURED_BUDGET_BOUNDS.max)

  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [viewState, setViewState] = useState(SOUTH_HYDERABAD_VIEW)
  const [listOnly, setListOnly] = useState(false)
  const [listPage, setListPage] = useState(0)
  const [listPageSize, setListPageSize] = useState(LIST_PAGE_SIZE_DESKTOP)
  const [isMobileMap, setIsMobileMap] = useState(false)
  const [themeAccent, setThemeAccent] = useState('#b8892d')
  const [themeBg, setThemeBg] = useState('#f5f1e8')
  const autoScrollPausedRef = useRef(false)
  const autoIndexRef = useRef(0)
  const userPickedRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 960px)')
    const sync = () => {
      const mobile = media.matches
      setListPageSize(mobile ? LIST_PAGE_SIZE_MOBILE : LIST_PAGE_SIZE_DESKTOP)
      setIsMobileMap(mobile)
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap?.() ?? mapRef.current
    if (!mapInstance) return
    if (isMobileMap) {
      mapInstance.dragPan.disable()
      mapInstance.touchZoomRotate.disableRotation()
    } else {
      mapInstance.dragPan.enable()
      mapInstance.touchZoomRotate.enableRotation()
    }
  }, [isMobileMap])

  useEffect(() => {
    const syncTheme = () => {
      setThemeAccent(readThemeColor('--map-pin-active', readThemeColor('--accent-properties', '#b8892d')))
      setThemeBg(readThemeColor('--map-pin-active-ring', readThemeColor('--map-pin-ring', '#ffffff')))
      const mapInstance = mapRef.current?.getMap?.() ?? mapRef.current
      if (mapInstance) applyWarmMapStyle(mapInstance)
    }
    syncTheme()
    window.addEventListener('sk-theme-change', syncTheme)
    return () => window.removeEventListener('sk-theme-change', syncTheme)
  }, [])

  const filtered = useMemo(() => {
    return featuredProperties.filter((p) => {
      if (service !== 'All' && p.service !== service) return false
      if (locality !== 'All' && p.locality !== locality) return false
      if (facing !== 'All' && p.facing !== facing) return false
      if (p.priceValue < budgetMin || p.priceValue > budgetMax) return false
      if (quizAnswers.purpose && !p.purposes.includes(quizAnswers.purpose)) {
        return false
      }
      return true
    })
  }, [service, locality, facing, budgetMin, budgetMax, quizAnswers.purpose])

  const listPageCount = Math.max(1, Math.ceil(filtered.length / listPageSize))
  const safeListPage = Math.min(listPage, listPageCount - 1)
  const listPageItems = useMemo(() => {
    const start = safeListPage * listPageSize
    return filtered.slice(start, start + listPageSize)
  }, [filtered, safeListPage, listPageSize])
  const useListGrid = listOnly && listPageSize === LIST_PAGE_SIZE_DESKTOP
  const visibleProperties = useListGrid ? listPageItems : filtered

  useEffect(() => {
    setListPage(0)
  }, [service, locality, facing, budgetMin, budgetMax, quizAnswers.purpose, listOnly, listPageSize])

  const flyTo = useCallback((longitude, latitude, zoom = 12.8) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom,
      duration: 900,
      essential: true,
    })
  }, [])

  const focusProperty = useCallback(
    (property, { fly = true } = {}) => {
      if (!property) return
      setSelectedId(property.id)

      const list = listRef.current
      const node = cardRefs.current[property.id]
      if (list && node) {
        const listRect = list.getBoundingClientRect()
        const cardRect = node.getBoundingClientRect()
        const nextLeft =
          list.scrollLeft +
          (cardRect.left - listRect.left) -
          (listRect.width - cardRect.width) / 2
        list.scrollTo({ left: Math.max(0, nextLeft), behavior: 'smooth' })
      }

      if (fly) {
        const [lng, lat] = property.coordinates
        flyTo(lng, lat, 12.6)
      }
    },
    [flyTo],
  )

  const selectProperty = useCallback(
    (property, { scrollList = true, fly = true } = {}) => {
      userPickedRef.current = true
      autoScrollPausedRef.current = true
      const index = filtered.findIndex((p) => p.id === property.id)
      if (index >= 0) autoIndexRef.current = index
      setSelectedId(property.id)
      if (fly) {
        const [lng, lat] = property.coordinates
        flyTo(lng, lat)
      }
      if (scrollList) {
        focusProperty(property, { fly: false })
      }
    },
    [filtered, flyTo, focusProperty],
  )

  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  useEffect(() => {
    autoIndexRef.current = 0
    userPickedRef.current = false
    autoScrollPausedRef.current = false

    if (listOnly || filtered.length === 0) {
      if (filtered.length === 0) setSelectedId(null)
      return undefined
    }

    // Highlight the first card immediately
    const start = window.setTimeout(() => {
      if (!userPickedRef.current) {
        focusProperty(filtered[0], { fly: true })
      }
    }, 80)

    if (filtered.length < 2) {
      return () => window.clearTimeout(start)
    }

    const STEP_MS = 3200
    const id = window.setInterval(() => {
      if (autoScrollPausedRef.current || userPickedRef.current) return
      const next = (autoIndexRef.current + 1) % filtered.length
      autoIndexRef.current = next
      focusProperty(filtered[next], { fly: true })
    }, STEP_MS)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
  }, [filtered, focusProperty, listOnly])

  const pauseAutoScroll = () => {
    autoScrollPausedRef.current = true
  }
  const resumeAutoScroll = () => {
    userPickedRef.current = false
    autoScrollPausedRef.current = false
  }
  const resumeAutoScrollSoon = () => {
    window.setTimeout(() => {
      userPickedRef.current = false
      autoScrollPausedRef.current = false
    }, 2800)
  }

  const handleQuizPick = (stepId, value) => {
    const next = { ...quizAnswers, [stepId]: value }
    setQuizAnswers(next)

    if (stepId === 'budget' && BUDGET_PRESETS[value]) {
      setBudgetMin(BUDGET_PRESETS[value].min)
      setBudgetMax(BUDGET_PRESETS[value].max)
    }
    if (stepId === 'locality') {
      setLocality(value)
    }

    if (quizStep < QUIZ_STEPS.length - 1) {
      setQuizStep((s) => s + 1)
    } else {
      setQuizDone(true)
      setQuizOpen(false)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers({ purpose: null, budget: null, locality: null })
    setQuizDone(false)
    setQuizOpen(true)
    setService('All')
    setLocality('All')
    setFacing('All')
    setBudgetMin(FEATURED_BUDGET_BOUNDS.min)
    setBudgetMax(FEATURED_BUDGET_BOUNDS.max)
    setSelectedId(null)
  }

  const quizSummary = [
    quizAnswers.purpose === 'live'
      ? 'To live'
      : quizAnswers.purpose === 'investment'
        ? 'Investment'
        : null,
    quizAnswers.budget === 'under25'
      ? 'Under ₹25K'
      : quizAnswers.budget === 'mid'
        ? '₹25–40K'
        : quizAnswers.budget === 'over40'
          ? '₹40K+'
          : null,
    quizAnswers.locality,
  ]
    .filter(Boolean)
    .join(' · ')

  const scrollCarouselBy = (direction) => {
    const list = listRef.current
    if (!list) return
    pauseAutoScroll()
    userPickedRef.current = true
    const cardWidth = list.querySelector('.d2-featured__card')?.offsetWidth ?? 280
    list.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
    resumeAutoScrollSoon()
  }

  const goListPage = (direction) => {
    setListPage((current) => {
      const next = current + direction
      if (next < 0 || next >= listPageCount) return current
      return next
    })
  }

  const currentQuiz = QUIZ_STEPS[quizStep]
  const activePinId = hoveredId || selectedId
  const activeProperty = filtered.find((p) => p.id === activePinId) ?? null

  const highlightGeoJson = useMemo(() => {
    if (!activeProperty) return null
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: activeProperty.coordinates,
          },
          properties: { id: activeProperty.id },
        },
      ],
    }
  }, [activeProperty])

  return (
    <section
      className={`d2-featured${listOnly ? ' is-list-only' : ''}${useListGrid ? '' : ' is-list-carousel'}`}
      id="featured-properties"
      aria-labelledby="d2-featured-heading"
    >
      <div className="d2-featured__inner">
        <div className="d2-featured__content">
          <header className="d2-featured__header">
            <div className="d2-featured__header-copy">
              <p className="d2-featured__eyebrow">Featured Properties</p>
              <h2 id="d2-featured-heading" className="d2-featured__heading">
                Featured <em>Properties.</em>
              </h2>
              <p className="d2-featured__lead">
                Currently active across Hasthinapuram, A/V Nagar &amp; South Hyderabad.
              </p>
            </div>

            <div className="d2-featured__header-actions">
              <div className="d2-featured__view-switch">
                <span className="d2-featured__view-switch-copy">
                  <span className="d2-featured__view-switch-label">List view</span>
                  <span className="d2-featured__view-switch-hint">
                    {listOnly ? 'Map hidden' : 'Map + list'}
                  </span>
                </span>
                <button
                  type="button"
                  className={`d2-featured__switch${listOnly ? ' is-on' : ''}`}
                  role="switch"
                  aria-checked={listOnly}
                  aria-label="Show properties only without map"
                  onClick={() => setListOnly((value) => !value)}
                >
                  <span className="d2-featured__switch-thumb" aria-hidden="true" />
                </button>
              </div>

              <div className="d2-featured__quiz-anchor">
                <button
                  type="button"
                  className={`d2-featured__quiz-trigger${quizOpen ? ' is-open' : ''}${quizDone ? ' is-done' : ''}`}
                  onClick={() => setQuizOpen((open) => !open)}
                  aria-expanded={quizOpen}
                  aria-controls="d2-featured-quiz-panel"
                >
                  {quizDone ? 'Match set' : 'Find Your Match'}
                  <span aria-hidden="true">{quizOpen ? '▴' : '▾'}</span>
                </button>

                {quizDone && quizSummary && !quizOpen && (
                  <p className="d2-featured__quiz-chip">
                    {quizSummary}
                    <button type="button" className="d2-featured__quiz-reset" onClick={resetQuiz}>
                      Retake
                    </button>
                  </p>
                )}

                {quizOpen && (
                  <div
                    id="d2-featured-quiz-panel"
                    className="d2-featured__quiz-panel"
                    role="dialog"
                    aria-label="Find Your Match"
                  >
                    <div className="d2-featured__quiz-top">
                      <p className="d2-featured__quiz-label">Find Your Match</p>
                      {!quizDone && (
                        <p className="d2-featured__quiz-step">
                          {quizStep + 1} / {QUIZ_STEPS.length}
                        </p>
                      )}
                      <button
                        type="button"
                        className="d2-featured__quiz-close"
                        onClick={() => setQuizOpen(false)}
                        aria-label="Close quiz"
                      >
                        ×
                      </button>
                    </div>

                    {quizDone ? (
                      <div className="d2-featured__quiz-done">
                        <p>{quizSummary ? `Filters set · ${quizSummary}` : 'Filters set'}</p>
                        <button type="button" className="d2-featured__quiz-reset" onClick={resetQuiz}>
                          Retake quiz
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="d2-featured__quiz-q">{currentQuiz.question}</p>
                        <div
                          className="d2-featured__quiz-options"
                          role="group"
                          aria-label={currentQuiz.question}
                        >
                          {currentQuiz.options.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`d2-featured__quiz-opt${
                                quizAnswers[currentQuiz.id] === opt.value ? ' is-active' : ''
                              }`}
                              onClick={() => handleQuizPick(currentQuiz.id, opt.value)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="d2-featured__filters" role="toolbar" aria-label="Property filters">
            <div className="d2-featured__filter-group">
              <span className="d2-featured__filter-label">Service</span>
              <div className="d2-featured__chips">
                {FEATURED_SERVICE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`d2-featured__chip${service === type ? ' is-active' : ''}`}
                    onClick={() => setService(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="d2-featured__filter-row">
              <label className="d2-featured__filter-field">
                <span className="d2-featured__filter-label">Location</span>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                >
                  {featuredLocalities.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'All' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </label>

              <label className="d2-featured__filter-field d2-featured__filter-field--budget">
                <span className="d2-featured__filter-label">Budget</span>
                <select
                  value={budgetMax}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setBudgetMax(next)
                    setBudgetMin(FEATURED_BUDGET_BOUNDS.min)
                  }}
                >
                  <option value={25000}>Up to ₹25K</option>
                  <option value={40000}>Up to ₹40K</option>
                  <option value={FEATURED_BUDGET_BOUNDS.max}>
                    Up to {formatBudget(FEATURED_BUDGET_BOUNDS.max)}
                  </option>
                </select>
              </label>

              <label className="d2-featured__filter-field">
                <span className="d2-featured__filter-label">Facing</span>
                <select value={facing} onChange={(e) => setFacing(e.target.value)}>
                  {FEATURED_FACINGS.map((f) => (
                    <option key={f} value={f}>
                      {f === 'All' ? 'All' : `${f} Facing`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="d2-featured__carousel">
            <button
              type="button"
              className="d2-featured__nav d2-featured__nav--prev"
              onClick={() => (useListGrid ? goListPage(-1) : scrollCarouselBy(-1))}
              aria-label={useListGrid ? 'Previous property set' : 'Previous properties'}
              disabled={useListGrid ? safeListPage <= 0 : false}
            >
              ‹
            </button>

            <div
              className="d2-featured__list"
              ref={listRef}
              onMouseEnter={useListGrid ? undefined : pauseAutoScroll}
              onMouseLeave={useListGrid ? undefined : resumeAutoScroll}
              onPointerDown={useListGrid ? undefined : pauseAutoScroll}
              onTouchStart={useListGrid ? undefined : pauseAutoScroll}
              onTouchEnd={useListGrid ? undefined : resumeAutoScrollSoon}
              aria-label="Featured property listings"
            >
              {visibleProperties.length === 0 ? (
                <p className="d2-featured__empty">
                  No properties match these filters. Try widening budget or locality.
                </p>
              ) : (
                visibleProperties.map((property) => (
                  <article
                    key={property.id}
                    ref={(el) => {
                      cardRefs.current[property.id] = el
                    }}
                    className={`d2-featured__card${
                      selectedId === property.id ? ' is-selected' : ''
                    }${hoveredId === property.id ? ' is-hovered' : ''}`}
                    onMouseEnter={() => setHoveredId(property.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() =>
                      selectProperty(property, {
                        scrollList: !useListGrid,
                        fly: !listOnly,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        selectProperty(property, {
                          scrollList: !useListGrid,
                          fly: !listOnly,
                        })
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedId === property.id}
                  >
                    <div className="d2-featured__card-media">
                      <img src={property.image} alt="" loading="lazy" />
                      <span className="d2-featured__card-service">{property.service}</span>
                      <span className="d2-featured__card-fav" aria-hidden="true">
                        ♡
                      </span>
                    </div>
                    <div className="d2-featured__card-body">
                      <div className="d2-featured__card-top">
                        <h3 className="d2-featured__card-title">{property.title}</h3>
                        <span className="d2-featured__card-locality">
                          <span className="d2-featured__card-pin" aria-hidden="true">
                            ⌖
                          </span>
                          {property.locality}
                        </span>
                      </div>
                      <p className="d2-featured__card-price">{property.price}</p>
                      <ul className="d2-featured__card-meta">
                        <li>
                          <span className="d2-featured__meta-icon" aria-hidden="true">
                            ▣
                          </span>
                          {property.area}
                        </li>
                        <li>
                          <span className="d2-featured__meta-icon" aria-hidden="true">
                            ◎
                          </span>
                          {property.facingLabel}
                        </li>
                        <li>
                          <span className="d2-featured__meta-icon" aria-hidden="true">
                            ✓
                          </span>
                          {property.approval}
                        </li>
                      </ul>
                      <span className="d2-featured__card-cta" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>

            <button
              type="button"
              className="d2-featured__nav d2-featured__nav--next"
              onClick={() => (useListGrid ? goListPage(1) : scrollCarouselBy(1))}
              aria-label={useListGrid ? 'Next property set' : 'Next properties'}
              disabled={useListGrid ? safeListPage >= listPageCount - 1 : false}
            >
              ›
            </button>

            {useListGrid && filtered.length > listPageSize && (
              <p className="d2-featured__page-note" aria-live="polite">
                {safeListPage + 1} / {listPageCount}
              </p>
            )}
          </div>
        </div>

        {!listOnly && (
        <div className="d2-featured__map-col">
          <div className="d2-featured__map-shell">
            {!HAS_MAPBOX_TOKEN ? (
              <div className="d2-featured__map-fallback">
                <h3>Map unavailable</h3>
                <p>
                  Add <code>MAPBOX_ACCESS_TOKEN</code> to <code>.env.local</code> to
                  load the live map.
                </p>
              </div>
            ) : (
              <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle={MAP_STYLE}
                style={{ width: '100%', height: '100%' }}
                attributionControl={false}
                pitch={0}
                maxPitch={0}
                dragPan={!isMobileMap}
                dragRotate={false}
                touchPitch={false}
                keyboard={!isMobileMap}
                boxZoom={!isMobileMap}
                scrollZoom
                doubleClickZoom
                touchZoomRotate
                onLoad={(evt) => {
                  applyWarmMapStyle(evt.target)
                  if (isMobileMap) {
                    evt.target.dragPan.disable()
                    evt.target.touchZoomRotate.disableRotation()
                  }
                }}
              >
                {isMobileMap && (
                  <NavigationControl
                    position="top-right"
                    showCompass={false}
                    visualizePitch={false}
                  />
                )}
                {highlightGeoJson && (
                  <Source id="d2-featured-highlight" type="geojson" data={highlightGeoJson}>
                    <Layer
                      id="d2-featured-highlight-halo"
                      type="circle"
                      paint={{
                        'circle-radius': 34,
                        'circle-color': themeAccent,
                        'circle-opacity': 0.14,
                        'circle-blur': 0.15,
                      }}
                    />
                    <Layer
                      id="d2-featured-highlight-ring"
                      type="circle"
                      paint={{
                        'circle-radius': 22,
                        'circle-color': 'rgba(0,0,0,0)',
                        'circle-opacity': 0,
                        'circle-stroke-width': 2.5,
                        'circle-stroke-color': themeAccent,
                        'circle-stroke-opacity': 0.9,
                      }}
                    />
                    <Layer
                      id="d2-featured-highlight-core"
                      type="circle"
                      paint={{
                        'circle-radius': 7,
                        'circle-color': themeAccent,
                        'circle-opacity': 0.85,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': themeBg,
                        'circle-stroke-opacity': 1,
                      }}
                    />
                  </Source>
                )}

                {filtered.map((property) => (
                  <Marker
                    key={property.id}
                    longitude={property.coordinates[0]}
                    latitude={property.coordinates[1]}
                    anchor="bottom"
                    style={{
                      zIndex: activePinId === property.id ? 5 : 2,
                    }}
                    onClick={(e) => {
                      e.originalEvent.stopPropagation()
                      selectProperty(property)
                    }}
                  >
                    <div
                      className={
                        activePinId === property.id
                          ? 'd2-featured__pin-wrap is-active'
                          : 'd2-featured__pin-wrap'
                      }
                      onMouseEnter={() => setHoveredId(property.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {activePinId === property.id && (
                        <span className="d2-featured__pin-pulse" aria-hidden="true" />
                      )}
                      <button
                        type="button"
                        className={`d2-featured__pin${
                          activePinId === property.id ? ' is-selected' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          selectProperty(property)
                        }}
                        aria-label={`${property.title}, ${property.price}, ${property.area}`}
                      >
                        {activePinId === property.id ? (
                          <span className="d2-featured__pin-popup">
                            <img src={property.image} alt="" />
                            <span className="d2-featured__pin-popup-copy">
                              <span className="d2-featured__pin-rate">
                                {property.priceShort}
                                <span>/ sq yd</span>
                              </span>
                              <span className="d2-featured__pin-area">{property.area}</span>
                              <span className="d2-featured__pin-title">{property.title}</span>
                            </span>
                          </span>
                        ) : (
                          <span className="d2-featured__pin-card">
                            <span className="d2-featured__pin-rate">
                              {property.priceShort}
                              <span>/ sq yd</span>
                            </span>
                            <span className="d2-featured__pin-area">{property.area}</span>
                          </span>
                        )}
                        <span className="d2-featured__pin-dot" aria-hidden="true" />
                      </button>
                    </div>
                  </Marker>
                ))}
              </Map>
            )}
            <p className="d2-featured__map-note">Approximate demo locations</p>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
