/**
 * ScrollAnimations Utility
 * Comprehensive scroll-based animation helpers using Intersection Observer and GSAP
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll to element with optional offset
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Scroll options
 * @param {number} options.offset - Offset from top (default: 0)
 * @param {number} options.duration - Animation duration in ms (default: 800)
 * @param {string} options.easing - Easing function (default: 'easeInOutCubic')
 */
export const smoothScroll = (target, options = {}) => {
  const {
    offset = 0,
    duration = 800,
    easing = 'easeInOutCubic'
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const easeProgress = easing === 'easeInOutCubic'
      ? progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      : progress;

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

/**
 * Intersection Observer for scroll-triggered callbacks
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Function} callback - Callback function when element enters viewport
 * @param {Object} options - Observer options
 */
export const observeScroll = (target, callback, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, entry);
        if (once) observer.unobserve(entry.target);
      }
    });
  }, { threshold, rootMargin });

  observer.observe(element);
  return observer;
};

/**
 * GSAP ScrollTrigger animation helper
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} animationProps - GSAP animation properties
 * @param {Object} triggerOptions - ScrollTrigger options
 */
export const scrollTriggerAnimation = (target, animationProps = {}, triggerOptions = {}) => {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  const {
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    toggleActions = 'play none none reverse',
    ...restTriggerOptions
  } = triggerOptions;

  return gsap.fromTo(element, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      ...animationProps,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        toggleActions,
        ...restTriggerOptions
      }
    }
  );
};

/**
 * Reveal elements on scroll with staggered animation
 * @param {string|NodeList} targets - Target elements or selector
 * @param {Object} options - Animation options
 */
export const revealOnScroll = (targets, options = {}) => {
  const {
    stagger = 0.1,
    duration = 0.8,
    yStart = 50,
    threshold = 0.1,
    className = 'reveal-on-scroll'
  } = options;

  const elements = typeof targets === 'string' 
    ? document.querySelectorAll(targets)
    : targets;

  if (!elements || elements.length === 0) return;

  elements.forEach((el, index) => {
    el.classList.add(className);
    gsap.set(el, { 
      opacity: 0, 
      y: yStart,
      visibility: 'hidden'
    });

    observeScroll(el, () => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power2.out',
        visibility: 'visible',
        delay: index * stagger,
        onComplete: () => el.classList.remove(className)
      });
    }, { threshold, once: true });
  });
};

/**
 * Parallax effect helper
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Parallax options
 */
export const parallaxEffect = (target, options = {}) => {
  const {
    speed = 0.5,
    direction = 'vertical',
    scrub = true,
    start = 'top bottom',
    end = 'bottom top'
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  const motionProps = direction === 'vertical'
    ? { y: (i, target) => -target.offsetHeight * speed }
    : { x: (i, target) => -target.offsetWidth * speed };

  return gsap.to(element, {
    ...motionProps,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub,
      invalidateOnRefresh: true
    }
  });
};

/**
 * Batch reveal animation for multiple elements
 * @param {string|NodeList} targets - Target elements or selector
 * @param {Object} options - Batch animation options
 */
export const batchReveal = (targets, options = {}) => {
  const {
    batchSize = 5,
    interval = 0.15,
    duration = 0.6,
    scaleStart = 0.8,
    threshold = 0.2
  } = options;

  const elements = typeof targets === 'string' 
    ? document.querySelectorAll(targets)
    : targets;

  if (!elements || elements.length === 0) return;

  const batches = [];
  for (let i = 0; i < elements.length; i += batchSize) {
    batches.push(Array.from(elements).slice(i, i + batchSize));
  }

  batches.forEach((batch, batchIndex) => {
    batch.forEach(el => {
      gsap.set(el, {
        opacity: 0,
        scale: scaleStart,
        transformOrigin: 'center center'
      });
    });

    observeScroll(batch[0], () => {
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        duration,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        delay: batchIndex * interval
      });
    }, { threshold, once: true });
  });
};

/**
 * Horizontal scroll section animation
 * @param {string} container - Container selector
 * @param {string} sections - Sections selector
 * @param {Object} options - Animation options
 */
export const horizontalScroll = (container, sections, options = {}) => {
  const {
    pin = true,
    scrub = 1,
    snap = 1 / (document.querySelectorAll(sections).length - 1)
  } = options;

  const containerEl = document.querySelector(container);
  const sectionsEl = document.querySelectorAll(sections);

  if (!containerEl || sectionsEl.length === 0) return;

  gsap.to(sectionsEl, {
    xPercent: -100 * (sectionsEl.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: containerEl,
      pin,
      scrub,
      snap,
      end: `+=${containerEl.offsetWidth}`
    }
  });
};

/**
 * Text reveal animation (character by character)
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Animation options
 */
export const textReveal = (target, options = {}) => {
  const {
    duration = 0.05,
    stagger = 0.02,
    threshold = 0.5,
    yStart = 100
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  const text = element.textContent;
  element.innerHTML = '';

  const chars = text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = `translateY(${yStart}px)`;
    element.appendChild(span);
    return span;
  });

  observeScroll(element, () => {
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out'
    });
  }, { threshold, once: true });
};

/**
 * Scale on scroll effect
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Scale options
 */
export const scaleOnScroll = (target, options = {}) => {
  const {
    startScale = 0.5,
    endScale = 1,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  gsap.fromTo(element,
    { scale: startScale },
    {
      scale: endScale,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub
      }
    }
  );
};

/**
 * Rotate on scroll effect
 * @param {string|HTMLElement} target - Target element or selector
 * @param {Object} options - Rotation options
 */
export const rotateOnScroll = (target, options = {}) => {
  const {
    rotation = 360,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true
  } = options;

  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) return;

  gsap.to(element, {
    rotation,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub
    }
  });
};

/**
 * Cleanup all ScrollTrigger instances
 */
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Refresh all ScrollTrigger instances (useful after DOM changes)
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

/**
 * Initialize multiple scroll animations at once
 * @param {Array} animations - Array of animation configurations
 */
export const initScrollAnimations = (animations) => {
  const triggers = [];

  animations.forEach(config => {
    const { type, target, options = {} } = config;

    switch (type) {
      case 'reveal':
        triggers.push(revealOnScroll(target, options));
        break;
      case 'parallax':
        triggers.push(parallaxEffect(target, options));
        break;
      case 'textReveal':
        textReveal(target, options);
        break;
      case 'scale':
        scaleOnScroll(target, options);
        break;
      case 'rotate':
        rotateOnScroll(target, options);
        break;
      case 'scrollTrigger':
        triggers.push(scrollTriggerAnimation(target, options.animationProps, options.triggerOptions));
        break;
      default:
        console.warn(`Unknown animation type: ${type}`);
    }
  });

  return triggers;
};

export default {
  smoothScroll,
  observeScroll,
  scrollTriggerAnimation,
  revealOnScroll,
  parallaxEffect,
  batchReveal,
  horizontalScroll,
  textReveal,
  scaleOnScroll,
  rotateOnScroll,
  cleanupScrollTriggers,
  refreshScrollTriggers,
  initScrollAnimations
};
