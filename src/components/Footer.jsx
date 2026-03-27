import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import '../styles/Footer.css';

// Import existing components if available
let ThemeToggle, SoundSystem;
try {
  const themeModule = require('../components/ThemeToggle');
  if (themeModule && themeModule.default) ThemeToggle = themeModule.default;
} catch (e) {
  // ThemeToggle component not available
}
try {
  const soundModule = require('../components/SoundSystem');
  if (soundModule && soundModule.default) SoundSystem = soundModule.default;
} catch (e) {
  // SoundSystem component not available
}

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showKonami, setShowKonami] = useState(false);
  const [particles, setParticles] = useState([]);

  // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [keySequence, setKeySequence] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newSequence = [...keySequence, e.key.toLowerCase()].slice(-10);
      setKeySequence(newSequence);

      if (newSequence.join(',') === konamiCode.join(',')) {
        setShowKonami(true);
        setTimeout(() => setShowKonami(false), 3000);
        // Trigger particle explosion
        createParticleExplosion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence]);

  const createParticleExplosion = useCallback(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 2 + 1,
      color: ['#d4a574', '#f5e6d3', '#8b5a2b', '#c4956a'][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
      // Play success sound if SoundSystem exists
      if (SoundSystem && SoundSystem.playSuccess) {
        SoundSystem.playSuccess();
      }
    }
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Locations', href: '#locations' },
    { name: 'Contact', href: '#contact' },
    { name: 'Careers', href: '#careers' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: '📸', href: 'https://instagram.com' },
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
    { name: 'Facebook', icon: '👍', href: 'https://facebook.com' },
    { name: 'TikTok', icon: '🎵', href: 'https://tiktok.com' },
    { name: 'GitHub', icon: '💻', href: 'https://github.com' },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const particleVariants = {
    initial: { opacity: 1, scale: 1 },
    animate: {
      opacity: 0,
      scale: 0,
      transition: { duration: 2, ease: 'easeOut' },
    },
  };

  return (
    <motion.footer
      className="footer"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Particle Effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="footer-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          variants={particleVariants}
          initial="initial"
          animate="animate"
        />
      ))}

      {/* Konami Code Easter Egg */}
      {showKonami && (
        <motion.div
          className="konami-easter-egg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <span className="konami-coffee">☕</span>
          <span className="konami-text">SECRET BREW UNLOCKED! 🎉</span>
          <span className="konami-coffee">☕</span>
        </motion.div>
      )}

      <div className="footer-container">
        {/* Brand Section */}
        <motion.div className="footer-brand" variants={itemVariants}>
          <h2 className="footer-logo">☕ Hacker Café</h2>
          <p className="footer-tagline">
            Fueling developers one cup at a time
          </p>
          <div className="footer-decoration">
            <span className="coffee-bean">☕</span>
            <span className="coffee-bean">☕</span>
            <span className="coffee-bean">☕</span>
          </div>
          {/* Theme Toggle */}
          {ThemeToggle && (
            <div className="footer-theme-toggle">
              <ThemeToggle />
            </div>
          )}
          {/* Sound Toggle */}
          {SoundSystem && (
            <div className="footer-sound-toggle">
              <SoundSystem />
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div className="footer-section" variants={itemVariants}>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.href}
                  className="footer-link"
                  whileHover={{ x: 5, color: '#d4a574' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social Media */}
        <motion.div className="footer-section" variants={itemVariants}>
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={social.name}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span className="icon-emoji">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div className="footer-section newsletter-section" variants={itemVariants}>
          <h3 className="footer-title">Stay Updated</h3>
          <p className="newsletter-text">
            Get exclusive offers and brewing tips
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <motion.input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.button
              type="submit"
              className="newsletter-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
            </motion.button>
          </form>
          {isSubscribed && (
            <motion.p
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Thanks for subscribing! ☕
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="footer-bottom"
        variants={itemVariants}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="footer-bottom-content">
          <p className="copyright">
            © {new Date().getFullYear()} Hacker Café. All rights reserved.
          </p>
          <div className="legal-links">
            <a href="#privacy" className="legal-link">
              Privacy Policy
            </a>
            <span className="separator">|</span>
            <a href="#terms" className="legal-link">
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;