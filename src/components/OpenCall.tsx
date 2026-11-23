import PactLink from './PactLink'
import './OpenCall.css'

/* "Open call": a plain white section with a big heading, a short grey text and a link. */
function OpenCall() {
  return (
    <section className="open-call" id="open-call">
      <div className="open-call__content">
        <h2 className="open-call__title">
          <span>OPEN</span> <span>CALL</span>
        </h2>

        <p className="open-call__text">
          We are launching a call to developers and landowners: who wants to help build affordable
          rental homes? The first wave of projects runs through September 1; the second follows in
          2027.
        </p>

        <PactLink label="View the open call" className="open-call__link" />
      </div>
    </section>
  )
}

export default OpenCall
