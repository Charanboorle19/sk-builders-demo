/**
 * Featured listings for Demo2 — approximate demo coordinates only.
 * Format: coordinates [longitude, latitude]
 */
import maheshwaram from '../assets/Maheshwaram.png'
import mansanpally from '../assets/Mansanpally.png'
import offerLand from '../assets/offer-land.png'
import offerProperties from '../assets/offer-properties.png'
import offerHomes from '../assets/offer-homes.png'
import offerBuild from '../assets/offer-build.png'
import southImage from '../assets/south-image.png'
import futureCity from '../assets/Future City.png'

export const FEATURED_SERVICE_TYPES = ['All', 'Land', 'Properties', 'Homes', 'Build']

export const FEATURED_FACINGS = ['All', 'East', 'West', 'North', 'South']

export const FEATURED_BUDGET_BOUNDS = { min: 15000, max: 65000 }

export const featuredProperties = [
  {
    id: 'fp-imperial-city',
    title: 'Imperial City',
    locality: 'Maheshwaram',
    area: '203 Sq Yards',
    areaValue: 203,
    facing: 'West',
    facingLabel: 'West Facing',
    approval: 'HMDA Final Approved',
    price: '₹40,000 / Sq Yd',
    priceShort: '₹40K',
    priceValue: 40000,
    service: 'Land',
    purposes: ['investment', 'live'],
    coordinates: [78.432, 17.138],
    image: maheshwaram,
  },
  {
    id: 'fp-mansanpally',
    title: 'Mansanpally Meadows',
    locality: 'Mansanpally',
    area: '220 Sq Yards',
    areaValue: 220,
    facing: 'East',
    facingLabel: 'East Facing',
    approval: 'Verified Property',
    price: '₹21,000 / Sq Yd',
    priceShort: '₹21K',
    priceValue: 21000,
    service: 'Properties',
    purposes: ['investment', 'live'],
    coordinates: [78.398, 17.152],
    image: mansanpally,
  },
  {
    id: 'fp-hasthinapuram',
    title: 'Hasthinapuram Heights',
    locality: 'Hasthinapuram',
    area: '167 Sq Yards',
    areaValue: 167,
    facing: 'North',
    facingLabel: 'North Facing',
    approval: 'HMDA Final Approved',
    price: '₹32,000 / Sq Yd',
    priceShort: '₹32K',
    priceValue: 32000,
    service: 'Homes',
    purposes: ['live'],
    coordinates: [78.448, 17.312],
    image: offerHomes,
  },
  {
    id: 'fp-av-nagar',
    title: 'A/V Nagar Enclave',
    locality: 'A/V Nagar',
    area: '240 Sq Yards',
    areaValue: 240,
    facing: 'West',
    facingLabel: 'West Facing',
    approval: 'DTCP Approved',
    price: '₹28,000 / Sq Yd',
    priceShort: '₹28K',
    priceValue: 28000,
    service: 'Land',
    purposes: ['investment', 'live'],
    coordinates: [78.462, 17.298],
    image: offerLand,
  },
  {
    id: 'fp-thukkuguda',
    title: 'Thukkuguda Plots',
    locality: 'Thukkuguda',
    area: '200 Sq Yards',
    areaValue: 200,
    facing: 'North',
    facingLabel: 'North Facing',
    approval: 'Verified Layout',
    price: '₹18,000 / Sq Yd',
    priceShort: '₹18K',
    priceValue: 18000,
    service: 'Land',
    purposes: ['investment'],
    coordinates: [78.458, 17.268],
    image: southImage,
  },
  {
    id: 'fp-shamshabad',
    title: 'Shamshabad Gateway',
    locality: 'Shamshabad',
    area: '300 Sq Yards',
    areaValue: 300,
    facing: 'East',
    facingLabel: 'East Facing',
    approval: 'HMDA Final Approved',
    price: '₹45,000 / Sq Yd',
    priceShort: '₹45K',
    priceValue: 45000,
    service: 'Properties',
    purposes: ['investment', 'live'],
    coordinates: [78.418, 17.245],
    image: offerProperties,
  },
  {
    id: 'fp-future-city',
    title: 'Future City Residences',
    locality: 'Maheshwaram',
    area: '267 Sq Yards',
    areaValue: 267,
    facing: 'South',
    facingLabel: 'South Facing',
    approval: 'HMDA Final Approved',
    price: '₹52,000 / Sq Yd',
    priceShort: '₹52K',
    priceValue: 52000,
    service: 'Homes',
    purposes: ['live'],
    coordinates: [78.441, 17.155],
    image: futureCity,
  },
  {
    id: 'fp-build-corridor',
    title: 'South Corridor Build',
    locality: 'Hasthinapuram',
    area: '180 Sq Yards',
    areaValue: 180,
    facing: 'West',
    facingLabel: 'West Facing',
    approval: 'Ready to Build',
    price: '₹36,000 / Sq Yd',
    priceShort: '₹36K',
    priceValue: 36000,
    service: 'Build',
    purposes: ['live'],
    coordinates: [78.455, 17.305],
    image: offerBuild,
  },
]

export const featuredLocalities = [
  'All',
  ...Array.from(new Set(featuredProperties.map((p) => p.locality))).sort(),
]

export default featuredProperties
