export const THEME_STORAGE_KEY = 'sk-theme'
export const THEMES = ['brass', 'signature', 'navy', 'navy-dark']
export const DEFAULT_THEME = 'brass'

export const THEME_OPTIONS = [
  {
    id: 'brass',
    label: 'Cream & Brass',
    swatchA: '#b8892d',
    swatchB: '#f5f1e8',
  },
  {
    id: 'signature',
    label: 'Red & White',
    swatchA: '#7a2e1f',
    swatchB: '#ffffff',
  },
  {
    id: 'navy',
    label: 'Navy & Yellow',
    swatchA: '#e7b644',
    swatchB: '#0b1f3a',
  },
  {
    id: 'navy-dark',
    label: 'Navy Dark',
    swatchA: '#e7b644',
    swatchB: '#081629',
  },
]

export function getStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (THEMES.includes(value)) return value
  } catch {
    /* ignore storage access errors */
  }
  return DEFAULT_THEME
}

export function applyTheme(theme) {
  const next = THEMES.includes(theme) ? theme : DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', next)
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    /* ignore storage access errors */
  }
  window.dispatchEvent(new CustomEvent('sk-theme-change', { detail: next }))
  return next
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  const index = THEMES.indexOf(current)
  const next = THEMES[(index + 1) % THEMES.length]
  return applyTheme(next)
}

export function readThemeColor(name, fallback = '') {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}
