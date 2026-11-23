import { useEffect, useRef } from 'react'
import './Hero.css'
import PactLink from './PactLink'
import ContactButton from './ContactButton'

/* ---------- Floating-shape motion settings ---------- */
const DRIVE_SMOOTHING_MS = 170 // how smoothly the mouse's speed/direction is picked up
const MOVE_SMOOTHING_MS = 320 // inertia of the shapes themselves (higher = floatier)
const IDLE_MS = 350 // a pause this long means the next mouse movement is a new "gesture"
const SPEED_REF = 0.9 // mouse speed (px per ms) that gives a strong reaction
const REACH = 2.2 // how far the shapes travel, in layout units (1 unit = 1vw, capped)
const MAX_TILT = 4 // degrees

type Offset = { x: number; y: number; r: number }

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const fShapeRef = useRef<HTMLSpanElement>(null)
  const cShapeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const fShape = fShapeRef.current
    const cShape = cShapeRef.current
    if (!section || !fShape || !cShape) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let running = false
    let lastFrame = 0

    let lastMouse: { x: number; y: number } | null = null
    let lastMoveAt = 0
    let movedX = 0 // mouse distance travelled since the previous frame
    let movedY = 0

    // Smoothed mouse direction/speed, from -1 to 1 on each axis (left/up = negative)
    let driveX = 0
    let driveY = 0

    // The random part: re-rolled at the start of every gesture, then held steady
    // so the shapes never jitter. It decides which way the paths bow.
    let curve = 1
    let spin = 1

    const posF: Offset = { x: 0, y: 0, r: 0 }
    const posC: Offset = { x: 0, y: 0, r: 0 }

    const apply = (el: HTMLElement, o: Offset) => {
      el.style.setProperty('--dx', `${o.x.toFixed(2)}px`)
      el.style.setProperty('--dy', `${o.y.toFixed(2)}px`)
      el.style.setProperty('--r', `${o.r.toFixed(3)}deg`)
    }

    const follow = (pos: Offset, target: Offset, k: number) => {
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      pos.r += (target.r - pos.r) * k
    }

    const frameLoop = (now: number) => {
      const dt = Math.min(now - lastFrame, 50) || 16
      lastFrame = now

      // 1) mouse movement -> smoothed direction (-1..1)
      const inX = Math.tanh(movedX / dt / SPEED_REF)
      const inY = Math.tanh(movedY / dt / SPEED_REF)
      movedX = 0
      movedY = 0
      const kDrive = 1 - Math.exp(-dt / DRIVE_SMOOTHING_MS)
      driveX += (inX - driveX) * kDrive
      driveY += (inY - driveY) * kDrive

      // 2) direction -> where the shapes want to be
      const unit = Math.min(window.innerWidth / 100, 19.2)
      const R = REACH * unit

      // Mouse LEFT  -> shapes move TOWARD each other (RIGHT -> apart).
      // Mouse UP/DOWN -> shapes move the opposite way vertically, along a curved path.
      // `curve` (random per gesture) picks which way the path bows.
      const theta = -driveX * 1.2
      const phi = -driveY * 1.2
      const sideways = Math.sin(theta) * R
      const bowX = curve * R * (1 - Math.cos(phi))
      const bowY = curve * R * 0.7 * (1 - Math.cos(theta))
      const tilt = spin * (driveX - driveY * 0.5) * MAX_TILT

      const targetF: Offset = {
        x: sideways + bowX,
        y: Math.sin(phi) * R + bowY,
        r: tilt,
      }
      const targetC: Offset = {
        x: -sideways - bowX,
        y: Math.sin(phi) * R * 0.85 - bowY,
        r: tilt,
      }

      // 3) glide toward the target (this smoothing is what keeps it from vibrating)
      const kMove = 1 - Math.exp(-dt / MOVE_SMOOTHING_MS)
      follow(posF, targetF, kMove)
      follow(posC, targetC, kMove)
      apply(fShape, posF)
      apply(cShape, posC)

      // 4) once the mouse is still/outside and the shapes are home, stop the loop
      const settled =
        now - lastMoveAt > IDLE_MS &&
        Math.abs(driveX) < 0.002 &&
        Math.abs(driveY) < 0.002 &&
        Math.abs(posF.x) + Math.abs(posF.y) + Math.abs(posC.x) + Math.abs(posC.y) < 0.05
      if (settled) {
        driveX = driveY = 0
        Object.assign(posF, { x: 0, y: 0, r: 0 })
        Object.assign(posC, { x: 0, y: 0, r: 0 })
        apply(fShape, posF)
        apply(cShape, posC)
        running = false
        return
      }
      frame = requestAnimationFrame(frameLoop)
    }

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (lastMouse) {
        movedX += e.clientX - lastMouse.x
        movedY += e.clientY - lastMouse.y
      }
      lastMouse = { x: e.clientX, y: e.clientY }

      if (now - lastMoveAt > IDLE_MS) {
        curve = Math.random() < 0.5 ? -1 : 1
        spin = Math.random() < 0.5 ? -1 : 1
      }
      lastMoveAt = now

      if (!running) {
        running = true
        lastFrame = now
        frame = requestAnimationFrame(frameLoop)
      }
    }

    // Mouse leaves the section: no more input, so the shapes glide back to their home positions.
    const onMouseLeave = () => {
      lastMouse = null
      movedX = 0
      movedY = 0
    }

    section.addEventListener('mousemove', onMouseMove)
    section.addEventListener('mouseleave', onMouseLeave)
    return () => {
      section.removeEventListener('mousemove', onMouseMove)
      section.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="hero" ref={sectionRef}>
      {/*
        Layering (all inside the hero's own stacking context):
          "BUILDING" line (z 1)  <  the two shapes (inside that line, on top of its text)  <  "AFFORDABILITY" line (z 2)
        so the shapes sit in front of BUILDING but behind AFFORDABILITY.
      */}
      <h1 className="hero__title">
        <span className="hero__line hero__line--building">
          BUILDING
          {/* Giant "F" from the logo, to the left of the title */}
          <span className="hero__shape hero__shape--f" ref={fShapeRef} aria-hidden="true">
            <svg viewBox="152 125 326 403" xmlns="http://www.w3.org/2000/svg">
              <path d="M315.0 125.0 L478.0 210.0 L478.0 249.6 L314.5 164.4 L187.1 226.9 L187.1 340.9 L385.0 340.9 L385.0 376.1 L187.1 376.1 L187.1 470.4 L152.0 455.0 L152.0 205.0 Z" />
            </svg>
          </span>
          {/* Giant backwards "C" (the ring) from the logo, to the right of the title */}
          <span className="hero__shape hero__shape--c" ref={cShapeRef} aria-hidden="true">
            <svg viewBox="232 205 238 323" xmlns="http://www.w3.org/2000/svg">
              <path d="M315.0 205.0 L470.0 283.0 L470.0 445.0 L315.0 528.0 L232.0 488.0 L232.0 450.5 L314.2 490.1 L436.2 424.8 L436.2 303.8 L315.2 242.9 L232.0 286.0 L232.0 248.0 Z" />
            </svg>
          </span>
        </span>{' '}
        <span className="hero__line hero__line--affordability">AFFORDABILITY</span>
      </h1>

      <p className="hero__text">
        Everything starts with affordable housing. And where would you rather do that than in
        Samsun? Demand exceeded supply, plunging Samsun into a housing crisis. More affordable,
        high-quality rental homes are needed on the private market: that is what the City of
        Samsun wants to work on.
        <br />
        Together with you — as an owner, developer, or resident of Samsun — they are launching the
        Housing Pact.
      </p>

      <PactLink />

      <ContactButton />
    </section>
  )
}

export default Hero
