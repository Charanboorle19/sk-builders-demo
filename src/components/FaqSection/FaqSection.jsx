import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import houseSketch from '../../assets/why us bg image.png'
import './FaqSection.css'

const FAQ_ITEMS = [
  {
    id: 'types',
    question: 'What types of properties does SK Builders offer?',
    answer:
      'SK Builders works across residential plots, independent homes and selected properties across South Hyderabad.',
  },
  {
    id: 'location',
    question: 'Where are your properties located?',
    answer:
      'Our focus is South Hyderabad and nearby growth corridors. Availability varies by project and location.',
  },
  {
    id: 'hmda',
    question: 'Are the plots HMDA approved?',
    answer:
      'Approval status varies by property. We clearly communicate the applicable approvals and documentation for each property before purchase.',
  },
  {
    id: 'visit',
    question: 'Can I visit a property before making a decision?',
    answer:
      'Yes. Our team can coordinate a property visit so you can understand the location, surroundings and property details before proceeding.',
  },
  {
    id: 'construct',
    question: 'Do you also construct homes?',
    answer:
      'Yes. SK Builders is also involved in construction and development, including independent residential homes.',
  },
  {
    id: 'choose',
    question: 'Can SK Builders help me choose the right property?',
    answer:
      'Yes. Share your preferred location, budget and property requirements, and our team can help identify suitable available options.',
  },
  {
    id: 'documents',
    question: 'What documents should I check before purchasing?',
    answer:
      'The required documents depend on the property. Our team can guide you through the relevant property documents, approvals and details during the enquiry process.',
  },
  {
    id: 'start',
    question: 'How do I get started?',
    answer:
      'Simply contact us and tell us what you’re looking for. We’ll understand your requirements and guide you through the relevant next steps.',
  },
]

function FaqItem({ item, index, open, onToggle, panelId, buttonId }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <div className={`d2-faq__item${open ? ' is-open' : ''}`}>
      <h3 className="d2-faq__q">
        <button
          type="button"
          id={buttonId}
          className="d2-faq__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="d2-faq__num">{number}</span>
          <span className="d2-faq__question">{item.question}</span>
          <span className="d2-faq__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="d2-faq__panel"
        hidden={!open}
      >
        <div className="d2-faq__panel-inner">
          <p className="d2-faq__answer">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const baseId = useId()
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id)

  return (
    <section className="d2-faq" id="faq" aria-labelledby="d2-faq-heading">
      <div className="d2-faq__shade" aria-hidden="true" />

      <div className="d2-faq__inner">
        <header className="d2-faq__header">
          <p className="d2-faq__eyebrow">FAQ</p>
          <h2 id="d2-faq-heading" className="d2-headline d2-faq__heading">
            <span className="d2-headline__line">Questions,</span>
            <span className="d2-headline__line">
              <span className="d2-headline__line--accent">answered.</span>
            </span>
          </h2>
          <p className="d2-faq__lead">
            Everything you may want to know before taking the next step.
          </p>
        </header>

        <div className="d2-faq__stage">
          <aside className="d2-faq__aside">
            <div
              className="d2-faq__aside-sketch"
              style={{ backgroundImage: `url(${houseSketch})` }}
              aria-hidden="true"
            />
            <div className="d2-faq__aside-copy">
              <h3 className="d2-faq__aside-title">Still have questions?</h3>
              <p className="d2-faq__aside-text">
                Whether you’re looking for land, a home, a property or construction
                support, we’re happy to help you understand your options.
              </p>
              <Link className="d2-faq__cta" to="/#contact">
                Talk to us
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>

          <div className="d2-faq__list" role="list">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.id}
                item={item}
                index={index}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
                panelId={`${baseId}-panel-${item.id}`}
                buttonId={`${baseId}-btn-${item.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
