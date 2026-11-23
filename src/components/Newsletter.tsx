import { useRef } from 'react'
import type { FormEvent } from 'react'
import PactLink from './PactLink'
import './Newsletter.css'

/* Newsletter: a heading on the left, the sign-up field and a small note on the right. */
function Newsletter() {
  const formRef = useRef<HTMLFormElement>(null)

  // No back end yet: just stop the page from reloading when the form is submitted
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section className="newsletter">
      <h2 className="newsletter__title">
        <span>Stay informed via</span> <span>our newsletter</span>
      </h2>

      <div className="newsletter__right">
        <form className="newsletter__field" ref={formRef} onSubmit={handleSubmit} noValidate={false}>
          <input
            className="newsletter__input"
            type="email"
            name="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            autoComplete="email"
            required
          />
          <PactLink
            className="pact-link--reverse newsletter__submit"
            label="Submit"
            onClick={() => formRef.current?.requestSubmit()}
          />
        </form>

        <p className="newsletter__note">
          By registering, you agree to our <a href="/privacy-policy">privacy policy</a>.
        </p>
      </div>
    </section>
  )
}

export default Newsletter
