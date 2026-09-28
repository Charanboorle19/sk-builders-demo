import journeyLand from '../assets/journey-land.png'
import journeyBuild from '../assets/journey-build.png'
import journeyLiving from '../assets/journey-living.png'
import journeyPlan from '../assets/journey-plan.png'
import offerLand from '../assets/offer-land.png'
import offerHomes from '../assets/offer-homes.png'
import offerBuild from '../assets/offer-build.png'
import offerProperties from '../assets/offer-properties.png'
import families from '../assets/families.png'
import bgImage from '../assets/bg-image.png'

export const GALLERY_FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'land', label: 'LAND' },
  { id: 'homes', label: 'HOMES' },
  { id: 'construction', label: 'CONSTRUCTION' },
  { id: 'interiors', label: 'INTERIORS' },
]

export const GALLERY_PAGE_SIZE = 5

/** size: tall | wide | square | feature — drives masonry span */
export const GALLERY_ITEMS = [
  {
    id: 'g01',
    title: 'WEST-FACING PLOT',
    locality: 'Shadnagar',
    category: 'land',
    size: 'feature',
    parallax: true,
    image: offerLand,
  },
  {
    id: 'g02',
    title: 'G+2 HOME',
    locality: 'Hasthinapuram',
    category: 'homes',
    size: 'tall',
    parallax: false,
    image: offerHomes,
  },
  {
    id: 'g03',
    title: 'RCC FRAME',
    locality: 'Chevella',
    category: 'construction',
    size: 'wide',
    parallax: false,
    image: offerBuild,
  },
  {
    id: 'g04',
    title: 'LIVING COURT',
    locality: 'Attapur',
    category: 'interiors',
    size: 'square',
    parallax: false,
    image: journeyLiving,
  },
  {
    id: 'g05',
    title: 'SURVEYED PLOT',
    locality: 'Kadthal',
    category: 'land',
    size: 'tall',
    parallax: true,
    image: journeyLand,
  },
  {
    id: 'g06',
    title: 'INDEPENDENT VILLA',
    locality: 'Manikonda',
    category: 'homes',
    size: 'square',
    parallax: false,
    image: families,
  },
  {
    id: 'g07',
    title: 'SITE EXECUTION',
    locality: 'Shamshabad',
    category: 'construction',
    size: 'tall',
    parallax: false,
    image: journeyBuild,
  },
  {
    id: 'g08',
    title: 'PLANNING STAGE',
    locality: 'South Hyderabad',
    category: 'interiors',
    size: 'wide',
    parallax: false,
    image: journeyPlan,
  },
  {
    id: 'g09',
    title: 'RESALE PROPERTY',
    locality: 'Rajendranagar',
    category: 'homes',
    size: 'feature',
    parallax: true,
    image: offerProperties,
  },
  {
    id: 'g10',
    title: 'CORNER PLOT',
    locality: 'Thukkuguda',
    category: 'land',
    size: 'wide',
    parallax: false,
    image: bgImage,
  },
]

export function filterGalleryItems(items, filterId) {
  if (filterId === 'all') return items
  return items.filter((item) => item.category === filterId)
}

export function paginateGalleryItems(items, page, pageSize = GALLERY_PAGE_SIZE) {
  const start = page * pageSize
  return items.slice(start, start + pageSize)
}
