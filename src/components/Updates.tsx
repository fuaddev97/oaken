import UpdatesTitle from './UpdatesTitle'
import UpdatesItems from './UpdatesItems'
import './Updates.css'

/*
  "Latest updates" section: exactly one viewport tall and full width.
  Left: the title. Right: the news items, which scroll inside the section
  (SmoothScroll hands the scrolling over between the page and the items, with the mouse anywhere
  over the section; the title slides down as the items scroll).
*/
function Updates() {
  return (
    <section className="updates" id="news" data-scroll-pin data-scroll-handoff>
      <UpdatesTitle />
      <UpdatesItems />
    </section>
  )
}

export default Updates
