import { useCallback, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import SlideText from './SlideText'
import { NAV_LINKS } from './navLinks'
import './Header.css'

/* The header starts following the page's scroll this many ms after the page itself moves */
const HEADER_SCROLL_DELAY_MS = 200

/* Panel backgrounds; a different one is picked every time the menu opens */
const PANEL_COLORS = ['#f8e6c4', '#e6f2fb', '#eed0e1', '#e7e7e8']

function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)

  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        setColorIndex((i) => {
          let next = Math.floor(Math.random() * PANEL_COLORS.length)
          if (next === i) next = (next + 1) % PANEL_COLORS.length
          return next
        })
      }
      return !wasOpen
    })
  }, [])

  // while open: freeze the page behind the panel, Escape closes
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.setAttribute('data-scroll-lock', '')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.removeAttribute('data-scroll-lock')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    type Sample = { t: number; y: number }
    let settledY = window.scrollY // where the header currently rests
    let samples: Sample[] = []
    let frame = 0
    let running = false

    const place = (y: number) => {
      header.style.transform = `translate3d(0, ${-y}px, 0)`
    }
    place(settledY)

    // Replays the scroll position as it was HEADER_SCROLL_DELAY_MS ago:
    // the header is a time-shifted copy of the page's own scrolling.
    const tick = (now: number) => {
      const y = window.scrollY
      samples.push({ t: now, y })

      const cutoff = now - HEADER_SCROLL_DELAY_MS
      while (samples.length > 2 && samples[1].t <= cutoff) samples.shift()

      const a = samples[0]
      const b = samples[1]
      let delayed = a.y
      if (b && a.t <= cutoff && b.t > a.t) {
        delayed = a.y + ((b.y - a.y) * (cutoff - a.t)) / (b.t - a.t)
      }
      place(delayed)

      // Everything has caught up and the page has stopped: rest.
      if (delayed === y && samples.every((s) => s.y === y)) {
        settledY = y
        running = false
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (running) return
      running = true
      const now = performance.now()
      // two "resting" samples so the header holds still until the delay has passed
      samples = [
        { t: now - HEADER_SCROLL_DELAY_MS - 1, y: settledY },
        { t: now - 1, y: settledY },
      ]
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="header-shell">
      <header className={'header' + (open ? ' header--open' : '')} ref={headerRef}>
        <Logo className="header__logo" />

        {/* dims the page (logo included) while the menu is open; clicking it closes the menu */}
        <div className="header__dim" onClick={() => setOpen(false)} aria-hidden="true" />

        <nav
          className="menu-panel"
          aria-label="Main"
          aria-hidden={!open}
          style={{ backgroundColor: PANEL_COLORS[colorIndex] }}
        >
          <p className="menu-panel__heading">Navigate</p>
          <ul className="menu-panel__list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  className="slide-link"
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  <SlideText>{link.label}</SlideText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__menu" onClick={toggle}>
          {/* Two identical labels stacked in a track; hovering slides the track up */}
          <div className="header__menu-label">
            <div className="header__menu-track">
              <p>{open ? 'close' : 'menu'}</p>
              <p aria-hidden="true">{open ? 'close' : 'menu'}</p>
            </div>
          </div>

          <button
            className="header__menu-button"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg
              className="header__menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2 V22 M2 12 H22" />
            </svg>
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header
