import React, { Suspense, lazy } from 'react';
import { SmartPreloader } from './utils/codeSplitting';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import LoadingScreen from './components/LoadingScreen';
import CoffeeHero from './components/CoffeeHero';

// Lazy load non-critical components
const About = lazy(() => import('./components/About'));
const Menu = lazy(() => import('./components/Menu'));
const Gallery = lazy(() => import('./components/Gallery'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const EasterEggs = lazy(() => import('./components/EasterEggs'));

// Loading fallback component
const SectionLoader = ({ height = 'auto' }) => (
  <div 
    className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
    style={{ minHeight: height }}
  >
    <div className="text-center">
      <div className="inline-block w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
      <p className="text-gray-400 text-sm">Loading section...</p>
    </div>
  </div>
);

function App() {
  return (
    <div>
      <SmartPreloader />
      <LoadingScreen />
      <Navbar />
      <ThemeToggle />
      <CoffeeHero />
      
      <Suspense fallback={<SectionLoader height="600px" />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SectionLoader height="800px" />}>
        <Menu />
      </Suspense>
      
      <Suspense fallback={<SectionLoader height="900px" />}>
        <Gallery />
      </Suspense>
      
      <Suspense fallback={<SectionLoader height="500px" />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<SectionLoader height="600px" />}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={<SectionLoader height="300px" />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={null}>
        <EasterEggs />
      </Suspense>
    </div>
  );
}

export default App;
