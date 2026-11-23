import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './Logo.css'

/* Hover color pairs for the logo: [brick, ring] */
const LOGO_HOVER_PALETTES: ReadonlyArray<readonly [string, string]> = [
  ['#E0A030', '#5A2E22'],
  ['#6B8F71', '#1F3A33'],
  ['#2F7F86', '#14323A'],
]

/* The bare artwork (no link, no hover): used by the page loader as well */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`logo__svg ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="152 125 326 403"
      role="img"
      aria-hidden="true"
    >
      {/* Brick "F": top band, left bar, middle arm */}
      <path
        className="logo__brick"
        d="M152 205 L315 125 L478 210 L478 268 L315 187 L225 238
           L225 322 L385 322 L385 395 L225 395 L225 487 L152 455 Z"
      />
      {/* Hex ring (open on the left where the arm enters) */}
      <path
        className="logo__ring"
        d="M232 248 L315 205 L470 283 L470 445 L315 528 L232 488 L232 410
           L315 461 L405 403 L405 326 L315 281 L232 307 Z"
      />
    </svg>
  )
}

/*
  The logo is inlined (instead of using an <img>) so its two fill colors
  can be transitioned with CSS on hover.
  The viewBox is cropped tightly around the artwork, and the original
  background rectangle was removed so the header background shows through.
*/
function Logo({ className = '' }: { className?: string }) {
  const [paletteIndex, setPaletteIndex] = useState(0)
  const lastIndex = useRef(0)

  // Pick a random palette on every hover, never the same one twice in a row
  const pickRandomPalette = () => {
    const others = LOGO_HOVER_PALETTES.map((_, i) => i).filter((i) => i !== lastIndex.current)
    const next = others[Math.floor(Math.random() * others.length)]
    lastIndex.current = next
    setPaletteIndex(next)
  }

  const [brick, ring] = LOGO_HOVER_PALETTES[paletteIndex]
  const style = {
    '--logo-hover-brick': brick,
    '--logo-hover-ring': ring,
  } as CSSProperties

  return (
    <a
      className={`logo ${className}`.trim()}
      href="/"
      aria-label="Home"
      style={style}
      onMouseEnter={pickRandomPalette}
      onFocus={pickRandomPalette}
    >
      <LogoMark />
    </a>
  )
}

export default Logo
