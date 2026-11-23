import { useEffect, useRef } from 'react'
import './Timeline.css'

/*
  Timeline: a white section, as wide and as tall as the Promo. The section is "pinned" (it
  stays on screen) while you scroll through it. In that time:
    - the 5 posts take turns: the current post drifts upwards while fading out, then the next
      one drifts up into its place while fading in (all tied to the scroll position, so
      stopping halfway leaves them half visible);
    - the big post number ("01") follows the posts, while "/ 05" never moves;
    - the tape (one long black line + 26 short grey ones, five times) slides to the left.
  After the 5th post the pin lets go and the page simply continues.
*/
type Post = { title: string; text: string; image: string }

const img = (n: number) => new URL(`../assets/timeline-${n}.png`, import.meta.url).href

const POSTS: Post[] = [
  {
    title: 'Early 2026: the Housing Pact in the works',
    text: 'We investigate where construction projects get stuck. What are the possible solutions? Workshops with experts and stakeholders capture the residential landscape of Samsun.',
    image: img(1),
  },
  {
    title: 'Spring and summer 2026: the first call',
    text: 'We are launching a call to developers and landowners: who wants to help build affordable rental homes? The first wave of projects runs until September 1; the second follows in 2027. It remains possible to register projects or discuss them with us even after September 1.',
    image: img(2),
  },
  {
    title: 'Autumn 2026: Starting together',
    text: 'In the autumn of 2026, we will start the intensive guidance of the first selected projects. Together, we guarantee affordable, high-quality projects.',
    image: img(3),
  },
  {
    title: '2028: From building to affordable housing',
    text: 'Projects stemming from the housing pact are gradually taking shape. We are following their development, sharing insights, and learning lessons for future projects.',
    image: img(4),
  },
  {
    title: 'One day: we look back',
    text: 'At the right moment, we will take stock. What worked? What clashed? What has the Housing Pact delivered for affordable housing in Samsun? We will release these insights and share them with a broad audience.',
    image: img(5),
  },
]

const COUNT = POSTS.length
const TICKS_PER_LANE = 26 // grey short lines after each long black one
const LANE_LINES = TICKS_PER_LANE + 1

/* Scroll length of each post-to-post step, as a share of the viewport height */
const STEP_VH = 0.85
/* Of one step: how much is used by the old post fading out, and by the new one fading in
   (what is left over is the "rest" where the post stays fully visible) */
const FADE = 0.3
/* How far a post drifts while fading (in layout units) */
const DRIFT_U = 2.6
/* Where the tape starts / ends on screen at the first / last post (share of the width) */
const TAPE_START = 0.1129
const TAPE_END = 0.1746

const pad = (n: number) => String(n).padStart(2, '0')
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* Opacity (0..1) and vertical drift (-1 .. 1, negative = moved up) of post `i` at position `q` (0..COUNT-1) */
function postState(q: number, i: number) {
  const d = q - i
  if (d <= -0.5 || d >= 0.5) return { opacity: 0, shift: d < 0 ? 1 : -1 }
  const hold = 0.5 - FADE
  if (d < -hold) {
    const t = clamp01((d + 0.5) / FADE) // coming in from below
    return { opacity: t, shift: 1 - t }
  }
  if (d > hold) {
    const t = clamp01((d - hold) / FADE) // going out upwards
    return { opacity: 1 - t, shift: -t }
  }
  return { opacity: 1, shift: 0 }
}

function Timeline() {
  const outerRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const tapeRef = useRef<HTMLDivElement>(null)
  const postRefs = useRef<Array<HTMLElement | null>>([])
  const numRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const outer = outerRef.current
    const pin = pinRef.current
    const tape = tapeRef.current
    if (!outer || !pin || !tape) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = outer.getBoundingClientRect()
      const stickyTop = parseFloat(getComputedStyle(pin).top) || 0
      const distance = Math.max(1, outer.offsetHeight - pin.offsetHeight)
      const progress = clamp01((stickyTop - rect.top) / distance)
      const q = progress * (COUNT - 1)

      const unit = Math.min(window.innerWidth / 100, 19.2)
      const drift = DRIFT_U * unit

      for (let i = 0; i < COUNT; i++) {
        const { opacity, shift } = postState(q, i)
        for (const el of [postRefs.current[i], numRefs.current[i]]) {
          if (!el) continue
          el.style.opacity = String(opacity)
          el.style.transform = `translate3d(0, ${(shift * drift).toFixed(2)}px, 0)`
          el.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible'
        }
      }

      // Tape: its first black line starts at TAPE_START; at the last post its end rests at TAPE_END
      const width = window.innerWidth
      const total = TAPE_START * width + tape.offsetWidth - TAPE_END * width
      tape.style.transform = `translate3d(${-Math.round(total * progress)}px, 0, 0)`
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
    }
  }, [])

  return (
    <section
      className="timeline"
      ref={outerRef}
      style={{ ['--timeline-steps' as string]: COUNT - 1, ['--timeline-step' as string]: STEP_VH }}
    >
      <div className="timeline__pin" ref={pinRef}>
        <div className="timeline__frame">
          <h3 className="timeline__title">Timeline of the Housing Pact</h3>

          <div className="timeline__posts">
            {POSTS.map((post, i) => (
              <article
                className="timeline-post"
                key={post.title}
                ref={(el) => {
                  postRefs.current[i] = el
                }}
              >
                <div className="timeline-post__body">
                  <h4 className="timeline-post__title">{post.title}</h4>
                  <p className="timeline-post__text">{post.text}</p>
                </div>
                <div className="timeline-post__image">
                  <img src={post.image} alt="" />
                </div>
              </article>
            ))}
          </div>

          {/* "01 / 05": only the number moves with the posts */}
          <div className="timeline__count" aria-hidden="true">
            <span className="timeline__numbers">
              {POSTS.map((_, i) => (
                <span
                  className="timeline__number"
                  key={i}
                  ref={(el) => {
                    numRefs.current[i] = el
                  }}
                >
                  {pad(i + 1)}
                </span>
              ))}
            </span>
            <span className="timeline__total">/ {pad(COUNT)}</span>
          </div>

          <div className="timeline__tapeview" aria-hidden="true">
            <div className="timeline__tape" ref={tapeRef}>
              {Array.from({ length: COUNT * LANE_LINES }, (_, n) => (
                <span
                  className={n % LANE_LINES === 0 ? 'timeline__line timeline__line--long' : 'timeline__line'}
                  key={n}
                />
              ))}

              <span className="timeline__badge">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3.5 12.8 L9.2 18.4 L20.5 6.4" />
                </svg>
                Current step
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline
