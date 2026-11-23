import { useRef } from 'react'
import './UpdatesItems.css'

type NewsItem = { date: string; title: string; image: string }

/* The photos live in src/assets (news-1.png, news-2.png, news-3.png): swap them for your originals. */
const NEWS: NewsItem[] = [
  {
    date: '03.09.2026',
    title: 'First Housing Pact pioneers submit project',
    image: new URL('../assets/news-1.png', import.meta.url).href,
  },
  {
    date: '03.06.2026',
    title: 'Do you own land or have plans for housing in Samsun? Then submit your project for the Housing Pact now.',
    image: new URL('../assets/news-2.png', import.meta.url).href,
  },
  {
    date: '03.06.2026',
    title:
      "In the urban essay 'In Construction', the City Architect Team brings together the ideas behind the Housing Pact.",
    image: new URL('../assets/news-3.png', import.meta.url).href,
  },
]

function PlusIcon() {
  return (
    <svg className="updates-item__plus-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 V22 M2 12 H22" />
    </svg>
  )
}

function UpdatesItems() {
  const lensRef = useRef<HTMLDivElement>(null)

  // The blurry "magnifying glass" that follows the mouse
  const moveLens = (e: React.MouseEvent) => {
    const lens = lensRef.current
    if (!lens) return
    const r = lens.offsetWidth / 2
    lens.style.transform = `translate3d(${e.clientX - r}px, ${e.clientY - r}px, 0)`
  }
  const showLens = (e: React.MouseEvent) => {
    moveLens(e)
    lensRef.current?.classList.add('is-visible')
  }
  const hideLens = () => lensRef.current?.classList.remove('is-visible')

  return (
    <div className="updates-items" onMouseEnter={showLens} onMouseMove={moveLens} onMouseLeave={hideLens}>
      <div className="updates-items__scroller" data-scroll-inner>
        {NEWS.map((item) => (
          <article className="updates-item" key={item.title}>
            <div className="updates-item__meta">
              <p className="updates-item__type">News</p>
              <p className="updates-item__date">{item.date}</p>
            </div>

            <h3 className="updates-item__title">{item.title}</h3>

            <div className="updates-item__footer">
              <span className="updates-item__plus">
                <PlusIcon />
              </span>
              <div className="updates-item__image">
                <img src={item.image} alt="" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="updates-lens" ref={lensRef} aria-hidden="true" />
    </div>
  )
}

export default UpdatesItems
