import { useEffect } from 'react'

/*
  Momentum ("sliding") scrolling for the whole site.

  A mouse-wheel push no longer jumps the page: it moves a *target* position, and the page glides
  toward it, fast at first and then slowing down until it comes to rest. Several pushes in a row
  simply add up.

  It also runs the hand-over between the page and the "Updates" items (see UpdatesItems):
  while the mouse is over the section, scrolling down first moves the page until the section reaches
  the top of the viewport, then the items scroll inside it, and once the last item is reached the
  page carries on (and the reverse when scrolling up). Everywhere else the whole page just scrolls.

  Markup hooks it relies on:  [data-scroll-pin] [data-scroll-handoff] (the section; the mouse may be
  anywhere over it)  >  [data-scroll-inner] (the element that scrolls inside).
*/

const SMOOTHING_MS = 150 // higher = longer, floatier glide; lower = snappier
const EPS = 1

type Axis = { current: number; target: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const page: Axis = { current: window.scrollY, target: window.scrollY }
    const inners = new Map<HTMLElement, Axis>()

    let frame = 0
    let running = false
    let lastTime = 0

    const innerAxis = (el: HTMLElement) => {
      let axis = inners.get(el)
      if (!axis) {
        axis = { current: el.scrollTop, target: el.scrollTop }
        inners.set(el, axis)
      }
      return axis
    }

    const maxPage = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const maxInner = (el: HTMLElement) => Math.max(0, el.scrollHeight - el.clientHeight)

    /* ---------- the glide: every frame, close part of the remaining distance ---------- */

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 64) || 16
      lastTime = now
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / SMOOTHING_MS)

      let moving = false
      const advance = (axis: Axis, apply: (value: number) => void) => {
        const remaining = axis.target - axis.current
        if (Math.abs(remaining) < 0.3) {
          if (remaining !== 0) {
            axis.current = axis.target
            apply(axis.current)
          }
          return
        }
        axis.current += remaining * k
        apply(axis.current)
        moving = true
      }

      advance(page, (y) => window.scrollTo(0, y))
      inners.forEach((axis, el) => advance(axis, (y) => (el.scrollTop = y)))

      if (moving) frame = requestAnimationFrame(tick)
      else running = false
    }

    const start = () => {
      if (running) return
      running = true
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    /* ---------- wheel input -> new targets ---------- */

    const onWheel = (e: WheelEvent) => {
      // the header menu is open: the page behind it stays put
      if (document.documentElement.hasAttribute('data-scroll-lock')) {
        e.preventDefault()
        return
      }
      if (e.defaultPrevented || e.ctrlKey || e.deltaY === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      let delta = e.deltaY
      if (e.deltaMode === 1) delta *= 40
      else if (e.deltaMode === 2) delta *= window.innerHeight
      e.preventDefault()

      const down = delta > 0
      let rest = Math.abs(delta)
      const movePage = (amount: number) => {
        page.target = clamp(page.target + (down ? amount : -amount), 0, maxPage())
      }

      const target = e.target instanceof Element ? e.target : null
      const wrap = target?.closest<HTMLElement>('[data-scroll-handoff]')
      const inner = wrap?.querySelector<HTMLElement>('[data-scroll-inner]')
      const section = wrap?.closest<HTMLElement>('[data-scroll-pin]')

      if (!wrap || !inner || !section) {
        // Not over the items: the whole page simply scrolls.
        movePage(rest)
        start()
        return
      }

      const axis = innerAxis(inner)
      const sectionTop = section.getBoundingClientRect().top + window.scrollY // position in the document
      const top = () => sectionTop - page.target // where the section's top will be on screen
      const innerMax = maxInner(inner)

      if (down) {
        const t = top()
        if (t < -EPS) {
          movePage(rest) // section already passed the top: the page carries on
        } else {
          if (t > EPS) {
            const step = Math.min(rest, t) // 1) bring the section up to the top of the viewport
            movePage(step)
            rest -= step
          }
          if (rest > 0) {
            const step = clamp(innerMax - axis.target, 0, rest) // 2) scroll the items inside it
            axis.target += step
            rest -= step
          }
          if (rest > 0) movePage(rest) // 3) items finished: the page carries on
        }
      } else {
        const t = top()
        if (t > EPS) {
          movePage(rest) // section not at the top yet: the page scrolls up
        } else {
          if (t < -EPS) {
            const step = Math.min(rest, -t) // bring the section back down to the top first
            movePage(step)
            rest -= step
          }
          if (rest > 0) {
            const step = clamp(axis.target, 0, rest)
            axis.target -= step
            rest -= step
          }
          if (rest > 0) movePage(rest)
        }
      }
      start()
    }

    /* ---------- keep in sync when something else scrolls (scrollbar drag, keyboard, ...) ---------- */

    const onPageScroll = () => {
      if (running) return
      if (Math.abs(window.scrollY - page.current) > 1.5) page.current = page.target = window.scrollY
    }
    const onAnyScroll = (e: Event) => {
      if (running || !(e.target instanceof HTMLElement)) return
      const axis = inners.get(e.target)
      if (axis && Math.abs(e.target.scrollTop - axis.current) > 1.5) axis.current = axis.target = e.target.scrollTop
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onPageScroll, { passive: true })
    document.addEventListener('scroll', onAnyScroll, true) // inner scrollers don't bubble their scroll events
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onPageScroll)
      document.removeEventListener('scroll', onAnyScroll, true)
      cancelAnimationFrame(frame)
    }
  }, [])

  return null
}

export default SmoothScroll
