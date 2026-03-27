import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {

  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const timelineRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);
  const parallaxRef = useRef(null);
  const particlesRef = useRef([...Array(20)].map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 4 + 2
  })));

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse tracking for parallax and glow effects
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 30;
    const y = (clientY / window.innerHeight - 0.5) * 30;
    setMousePosition({ x, y });
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section with complex parallax and reveal
      const heroTimeline = gsap.timeline();
      
      heroTimeline
        .from('.about-hero', {
          opacity: 0,
          scale: 1.2,
          duration: 1.5,
          ease: 'power3.out'
        })
        .from('.about-title', {
          opacity: 0,
          y: 100,
          skewY: 7,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=1')
        .from('.about-subtitle', {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.8')
        .from('.hero-decoration', {
          opacity: 0,
          scale: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        }, '-=0.6')
        .from('.scroll-indicator', {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4');

      // Parallax layers in hero
      gsap.to('.parallax-layer-1', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
      
      gsap.to('.parallax-layer-2', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Story section with text reveal and image parallax
      gsap.fromTo('.story-container', 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.story-text', 
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.2,
          scrollTrigger: {
            trigger: '.story-content',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.story-image-wrapper', 
        { opacity: 0, scale: 0.8, rotation: -5 },
        {
          opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Timeline with 3D card effects
      gsap.fromTo('.timeline-container', 
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.timeline-card', 
        { opacity: 0, y: 150, rotationX: -15 },
        {
          opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.3, ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Animated timeline line
      gsap.fromTo('.timeline-line', 
        { scaleY: 0 },
        {
          scaleY: 1, transformOrigin: 'top center', duration: 2, ease: 'power2.inOut',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Statistics with counter animation and hover effects
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { value: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          onUpdate: () => {
            stat.innerHTML = obj.value.toLocaleString();
          }
        });
      });

      gsap.fromTo('.stat-card', 
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Team section with 3D tilt effects
      gsap.fromTo('.team-container', 
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.team-card', 
        { opacity: 0, y: 100, rotationY: -15 },
        {
          opacity: 1, y: 0, rotationY: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Values section with staggered reveal
      gsap.fromTo('.values-container', 
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.value-card', 
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Floating particles animation
      gsap.to('.particle', {
        y: -100,
        opacity: 0,
        duration: 3,
        stagger: 0.5,
        repeat: -1,
        ease: 'power1.inOut'
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Global mouse move for glow effect
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const timelineEvents = [
    { 
      year: '2015', 
      title: 'The Beginning', 
      description: 'Founded in a small garage with a single espresso machine and a dream to serve the perfect cup. Our first customer was a night-shift programmer who needed good coffee to debug code.' 
    },
    { 
      year: '2017', 
      title: 'First Expansion', 
      description: 'Opened our flagship downtown location, bringing our artisanal coffee to the heart of the city. The new space could fit 50 people and had a mural painted by a local artist.' 
    },
    { 
      year: '2019', 
      title: 'Award Winning', 
      description: 'Recognized as "Best Coffee Shop" by the city, validating our commitment to quality. We won for both our coffee and our community impact.' 
    },
    { 
      year: '2021', 
      title: 'Sustainability Focus', 
      description: 'Implemented zero-waste initiatives and partnered with local farmers for ethical sourcing. We became the first carbon-neutral café in the region.' 
    },
    { 
      year: '2023', 
      title: 'Community Hub', 
      description: 'Expanded to become a cultural center, hosting art shows, live music, and coffee workshops. We now host over 100 community events per year.' 
    }
  ];

  const teamMembers = [
    { 
      name: 'Marcus Chen', 
      role: 'Head Roaster', 
      image: '👨‍🍳', 
      bio: '15 years of roasting experience, obsessed with perfect extraction. Marcus can identify 50+ flavor notes in a single cup and travels to origin countries twice a year.',
      social: { email: 'marcus@hackercafe.com', linkedin: '#', instagram: '#' }
    },
    { 
      name: 'Sofia Rodriguez', 
      role: 'Creative Director', 
      image: '👩‍🎨', 
      bio: 'Designs our unique blends and creates the café aesthetic. Sofia has a background in industrial design and ensures every cup is a work of art.',
      social: { email: 'sofia@hackercafe.com', linkedin: '#', instagram: '#' }
    },
    { 
      name: 'James Wilson', 
      role: 'Barista Champion', 
      image: '🏆', 
      bio: 'National latte art champion, trains our entire staff. James can pour a perfect rosetta in under 3 seconds and has taught over 200 baristas.',
      social: { email: 'james@hackercafe.com', linkedin: '#', instagram: '#' }
    },
    { 
      name: 'Yuki Tanaka', 
      role: 'Sourcing Specialist', 
      image: '🌍', 
      bio: 'Travels the world finding the finest single-origin beans. Yuki speaks 5 languages and has visited coffee farms in 20+ countries.',
      social: { email: 'yuki@hackercafe.com', linkedin: '#', instagram: '#' }
    }
  ];

  const values = [
    { 
      icon: '🌿', 
      title: 'Sustainability', 
      description: 'Zero-waste operations, compostable packaging, and partnerships with eco-conscious farms. We offset 100% of our carbon emissions.' 
    },
    { 
      icon: '⚡', 
      title: 'Innovation', 
      description: 'Constantly experimenting with new brewing methods and flavor combinations. Our R&D lab creates 3 new blends every quarter.' 
    },
    { 
      icon: '🤝', 
      title: 'Community', 
      description: 'More than a café—we\'re a gathering place for creators, thinkers, and dreamers. 10% of profits fund local arts and tech education.' 
    },
    { 
      icon: '✨', 
      title: 'Excellence', 
      description: 'Every cup is crafted with precision, passion, and an uncompromising standard. Our baristas train for 100+ hours before serving customers.' 
    }
  ];

  return (
    <div 
      ref={sectionRef} 
      className="about-section"
      onMouseMove={handleMouseMove}
    >
      {/* Scroll progress indicator */}
      <div className="scroll-progress" style={{ '--progress': `${scrollProgress}%` }} />
      
      {/* Mouse glow effect */}
      <div 
        className="mouse-glow" 
        style={{ 
          '--x': `${mousePosition.x}px`, 
          '--y': `${mousePosition.y}px` 
        }} 
      />

      {/* Floating particles */}
      <div className="particles-container">
        {particlesRef.current.map((particle, i) => (
          <div key={i} className="particle" style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }} />
        ))}
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="about-hero">
        <div className="parallax-layer-1 hero-bg-decoration" />
        <div className="parallax-layer-2 hero-shapes">
          <div className="floating-image-wrapper shape-1">
            <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80" alt="Cafe Interior" className="hero-floating-img" />
          </div>
          <div className="floating-image-wrapper shape-2">
            <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=800&q=80" alt="Barista Crafting" className="hero-floating-img" />
          </div>
          <div className="floating-image-wrapper shape-3">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80" alt="Coffee Beans" className="hero-floating-img" />
          </div>
        </div>
        
        <div className="about-hero-content">
          <div className="hero-decoration">
            <span className="decoration-line" />
            <span className="decoration-dot" />
            <span className="decoration-line" />
          </div>
          <h1 className="about-title">Our Story</h1>
          <p className="about-subtitle">Brewing excellence since 2015</p>
          <div className="hero-cta">
            <button className="cta-button primary">
              <span>Explore</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </div>

      {/* Story Section */}
      <div ref={storyRef} className="story-section">
        <div className="story-container">
          <div className="section-header">
            <span className="section-tag">The Journey</span>
            <h2 className="section-title">The Hacker Café Journey</h2>
            <div className="title-underline" />
          </div>
          
          <div className="story-content">
            <div className="story-image-wrapper">
              <div className="story-image">
                <div className="image-placeholder">
                  <span>☕</span>
                  <p>Our First Location</p>
                </div>
              </div>
              <div className="image-decoration" />
            </div>
            
            <div className="story-text-group">
              <p className="story-text">
                It started with a simple question: What if a coffee shop could be more than just a place to grab caffeine? 
                What if it could be a sanctuary for dreamers, a launchpad for innovators, and a community for those who 
                refuse to accept the ordinary?
              </p>
              <p className="story-text">
                In 2015, we converted a tiny 400 sq ft garage into our first café. With one espresso machine, 
                a handful of carefully sourced beans, and an unwavering commitment to quality, we began our mission. 
                Every cup was crafted with precision, every customer treated like family.
              </p>
              <p className="story-text">
                Today, we've grown to 5 locations but our soul remains unchanged. We source beans from sustainable farms 
                across 12 countries, roast them in small batches in our own roastery, and serve them with the same passion 
                that started it all. Our café isn't just about coffee—it's about creating moments that matter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={timelineRef} className="timeline-section">
        <div className="timeline-container">
          <div className="section-header">
            <span className="section-tag">Milestones</span>
            <h2 className="section-title">Our Journey Through Time</h2>
            <div className="title-underline" />
          </div>
          
          <div className="timeline-wrapper">
            <div className="timeline-line" />
            
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`timeline-card ${index % 2 === 0 ? 'left' : 'right'}`}
                style={{ '--card-index': index }}
              >
                <div className="timeline-year">{event.year}</div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-description">{event.description}</p>
                  <div className="timeline-decoration" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div ref={statsRef} className="stats-section">
        <div className="stats-container">
          <div className="section-header">
            <span className="section-tag">Impact</span>
            <h2 className="section-title">By The Numbers</h2>
            <div className="title-underline" />
          </div>
          
          <div className="stats-grid">
            {[
              { icon: '☕', target: 500000, label: 'Cups Served', stat: 'cups' },
              { icon: '📅', target: 8, label: 'Years Open', stat: 'years' },
              { icon: '🌱', target: 25, label: 'Partner Farms', stat: 'farms' },
              { icon: '⭐', target: 48, label: 'Awards Won', stat: 'awards' },
              { icon: '👥', target: 15000, label: 'Happy Customers', stat: 'customers' },
              { icon: '🔥', target: 12, label: 'Unique Blends', stat: 'blends' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="stat-card"
                data-stat={stat.stat}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number" data-target={stat.target}>0</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-glow" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div ref={teamRef} className="team-section">
        <div className="team-container">
          <div className="section-header">
            <span className="section-tag">The Team</span>
            <h2 className="section-title">Meet The Dreamers</h2>
            <p className="team-subtitle">The passionate people behind every perfect cup</p>
            <div className="title-underline" />
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-card"
                onMouseEnter={() => setHoveredTeam(index)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                <div className="team-image-wrapper">
                  <div className="team-image">{member.image}</div>
                  <div className="team-image-glow" />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-social">
                  <a href={member.social.email} className="social-link" aria-label="Email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                  <a href={member.social.linkedin} className="social-link" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href={member.social.instagram} className="social-link" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                </div>
                <div className="team-card-glow" style={{ opacity: hoveredTeam === index ? 1 : 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div ref={valuesRef} className="values-section">
        <div className="values-container">
          <div className="section-header">
            <span className="section-tag">Philosophy</span>
            <h2 className="section-title">What We Stand For</h2>
            <div className="title-underline" />
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  <div className="value-icon">{value.icon}</div>
                  <div className="icon-glow" />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
                <div className="value-decoration" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Join Our Story?</h2>
          <p className="cta-subtitle">Visit us today and experience the Hacker Café difference</p>
          <div className="cta-buttons">
            <button className="cta-button primary large">
              <span>Find a Location</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
            <button className="cta-button secondary large">
              <span>Join Our Team</span>
            </button>
          </div>
        </div>
        <div className="cta-decoration">
          <div className="deco-circle" />
          <div className="deco-circle" />
          <div className="deco-circle" />
        </div>
      </div>
    </div>
  );
};

export default About;
