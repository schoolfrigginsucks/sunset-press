import { CartProvider } from './context/CartContext'
import { ColourProvider } from './context/ColourContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Lineup from './components/Lineup'
import Ritual from './components/Ritual'
import Features from './components/Features'
import BundleSelector from './components/BundleSelector'
import SocialProof from './components/SocialProof'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <ColourProvider>
      <CartProvider>
        <a
          href="#bundle"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-sand-50"
        >
          Skip to bundles
        </a>

        <Nav />

        <main>
          <Hero />
          <Lineup />
          <Ritual />
          <Features />
          <BundleSelector />
          <SocialProof />
        </main>

        <Footer />
        <CartDrawer />
      </CartProvider>
    </ColourProvider>
  )
}
