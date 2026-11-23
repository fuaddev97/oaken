import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { LogoMark } from './Logo'
import './Loader.css'

/* The loader never finishes faster than this, so the animation is always readable */
const MIN_MS = 1800
/* If something never reports back (e.g. a slow video) the page is shown anyway after this */
const MAX_MS = 10000
const HOLD_MS = 900 // "WELCOME!" stays on screen this long
const FADE_MS = 350 // artwork fades before the screen leaves
const SLIDE_MS = 1000

const KEYS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'])

type Phase = 'loading' | 'welcome' | 'fade' | 'leave' | 'gone'

/*
  Pink start-up screen. It follows the real loading of the page (fonts, images, videos, the window
  "load" event) and shows it as the logo filling up and a bar along the bottom edge. When everything
  is in, the text changes to "WELCOME!" and the screen slides up and away.
*/
function Loader() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // freeze the page behind the loader
  useEffect(() => {
    if (phase === 'gone') return
    const root = document.documentElement
    root.setAttribute('data-scroll-lock', '')
    const stop = (e: Event) => e.preventDefault()
    const onKey = (e: KeyboardEvent) => {
      if (KEYS.has(e.key)) e.preventDefault()
    }
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      root.removeAttribute('data-scroll-lock')
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase === 'gone']) // eslint-disable-line react-hooks/exhaustive-deps

  // real loading progress -> smoothed progress -> phases
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minMs = reduce ? 300 : MIN_MS
    const start = performance.now()
    let done = 0
    let total = 2 // fonts + window load
    let disposed = false
    const finish = () => {
      done += 1
    }

    document.fonts?.ready.then(finish, finish)
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })

    const media = [
      ...Array.from(document.images),
      ...Array.from(document.querySelectorAll<HTMLVideoElement>('video')),
    ]
    media.forEach((el) => {
      total += 1
      if (el instanceof HTMLImageElement) {
        if (el.complete) return finish()
        el.addEventListener('load', finish, { once: true })
        el.addEventListener('error', finish, { once: true })
      } else {
        if (el.readyState >= 2) return finish()
        el.addEventListener('loadeddata', finish, { once: true })
        el.addEventListener('error', finish, { once: true })
      }
    })

    let shown = 0
    let last = start
    let frame = 0
    const timers: number[] = []

    const tick = (now: number) => {
      if (disposed) return
      const elapsed = now - start
      const dt = now - last
      last = now

      const real = elapsed >= MAX_MS ? 1 : Math.min(1, done / total)
      // never ahead of the minimum-duration clock, and eased towards the real progress
      const cap = Math.min(1, elapsed / minMs)
      const target = Math.min(real, cap)
      shown += (target - shown) * (1 - Math.exp(-dt / 220))
      if (real === 1 && cap === 1 && shown > 0.995) shown = 1
      setProgress(shown)

      if (shown >= 1) {
        setPhase('welcome')
        timers.push(
          window.setTimeout(() => setPhase('fade'), HOLD_MS),
          window.setTimeout(() => setPhase('leave'), HOLD_MS + FADE_MS),
          window.setTimeout(() => setPhase('gone'), HOLD_MS + FADE_MS + SLIDE_MS + 100),
        )
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      timers.forEach(window.clearTimeout)
      window.removeEventListener('load', finish)
    }
  }, [])

  if (phase === 'gone') return null

  const pct = progress * 100
  const welcome = phase !== 'loading'

  return (
    <div
      ref={rootRef}
      className={`loader loader--${phase}`}
      role="status"
      aria-live="polite"
      aria-label={welcome ? 'Welcome' : 'Loading'}
    >
      <div
        className="loader__mark"
        aria-hidden="true"
        style={{ '--loader-progress': `${pct.toFixed(2)}%` } as CSSProperties}
      >
        {/* faded artwork underneath, the real colours are revealed from the left as it loads */}
        <LogoMark className="loader__mark-base" />
        <LogoMark className="loader__mark-fill" />
      </div>

      <div className="loader__text" aria-hidden="true">
        <div className={'loader__text-track' + (welcome ? ' is-welcome' : '')}>
          <p>JUST A MOMENT</p>
          <p>WELCOME!</p>
        </div>
      </div>

      <div className="loader__bar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </div>
  )
}

export default Loader
