import './SlideText.css'

/*
  Text that "rolls" on hover: two identical copies are stacked in a window one line tall,
  and hovering the surrounding link (class "slide-link") slides them up, so the first copy
  leaves at the top while the second one takes its place. Same effect as the header's "menu".
*/
function SlideText({ children }: { children: string }) {
  return (
    <span className="slide-text">
      <span className="slide-text__track">
        <span className="slide-text__line">{children}</span>
        <span className="slide-text__line" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  )
}

export default SlideText
