import { useState } from 'react'
import './ContactCta.css'

const INTEREST_OPTIONS = ['Land', 'Properties', 'Homes', 'Construction']

const INITIAL = {
  name: '',
  phone: '',
  interest: 'Land',
  location: '',
  message: '',
}

export default function ContactCta() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) {
      next.phone = 'Enter a valid 10-digit mobile number.'
    }
    if (!form.location.trim()) next.location = 'Please share a preferred location.'
    return next
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setSent(true)
  }

  const resetForm = () => {
    setForm(INITIAL)
    setErrors({})
    setSent(false)
  }

  return (
    <section className="d2-cta" id="contact" aria-labelledby="d2-cta-heading">
      <div className="d2-cta__marker" aria-hidden="true">
        <span className="d2-cta__marker-line" />
        <span className="d2-cta__marker-label">01 / SITE</span>
      </div>

      <div className="d2-cta__inner">
        <div className="d2-cta__stage">
          <div className="d2-cta__copy">
            <p className="d2-cta__eyebrow">Talk to us</p>
            <h2 id="d2-cta-heading" className="d2-headline d2-cta__heading">
              <span className="d2-headline__line">Looking for land,</span>
              <span className="d2-headline__line">
                a home or a{' '}
                <span className="d2-headline__line--accent">property?</span>
              </span>
            </h2>
            <p className="d2-cta__lead">
              Tell us what you’re looking for and our team will help you understand
              the available options and next steps.
            </p>
            <a className="d2-cta__primary" href="#d2-cta-form">
              Start a conversation
              <span aria-hidden="true">→</span>
            </a>
            <div className="d2-cta__meta">
              <p className="d2-cta__meta-place">South Hyderabad</p>
              <p className="d2-cta__meta-note">
                Available for property &amp; construction enquiries
              </p>
            </div>
          </div>

          <div className="d2-cta__form-wrap" id="d2-cta-form">
            {sent ? (
              <div className="d2-cta__success" role="status">
                <p className="d2-cta__success-eyebrow">Enquiry received</p>
                <h3 className="d2-cta__success-title">Thank you.</h3>
                <p className="d2-cta__success-text">
                  We’ve noted your interest. Our team will review your details and
                  get back to you with the relevant next steps.
                </p>
                <button type="button" className="d2-cta__submit" onClick={resetForm}>
                  Send another enquiry
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <form className="d2-cta__form" onSubmit={onSubmit} noValidate>
                <label className="d2-cta__field">
                  <span className="d2-cta__label">Name</span>
                  <input
                    className="d2-cta__input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? <span className="d2-cta__error">{errors.name}</span> : null}
                </label>

                <label className="d2-cta__field">
                  <span className="d2-cta__label">Phone number</span>
                  <input
                    className="d2-cta__input"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={update('phone')}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone ? (
                    <span className="d2-cta__error">{errors.phone}</span>
                  ) : null}
                </label>

                <fieldset className="d2-cta__field d2-cta__field--interest">
                  <legend className="d2-cta__label">I’m interested in</legend>
                  <div className="d2-cta__interest">
                    {INTEREST_OPTIONS.map((option) => (
                      <label key={option} className="d2-cta__chip">
                        <input
                          type="radio"
                          name="interest"
                          value={option}
                          checked={form.interest === option}
                          onChange={update('interest')}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="d2-cta__field">
                  <span className="d2-cta__label">Location</span>
                  <input
                    className="d2-cta__input"
                    type="text"
                    name="location"
                    placeholder="Preferred area in South Hyderabad"
                    value={form.location}
                    onChange={update('location')}
                    aria-invalid={Boolean(errors.location)}
                  />
                  {errors.location ? (
                    <span className="d2-cta__error">{errors.location}</span>
                  ) : null}
                </label>

                <label className="d2-cta__field">
                  <span className="d2-cta__label">Message</span>
                  <textarea
                    className="d2-cta__input d2-cta__textarea"
                    name="message"
                    rows={4}
                    placeholder="Budget, plot size, timeline or anything we should know"
                    value={form.message}
                    onChange={update('message')}
                  />
                </label>

                <button type="submit" className="d2-cta__submit">
                  Send enquiry
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="d2-cta__footer">
          <div className="d2-cta__rule" aria-hidden="true" />
          <p className="d2-cta__closing">Let’s find the right place to start.</p>
        </footer>
      </div>
    </section>
  )
}
