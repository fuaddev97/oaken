import type { ReactNode } from 'react'
import ArrowIcon from './ArrowIcon'
import './PactLink.css'

/*
  Before hover:  [ light button ] About the Housing Pact
  After hover:   About the Housing Pact [ dark button ]

  Both buttons live in "slots". On hover the left slot shrinks to nothing while the right
  slot grows to full size, so the phrase glides left into the spot the first button
  occupied. The total width never changes, so nothing around it jumps.
*/
type PactLinkProps = {
  label?: string
  className?: string
  /* Icon inside the button before hover (defaults to the arrow) */
  icon?: ReactNode
  /* Icon inside the button that grows on hover (defaults to the same icon) */
  iconDark?: ReactNode
  /* Makes the link act like a button (click, Enter or Space) */
  onClick?: () => void
}

function PactLink({
  label = 'About the Housing Pact',
  className = '',
  icon = <ArrowIcon className="pact-link__arrow" />,
  iconDark = icon,
  onClick,
}: PactLinkProps) {
  return (
    <div
      className={`pact-link ${className}`.trim()}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
    >
      <span className="pact-link__slot pact-link__slot--start">
        <span className="pact-link__button pact-link__button--light">{icon}</span>
      </span>

      <span className="pact-link__label">{label}</span>

      <span className="pact-link__slot pact-link__slot--end">
        <span className="pact-link__button pact-link__button--dark">{iconDark}</span>
      </span>
    </div>
  )
}

export default PactLink
