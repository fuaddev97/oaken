import ArrowIcon from './ArrowIcon'
import Arrowheads from './Arrowheads'
import './ContactButton.css'

/*
  Wide black button with the phrase near its bottom edge and a square arrow button in the
  top-right corner. On hover the button turns pink, the outlined square shrinks away and a
  solid square (no border) grows in at the same spot.
*/
function ContactButton() {
  return (
    <div className="contact-row">
      {/* Giant arrowheads: drawn behind the button, starting at the middle of its phrase */}
      <Arrowheads />

      <button className="contact-btn" type="button">
        <span className="contact-btn__square contact-btn__square--outlined" aria-hidden="true">
          <ArrowIcon className="contact-btn__arrow" />
        </span>
        <span className="contact-btn__square contact-btn__square--solid" aria-hidden="true">
          <ArrowIcon className="contact-btn__arrow" />
        </span>

        <span className="contact-btn__label">Contact the Housing Pact Desk</span>
      </button>
    </div>
  )
}

export default ContactButton
