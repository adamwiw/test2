import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CoffeeHero = () => {
  useGSAP(() => {
    // Parallax animation
    gsap.to('.coffee-image', {
      y: 100,
      scrollTrigger: {
        trigger: '.hero-section',
        scrub: true,
      },
    });
    // Steam animation
    gsap.fromTo('.steam', { opacity: 0 }, { opacity: 1, duration: 2, stagger: 0.2, repeat: -1 });
  });

  return (
    <section className="hero-section min-h-screen flex items-center justify-center">
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          DEBUGGER&rsquo;S CAFE
        </h1>
        <p className="text-xl mb-8">☕ Coffee + Code = Perfect Debugging Companion</p>
        <div className="steam absolute bg-white"></div>
        <div className="steam absolute bg-white"></div>
        <div className="steam absolute bg-white"></div>
      </div>
    </section>
  );
};

export default CoffeeHero;