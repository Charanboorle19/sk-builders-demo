import { useEffect, useId, useRef, useState } from 'react'
import './WhatsAppBudgetModal.css'

function normalizeMobile(value) {
  return value.replace(/\D/g, '').slice(0, 10)
}

function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(value)
}

export default function WhatsAppBudgetModal({
  open,
  onClose,
  title = 'Get your budget plan on WhatsApp',
  summary,
}) {
  const titleId = useId()
  const inputRef = useRef(null)
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    setMobile('')
    setError('')
    setSent(false)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(event) {
    event.preventDefault()
    const digits = normalizeMobile(mobile)

    if (!isValidIndianMobile(digits)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }

    setError('')
    setSent(true)
  }

  return (
    <div className="wa-budget-modal" role="presentation">
      <button
        type="button"
        className="wa-budget-modal__backdrop"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="wa-budget-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="wa-budget-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {sent ? (
          <div className="wa-budget-modal__success">
            <p className="wa-budget-modal__eyebrow">WhatsApp</p>
            <h3 id={titleId}>Details on the way</h3>
            <p>
              We&apos;ll send your budget plan to{' '}
              <strong>+91 {normalizeMobile(mobile)}</strong> on WhatsApp shortly.
            </p>
            <button type="button" className="wa-budget-modal__submit" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="wa-budget-modal__form" onSubmit={handleSubmit}>
            <p className="wa-budget-modal__eyebrow">WhatsApp</p>
            <h3 id={titleId}>{title}</h3>
            <p className="wa-budget-modal__copy">
              Enter your mobile number and we&apos;ll send the EMI and appreciation
              details on WhatsApp.
            </p>

            {summary ? <p className="wa-budget-modal__summary">{summary}</p> : null}

            <label className="wa-budget-modal__field" htmlFor="wa-budget-mobile">
              <span>Mobile number</span>
              <span className="wa-budget-modal__input-row">
                <span className="wa-budget-modal__prefix" aria-hidden="true">
                  +91
                </span>
                <input
                  ref={inputRef}
                  id="wa-budget-mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(event) => {
                    setMobile(normalizeMobile(event.target.value))
                    if (error) setError('')
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'wa-budget-mobile-error' : undefined}
                />
              </span>
            </label>

            {error ? (
              <p id="wa-budget-mobile-error" className="wa-budget-modal__error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="wa-budget-modal__submit">
              Send details on WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
