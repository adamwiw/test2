import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Navigation.css';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [focusedMobileIndex, setFocusedMobileIndex] = useState(-1);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const firstMobileLinkRef = useRef(null);
  const lastMobileLinkRef = useRef(null);
  const announcerRef = useRef(null);

  // Announce changes to screen readers
  const announce = useCallback((message) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
      setTimeout(() => {
        if (announcerRef.current) announcerRef.current.textContent = '';
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animations for navigation
  useEffect(() => {
    // Entrance animation
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Mobile menu animation and focus management
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(mobileOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      document.body.style.overflow = 'hidden';

      // Animate mobile links with stagger
      gsap.fromTo(mobileLinksRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
      );

      // Focus first mobile link after animation
      setTimeout(() => {
        if (firstMobileLinkRef.current) {
          firstMobileLinkRef.current.focus();
          setFocusedMobileIndex(0);
        }
        announce('Mobile menu opened');
      }, 600);
    } else {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      });
      gsap.to(mobileOverlayRef.current, {
        opacity: 0,
        duration: 0.3
      });
      document.body.style.overflow = '';
      setFocusedMobileIndex(-1);
      announce('Mobile menu closed');
    }
  }, [isMobileMenuOpen, announce]);

  // Keyboard navigation for mobile menu
  const handleMobileKeyDown = useCallback((e) => {
    if (!isMobileMenuOpen) return;

    const numLinks = mobileLinksRef.current.length;
    if (numLinks === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = focusedMobileIndex < numLinks - 1 ? focusedMobileIndex + 1 : 0;
        setFocusedMobileIndex(nextIndex);
        mobileLinksRef.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = focusedMobileIndex > 0 ? focusedMobileIndex - 1 : numLinks - 1;
        setFocusedMobileIndex(prevIndex);
        mobileLinksRef.current[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        setFocusedMobileIndex(0);
        firstMobileLinkRef.current?.focus();
        break;
      case 'End':
        e.preventDefault();
        setFocusedMobileIndex(numLinks - 1);
        lastMobileLinkRef.current?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        setIsMobileMenuOpen(false);
        break;
    }
  }, [isMobileMenuOpen, focusedMobileIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleMobileKeyDown);
    return () => window.removeEventListener('keydown', handleMobileKeyDown);
  }, [handleMobileKeyDown]);

  const handleLinkClick = (href) => {
    setActiveLink(href);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Menu', href: '#menu', icon: '☕' },
    { name: 'Our Story', href: '#story', icon: '📖' },
    { name: 'Locations', href: '#locations', icon: '📍' },
    { name: 'Contact', href: '#contact', icon: '✉️' },
  ];

  return (
    <>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen reader announcer */}
      <div
        ref={announcerRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <nav
        ref={navRef}
        className={`navigation ${isScrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          {/* Logo */}
          <div
            className="nav-logo"
            onClick={() => handleLinkClick('/')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLinkClick('/');
              }
            }}
            tabIndex={0}
            role="link"
            aria-label="Hacker Café home"
          >
            <span className="logo-icon" aria-hidden="true">☕</span>
            <span className="logo-text">Hacker Café</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`nav-link ${activeLink === link.href ? 'active' : ''}`}
                onClick={() => handleLinkClick(link.href)}
                aria-current={activeLink === link.href ? 'page' : undefined}
                aria-label={`Navigate to ${link.name} page`}
              >
                <span className="link-icon" aria-hidden="true">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="nav-cta desktop-nav">
            <button
              className="cta-button"
              aria-label="Order now"
            >
              Order Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="toggle-line line-1"></span>
            <span className="toggle-line line-2"></span>
            <span className="toggle-line line-3"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        ref={mobileOverlayRef}
        className="mobile-overlay"
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-menu-content">
          <div className="mobile-header">
            <span className="mobile-logo-icon" aria-hidden="true">☕</span>
            <h2 className="mobile-logo-text">Hacker Café</h2>
          </div>

          <nav className="mobile-nav-links">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                ref={(el) => {
                  mobileLinksRef.current[index] = el;
                  if (index === 0) firstMobileLinkRef.current = el;
                  if (index === navLinks.length - 1) lastMobileLinkRef.current = el;
                }}
                className={`mobile-nav-link ${activeLink === link.href ? 'active' : ''}`}
                onClick={() => handleLinkClick(link.href)}
                aria-current={activeLink === link.href ? 'page' : undefined}
                aria-label={`Navigate to ${link.name} page`}
              >
                <span className="mobile-link-icon" aria-hidden="true">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mobile-cta-section">
            <button
              className="mobile-cta-button"
              aria-label="Order now from mobile menu"
            >
              Order Now
            </button>
          </div>

          <div className="mobile-footer">
            <p className="mobile-footer-text">
              Follow us for daily brews ☕
            </p>
            <div className="mobile-social-links" role="list" aria-label="Social media links">
              {['📸', '🐦', '👍', '🎵'].map((icon, index) => (
                <span
                  key={index}
                  className="mobile-social-icon"
                  role="listitem"
                  aria-label={`Follow us on ${['Instagram', 'Twitter', 'Facebook', 'TikTok'][index]}`}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
