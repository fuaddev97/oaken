import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Updates from './components/Updates'
import Promo from './components/Promo'
import Timeline from './components/Timeline'
import OpenCall from './components/OpenCall'
import ArrowBand from './components/ArrowBand'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import Loader from './components/Loader'
import SmoothScroll from './components/SmoothScroll'

function App() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Header />
      <Hero />
      <Updates />
      <Promo />
      <Timeline />
      <OpenCall />
      <ArrowBand />
      <Newsletter />
      <Footer />
    </>
  )
}

export default App
