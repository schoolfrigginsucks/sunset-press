import { CartProvider } from './context/CartContext'
import { useCatalogue } from './hooks/useCatalogue'
import Nav from './components/Nav'
import Hero from './components/Hero'
import BundleSelector from './components/BundleSelector'
import ProductShowcase from './components/ProductShowcase'
import Features from './components/Features'
import SocialProof from './components/SocialProof'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

export default function App() {
  const { products } = useCatalogue()

  return (
    <CartProvider>
      <a
        href="#shop"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-cream-50"
      >
        Skip to products
      </a>

      <Nav />

      <main>
        <Hero />
        <BundleSelector products={products} />
        <ProductShowcase products={products} />
        <Features />
        <SocialProof />
      </main>

      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
