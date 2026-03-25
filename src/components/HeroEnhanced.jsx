import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  parallaxHero, 
  fadeInOnScroll, 
  createCoffeeParticles,
  magneticButton,
  textScramble,
  initCafeAnimations 
} from '../utils/animations';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const HeroEnhanced = () => {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const particleContainerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrambleEnabled, setScrambleEnabled] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Initialize all cafe animations from utility
    if (typeof window !== 'undefined') {
      initCafeAnimations();
    }

    // Parallax effect on background
    if (bgRef.current) {
      parallaxHero(bgRef.current, { speed: 0.6, axis: 'y' });
    }

    // Entrance animations with timeline
    const tl = gsap.timeline({ 
      defaults: { ease: 'power3.out' },
      delay: 0.2
    });

    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { y: 100, opacity: 0, rotationX: -45 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, delay: 0.3 }
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }, '-=0.8'
      );
    }

    if (buttonsRef.current) {
      tl.fromTo(buttonsRef.current.children,
        { y: 60, opacity: 0, stagger: 0.15 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.6'
      );
    }

    if (statsRef.current) {
      tl.fromTo(statsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }, '-=0.4'
      );
    }

    // Create coffee particles
    if (particleContainerRef.current) {
      createCoffeeParticles(particleContainerRef.current, { 
        count: 25, 
        speed: 0.8,
        minSize: 8,
        maxSize: 20
      });
    }

    // Magnetic buttons effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => magneticButton(btn, { strength: 0.3 }));

    // Text scramble on hover for title
    const titleLines = titleRef.current?.querySelectorAll('.title-line');
    if (titleLines && scrambleEnabled) {
      titleLines.forEach((line, index) => {
        line.addEventListener('mouseenter', () => {
          const originalText = line.textContent;
          const scrambledMap = {
            'Craft Your Perfect': 'Cr@ft Y0ur P3rf3ct',
            'Coffee Moment': 'C0ff33 M0m3nt',
            'Every Single Day': '3v3ry S1ngl3 D@y'
          };
          
          const scrambledText = scrambledMap[originalText] || originalText;
          
          textScramble(line, scrambledText, {
            duration: 0.4,
            chars: '!<>-_\\/[]{}—=+*^?#________'
          });
          
          setTimeout(() => {
            textScramble(line, originalText, { duration: 0.4 });
          }, 800);
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrambleEnabled]);

  const handleMouseMove = (e) => {
    if (!titleRef.current) return;
    
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;

    gsap.to(titleRef.current, {
      x: x * 0.5,
      y: y * 0.5,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleExploreMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWatchStory = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef} 
      className={`hero ${isLoaded ? 'loaded' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Parallax Background */}
      <div ref={bgRef} className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-gradient"></div>
        <div className="particles-container" ref={particleContainerRef}></div>
      </div>

      {/* Content Container */}
      <div className="hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-icon">☕</span>
            <span className="badge-text">Premium Coffee Experience</span>
          </div>

          {/* Headline */}
          <h1 ref={titleRef} className="hero-title">
            <span className="title-line">Craft Your Perfect</span>
            <span className="title-line title-highlight">Coffee Moment</span>
            <span className="title-line">Every Single Day</span>
          </h1>

          {/* Subheadline */}
          <p ref={subtitleRef} className="hero-subtitle">
            Experience the art of coffee brewing with our expertly curated selection 
            of premium beans, state-of-the-art equipment, and master barista techniques. 
            Transform your daily ritual into an extraordinary journey of flavor and aroma.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="hero-buttons">
            <button 
              className="btn btn-primary magnetic-btn"
              onClick={handleExploreMenu}
              aria-label="Explore our coffee menu"
            >
              <span className="btn-text">Explore Menu</span>
              <span className="btn-icon">→</span>
            </button>
            <button 
              className="btn btn-secondary magnetic-btn"
              onClick={handleWatchStory}
              aria-label="Watch our story"
            >
              <span className="btn-text">Watch Story</span>
              <span className="btn-icon">▶</span>
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Coffee Varieties</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
};

export default HeroEnhanced;