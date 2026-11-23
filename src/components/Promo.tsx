import { useEffect, useRef } from 'react'
import PactLink from './PactLink'
import { PlayIcon, PlayIconCutout } from './PlayIcons'
import './Promo.css'

/*
  Promo: a full-width section, a bit taller than the viewport, with a looping video, a dark
  overlay and some text on top.

  Reveal: the section starts out completely black. While you scroll through it, a house-shaped
  window (flat bottom on the bottom of the viewport, vertical walls, sloped roof) rises and
  widens until the whole section is shown:
    progress 0 -> the section's top edge touches the bottom of the viewport
    progress 1 -> the section's bottom edge touches the bottom of the viewport
*/
const ROOF_SLOPE = 0.26 // roof rise per unit of run (constant, only the house grows)
const START_HALF_WIDTH = 0.6 // house half-width at the start, as a share of half the section width
const GROW_HALF_WIDTH = 0.6 // ...and how much wider it gets by the end

const videoSrc = new URL('../assets/promo.mp4', import.meta.url).href

function Promo() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // The house reveal follows the scroll position
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const width = rect.width
      const height = rect.height
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / height))

      if (progress >= 1) {
        stage.style.clipPath = 'none'
        return
      }

      // Section coordinates (y = 0 is the section's top edge)
      const cx = width / 2
      const halfWidth = cx * (START_HALF_WIDTH + GROW_HALF_WIDTH * progress)
      const base = vh - rect.top + 2 // bottom of the visible part (a little below the viewport)
      const wallHeight = vh * progress * progress
      const wallTop = vh - wallHeight - rect.top // top of the vertical walls
      const apex = wallTop - ROOF_SLOPE * halfWidth // roof peak

      const points = [
        [cx - halfWidth, base],
        [cx - halfWidth, wallTop],
        [cx, apex],
        [cx + halfWidth, wallTop],
        [cx + halfWidth, base],
      ]
      stage.style.clipPath = `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`
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

  // The video plays by itself as soon as the section is on screen and keeps looping
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="promo" ref={sectionRef}>
      <div className="promo__stage" ref={stageRef}>
        <video
          className="promo__video"
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="promo__overlay" aria-hidden="true" />

        <h3 className="promo__title">
          <span>More</span> <span>about</span> <span>Housing</span> <span>Pact</span>
        </h3>

        <div className="promo__copy">
          <p className="promo__text">
            The housing pact began with an initial conversation about a very concrete concern in
            Samsun. Watch this video to see how that conversation evolved into concrete proposals.
          </p>
          <PactLink
            className="promo__link"
            label="Play video"
            icon={<PlayIcon className="pact-link__arrow promo__play" />}
            iconDark={<PlayIconCutout className="promo__cutout" />}
          />
        </div>
      </div>
    </section>
  )
}

export default Promo
