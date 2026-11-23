import { useEffect, useRef } from 'react'
import ArrowIcon from './ArrowIcon'
import Logo from './Logo'
import SlideText from './SlideText'
import { NAV_LINKS } from './navLinks'
import './Footer.css'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie settings', href: '#cookie-settings' },
]

/*
  Curtain reveal. Until the footer has been reached it sits underneath the section above (the
  Newsletter), pulled up behind it by `OVERLAP_U` and a little darker. While the footer scrolls
  into view it slides back down to its own place and lightens, uncovering the hidden part. Once it
  is fully revealed the stacking order is equalised, so the two sections no longer overlap.
*/
const OVERLAP_U = 8.5 // same unit as the footer's --u
const DARK = [179, 179, 180]
const LIGHT = [231, 231, 232]

function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = ref.current
    if (!footer) return
    const above = footer.previousElementSibling as HTMLElement | null
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let shift = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const overlap = OVERLAP_U * Math.min(window.innerWidth * 0.01, 19.2)
      // natural (untransformed) top of the footer in the viewport
      const top = footer.getBoundingClientRect().top - shift
      const raw = (vh * 0.7 - top) / (vh * 0.5)
      const p = reduce ? 1 : Math.min(1, Math.max(0, raw))
      shift = -overlap * (1 - p)
      footer.style.transform = p >= 1 ? '' : `translate3d(0, ${shift.toFixed(2)}px, 0)`
      footer.style.backgroundColor =
        p >= 1
          ? ''
          : `rgb(${DARK.map((d, i) => Math.round(d + (LIGHT[i] - d) * p)).join(',')})`
      if (above) above.style.zIndex = p >= 1 ? '' : '2'
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
      if (above) above.style.zIndex = ''
    }
  }, [])

  return (
    <footer className="footer" ref={ref}>
      <div className="footer__top">
        <div className="footer__column">
          <p className="footer__heading">Contact us</p>
          <a className="footer__email slide-link" href="mailto:info@oaken.tr">
            <SlideText>info@oaken.tr</SlideText>
          </a>
        </div>

        <div className="footer__column">
          <p className="footer__heading">Legal</p>
          <ul className="footer__legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a className="slide-link" href={link.href}>
                  <SlideText>{link.label}</SlideText>
                </a>
              </li>
            ))}
            {/* plain text: no hover animation */}
            <li>
              <span className="footer__static">Copyright</span>
            </li>
            <li>
              <span className="footer__static">©2026</span>
            </li>
            <li>
              <a className="slide-link" href="#credit">
                <SlideText>Fuad Ahmed</SlideText>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__column">
          <p className="footer__heading">Navigate</p>
          <ul className="footer__nav">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a className="slide-link" href={link.href}>
                  <SlideText>{link.label}</SlideText>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <Logo className="footer__logo" />

        {/* Same hover as the "Contact the Housing Pact Desk" button: it turns pink, the outlined
            square shrinks away and a solid one grows in */}
        <a className="footer-contact" href="mailto:info@oaken.tr">
          <span className="footer-contact__square footer-contact__square--outlined" aria-hidden="true">
            <ArrowIcon className="footer-contact__arrow" />
          </span>
          <span className="footer-contact__square footer-contact__square--solid" aria-hidden="true">
            <ArrowIcon className="footer-contact__arrow" />
          </span>
          <span className="footer-contact__label">
            Contact
            <br />
            Oaken
          </span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
