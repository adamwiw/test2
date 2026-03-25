import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax effect for hero background
 * Creates a smooth parallax scrolling effect on the hero background image
 * @param {HTMLElement} element - The element to apply parallax to (usually background image container)
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Parallax speed multiplier (default: 0.5)
 * @param {string} options.axis - 'y' (vertical) or 'x' (horizontal) parallax (default: 'y')
 */
export const parallaxHero = (element, options = {}) => {
  const { speed = 0.5, axis = 'y' } = options;

  if (!element) return;

  gsap.to(element, {
    [axis]: `-=${100 * speed}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

/**
 * Fade-in on scroll for sections
 * Animates elements as they enter the viewport
 * @param {HTMLElement|NodeList} elements - Element(s) to animate
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Animation duration in seconds (default: 0.8)
 * @param {string} options.direction - 'up', 'down', 'left', 'right' (default: 'up')
 * @param {number} options.distance - Distance to travel in pixels (default: 50)
 * @param {number} options.delay - Delay between each element in seconds (default: 0.1)
 * @param {string} options.trigger - CSS selector for trigger element (default: elements themselves)
 */
export const fadeInOnScroll = (elements, options = {}) => {
  const {
    duration = 0.8,
    direction = 'up',
    distance = 50,
    delay = 0.1,
    trigger = null,
  } = options;

  const elementList = elements instanceof NodeList ? elements : [elements];
  const triggerElement = trigger ? document.querySelector(trigger) : null;

  elementList.forEach((el, index) => {
    if (!el) return;

    const fromVars = {
      opacity: 0,
      [direction]: distance,
    };

    const toVars = {
      opacity: 1,
      [direction]: 0,
      duration,
      ease: 'power3.out',
    };

    if (triggerElement) {
      toVars.scrollTrigger = {
        trigger: triggerElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      };
    } else {
      toVars.scrollTrigger = {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      };
    }

    gsap.fromTo(el, fromVars, toVars);
  });
};

/**
 * Staggered fade-in for multiple elements
 * @param {string} selector - CSS selector for elements
 * @param {Object} options - Configuration options
 */
export const staggerFadeIn = (selector, options = {}) => {
  const {
    duration = 0.6,
    distance = 30,
    stagger = 0.15,
    ease = 'power2.out',
  } = options;

  gsap.from(selector, {
    opacity: 0,
    y: distance,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
    },
  });
};

/**
 * Floating coffee bean particles using canvas
 * Creates animated coffee beans floating in the background
 * @param {HTMLElement} container - Container element for the canvas
 * @param {Object} options - Configuration options
 * @param {number} options.count - Number of particles (default: 30)
 * @param {number} options.minSize - Minimum particle size (default: 8)
 * @param {number} options.maxSize - Maximum particle size (default: 20)
 * @param {string} options.color - Particle color (default: '#6F4E37')
 * @param {number} options.speed - Animation speed multiplier (default: 1)
 */
export const createCoffeeParticles = (container, options = {}) => {
  const {
    count = 30,
    minSize = 8,
    maxSize = 20,
    color = '#6F4E37',
    speed = 1,
  } = options;

  if (!container) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  // Resize canvas to match container
  const resizeCanvas = () => {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (maxSize - minSize) + minSize;
      this.speedX = (Math.random() - 0.5) * 0.5 * speed;
      this.speedY = (Math.random() - 0.5) * 0.5 * speed - 0.2 * speed;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02 * speed;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      // Wrap around edges
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = color;

      // Draw coffee bean shape (simplified)
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add center line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.size / 2, 0);
      ctx.quadraticCurveTo(0, this.size / 4, this.size / 2, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Initialize particles
  const initParticles = () => {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    animationId = requestAnimationFrame(animate);
  };

  // Start
  resizeCanvas();
  initParticles();
  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    particles.forEach(p => p.reset());
  });

  // Return cleanup function
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
};

/**
 * CSS-based floating coffee beans (lighter alternative to canvas)
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 */
export const createCoffeeBeansCSS = (container, options = {}) => {
  const {
    count = 15,
    minSize = 10,
    maxSize = 25,
    color = '#6F4E37',
  } = options;

  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    .coffee-bean {
      position: absolute;
      pointer-events: none;
      opacity: 0.15;
      animation: floatBean 15s infinite ease-in-out;
    }
    @keyframes floatBean {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(90deg); }
      50% { transform: translateY(0) rotate(180deg); }
      75% { transform: translateY(20px) rotate(270deg); }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < count; i++) {
    const bean = document.createElement('div');
    bean.className = 'coffee-bean';
    const size = Math.random() * (maxSize - minSize) + minSize;
    bean.style.width = `${size}px`;
    bean.style.height = `${size / 2}px`;
    bean.style.background = color;
    bean.style.borderRadius = '50%';
    bean.style.left = `${Math.random() * 100}%`;
    bean.style.top = `${Math.random() * 100}%`;
    bean.style.animationDelay = `${Math.random() * 15}s`;
    bean.style.animationDuration = `${15 + Math.random() * 10}s`;
    container.appendChild(bean);
  }

  // Return cleanup function
  return () => {
    document.head.removeChild(style);
    const beans = container.querySelectorAll('.coffee-bean');
    beans.forEach(bean => bean.remove());
  };
};

/**
 * Magnetic button effect
 * Makes buttons follow the cursor slightly when hovering
 * @param {HTMLElement} button - Button element
 * @param {Object} options - Configuration options
 */
export const magneticButton = (button, options = {}) => {
  const { strength = 0.3, resetStrength = 0.8 } = options;

  if (!button) return;

  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  button.addEventListener('mousemove', (e) => {
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  });
};

/**
 * Text scramble effect
 * Animates text by scrambling characters before revealing
 * @param {HTMLElement} element - Text element
 * @param {string} newText - Text to display
 * @param {Object} options - Configuration options
 */
export const textScramble = (element, newText, options = {}) => {
  const {
    duration = 0.5,
    chars = '!<>-_\\/[]{}—=+*^?#________',
  } = options;

  if (!element) return;

  const originalText = element.textContent;
  const length = Math.max(originalText.length, newText.length);
  let startTime = null;

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

    let output = '';
    for (let i = 0; i < length; i++) {
      if (i < progress * length) {
        output += newText[i] || '';
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = newText;
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Smooth scroll to section
 * @param {string} targetId - ID of target element
 * @param {Object} options - Configuration options
 */
export const smoothScrollTo = (targetId, options = {}) => {
  const { duration = 1, offset = 0 } = options;
  const target = document.getElementById(targetId);

  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

  gsap.to(window, {
    duration,
    scrollTo: { y: targetPosition, autoKill: false },
    ease: 'power3.inOut',
  });
};

/**
 * Initialize all common animations for the cafe demo
 * Call this once on page load
 */
export const initCafeAnimations = () => {
  // Parallax hero background
  const heroBg = document.querySelector('.hero-background');
  if (heroBg) {
    parallaxHero(heroBg, { speed: 0.6 });
  }

  // Fade in sections
  const sections = document.querySelectorAll('.animate-on-scroll');
  if (sections.length) {
    fadeInOnScroll(sections, { direction: 'up', distance: 60 });
  }

  // Stagger menu items
  const menuItems = document.querySelectorAll('.menu-item');
  if (menuItems.length) {
    staggerFadeIn('.menu-item', { stagger: 0.1, distance: 40 });
  }

  // Stagger gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    staggerFadeIn('.gallery-item', { stagger: 0.08, distance: 50 });
  }

  // Stagger testimonials
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialCards.length) {
    staggerFadeIn('.testimonial-card', { stagger: 0.15, distance: 30 });
  }

  // Magnetic buttons
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => magneticButton(btn));

  // Create coffee particles (choose canvas or CSS)
  const particleContainer = document.querySelector('.particles-container');
  if (particleContainer) {
    // Use canvas version for better performance with many particles
    createCoffeeParticles(particleContainer, { count: 25, speed: 0.8 });
  }

  // CSS floating beans as fallback/alternative
  const beanContainer = document.querySelector('.bean-particles');
  if (beanContainer && !particleContainer) {
    createCoffeeBeansCSS(beanContainer, { count: 12 });
  }

  console.log('☕ Cafe animations initialized!');
};

export default {
  parallaxHero,
  fadeInOnScroll,
  staggerFadeIn,
  createCoffeeParticles,
  createCoffeeBeansCSS,
  magneticButton,
  textScramble,
  smoothScrollTo,
  initCafeAnimations,
};