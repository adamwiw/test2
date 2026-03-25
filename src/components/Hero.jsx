import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const [isDark, setIsDark] = useState(true);

  // Toggle dark/light mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
              : `rgba(0, 0, 0, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Headline animation
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2
      });

      // Subtitle animation
      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
      });

      // CTA button animation
      gsap.from('.hero-cta', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.6
      });

      // Scroll indicator animation
      gsap.from('.scroll-indicator', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background */}
      <div className="hero-bg absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920"
          alt="Cafe background"
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isDark
            ? 'from-black/70 via-black/50 to-black/70'
            : 'from-white/70 via-white/50 to-white/70'
        }`} />
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="hero-title mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
          <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Experience Coffee
          </span>
          <span className={`block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent`}>
            Reimagined
          </span>
        </h1>

        <p className="hero-subtitle mb-10 max-w-2xl text-lg md:text-xl lg:text-2xl">
          <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
            Where every cup tells a story. Artisan coffee, crafted with passion,
            served in an atmosphere that inspires.
          </span>
        </p>

        <div className="hero-cta flex flex-col gap-4 sm:flex-row">
          <button
            className={`group relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            <span className="relative z-10">Explore Menu</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
          </button>

          <button
            className={`group relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              isDark
                ? 'border-2 border-white/30 bg-transparent text-white backdrop-blur-sm hover:bg-white/10'
                : 'border-2 border-black/30 bg-transparent text-black backdrop-blur-sm hover:bg-black/10'
            }`}
          >
            <span className="relative z-10">Our Story</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className={`text-sm uppercase tracking-widest ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            Scroll
          </span>
          <svg
            className={`h-6 w-6 ${isDark ? 'text-white' : 'text-black'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Glassmorphism decorative elements */}
      <div className={`absolute top-20 right-20 z-0 h-32 w-32 rounded-2xl ${
        isDark
          ? 'bg-white/10 backdrop-blur-md'
          : 'bg-black/5 backdrop-blur-md'
      } border ${
        isDark ? 'border-white/20' : 'border-black/10'
      } rotate-12 opacity-50`} />
      <div className={`absolute bottom-20 left-20 z-0 h-24 w-24 rounded-2xl ${
        isDark
          ? 'bg-white/10 backdrop-blur-md'
          : 'bg-black/5 backdrop-blur-md'
      } border ${
        isDark ? 'border-white/20' : 'border-black/10'
      } -rotate-12 opacity-50`} />
    </section>
  );
};

export default Hero;
