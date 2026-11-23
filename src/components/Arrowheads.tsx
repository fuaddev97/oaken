import { useLayoutEffect, useRef, useState } from 'react'

/*
  A series of giant left-pointing arrowheads ( < < < < ) nested one inside the other.
  Each arrowhead has its tip on the middle row of the drawing and two 45° arms that run
  to the top and the bottom edge. The drawing is as wide as its container; the tips repeat
  every `SPACING` (relative to the arm length) and overshoot the edges so no gaps appear.

  The size comes from the CSS height of the <svg> (see ContactButton.css), so it scales
  with the page like everything else.
*/
const SPACING_RATIO = 53 / 241 // tip-to-tip distance / arm length
const PHASE_RATIO = 0.434 // where the first tip sits within one spacing

function Arrowheads() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const measure = () => setSize({ w: svg.clientWidth, h: svg.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  const { w, h } = size
  // Everything is snapped to whole pixels so that every line is anti-aliased the same way
  // (otherwise some lines would look brighter or fainter than their neighbours).
  const arm = Math.round(h / 2) // vertical (and horizontal) reach of each arrowhead's arms
  const spacing = Math.max(1, Math.round(arm * SPACING_RATIO))
  const phase = Math.round(spacing * PHASE_RATIO)

  let d = ''
  if (w > 0 && h > 0) {
    const first = Math.floor((-arm - phase) / spacing)
    const last = Math.ceil((w - phase) / spacing)
    for (let k = first; k <= last; k++) {
      const tip = phase + k * spacing
      d += `M${tip + arm} 0 L${tip} ${arm} L${tip + arm} ${arm * 2} `
    }
  }

  return (
    <svg
      ref={svgRef}
      className="arrowheads"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w || 1} ${h || 1}`}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export default Arrowheads
