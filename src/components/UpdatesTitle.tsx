import { useEffect, useRef } from 'react'
import PactLink from './PactLink'
import './UpdatesTitle.css'

/*
  The heading and the "All messages" link stay at the top while the news items scroll, and only
  slide down the column during the final stretch, moving 1:1 with the items so both reach the end
  together (title at the bottom of the column). It is driven by the items' own scroll position, so
  it keeps exactly the rhythm of the items (including the glide of SmoothScroll).
*/
function UpdatesTitle() {
  const columnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const column = columnRef.current
    const content = contentRef.current
    const scroller = column?.closest('.updates')?.querySelector<HTMLElement>('[data-scroll-inner]')
    if (!column || !content || !scroller) return

    let frame = 0

    const update = () => {
      frame = 0
      const style = getComputedStyle(column)
      const room =
        column.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - content.offsetHeight
      const max = scroller.scrollHeight - scroller.clientHeight
      const travel = Math.max(0, room)
      // Stays still until the items are `travel` px from their end, then moves 1:1 with them,
      // so both arrive at the end of the scroll together.
      const y = Math.min(travel, Math.max(0, scroller.scrollTop - (max - travel)))
      content.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    scroller.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      scroller.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="updates-title" ref={columnRef}>
      <div className="updates-title__content" ref={contentRef}>
        <h2 className="updates-title__heading">
          <span>LATEST</span> <span>UPDATES</span>
        </h2>

        <PactLink label="All messages" className="updates-title__link" />
      </div>
    </div>
  )
}

export default UpdatesTitle
