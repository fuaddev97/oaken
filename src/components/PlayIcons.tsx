import { useId } from 'react'

/*
  Rounded "play" triangle, outline only. Used inside the Promo's "Play video" button.
  Both icons share the same triangle so the button feels the same before and after hover.
*/
const TRIANGLE = 'M9.4 6.6 L18.6 11.4 Q19.6 12 18.6 12.6 L9.4 17.4 Q8.2 18 8.2 16.8 V7.2 Q8.2 6 9.4 6.6 Z'

/* Before hover: just the outline, drawn with the current (pink) text color */
export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d={TRIANGLE} />
    </svg>
  )
}

/*
  After hover: a solid pink button whose play outline is cut out of it (a real hole), so the
  video running behind shows through the outline while the inside of the triangle stays pink.
*/
export function PlayIconCutout({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 76 76"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="76" height="76">
          <rect width="76" height="76" fill="#fff" />
          <g transform="translate(17.5 17.5) scale(1.71)">
            <path d={TRIANGLE} fill="none" stroke="#000" strokeWidth="1.1" strokeLinejoin="round" />
          </g>
        </mask>
      </defs>
      <rect width="76" height="76" rx="6" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  )
}
