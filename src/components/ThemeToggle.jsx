import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('default');
  const toggleRef = useRef(null);
  const paletteRef = useRef(null);
  const longPressTimer = useRef(null);

  // Custom color palettes
  const palettes = {
    default: {
      dark: { bg: '#0a0a0a', text: '#ffffff', accent: '#6366f1', surface: '#1a1a1a' },
      light: { bg: '#ffffff', text: '#0a0a0a', accent: '#6366f1', surface: '#f5f5f5' }
    },
    ocean: {
      dark: { bg: '#0f172a', text: '#e2e8f0', accent: '#38bdf8', surface: '#1e293b' },
      light: { bg: '#f0f9ff', text: '#0f172a', accent: '#0284c7', surface: '#e0f2fe' }
    },
    forest: {
      dark: { bg: '#14532d', text: '#f0fdf4', accent: '#4ade80', surface: '#166534' },
      light: { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', surface: '#dcfce7' }
    },
    sunset: {
      dark: { bg: '#431407', text: '#ffedd5', accent: '#fb923c', surface: '#7c2d12' },
      light: { bg: '#fff7ed', text: '#431407', accent: '#ea580c', surface: '#ffedd5' }
    },
    midnight: {
      dark: { bg: '#020617', text: '#f8fafc', accent: '#818cf8', surface: '#1e293b' },
      light: { bg: '#f8fafc', text: '#020617', accent: '#6366f1', surface: '#e2e8f0' }
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedPalette = localStorage.getItem('colorPalette') || 'default';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }

    setCurrentPalette(savedPalette);
    applyPalette(savedPalette, savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  // Apply color palette
  const applyPalette = (paletteName, dark) => {
    const palette = palettes[paletteName]?.[dark ? 'dark' : 'light'];
    if (!palette) return;
    const root = document.documentElement;
    root.style.setProperty('--color-bg', palette.bg);
    root.style.setProperty('--color-text', palette.text);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-surface', palette.surface);
  };

  // Toggle theme with GSAP animation
  const toggleTheme = (e) => {
    if (showPalette) {
      setShowPalette(false);
      return;
    }
    setIsAnimating(true);
    const newTheme = !isDark;
    gsap.to(toggleRef.current, {
      rotation: 360,
      duration: 0.4,
      ease: 'back.out(1.7)',
      onComplete: () => {
        setIsDark(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        applyPalette(currentPalette, newTheme);
        gsap.fromTo(toggleRef.current, { rotation: -360 }, { rotation: 0, duration: 0.3, ease: 'power2.out' });
        setIsAnimating(false);
      }
    });
    const thumb = toggleRef.current?.querySelector('.toggle-thumb');
    if (thumb) {
      gsap.to(thumb, { x: newTheme ? 24 : 0, duration: 0.3, ease: 'power2.inOut' });
    }
  };

  // Handle long press for palette
  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowPalette(true);
      gsap.fromTo(paletteRef.current, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(1.5)' });
    }, 500);
  };
  const handleMouseUp = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };
  const handleMouseLeave = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

  // Select palette
  const selectPalette = (paletteName) => {
    setCurrentPalette(paletteName);
    localStorage.setItem('colorPalette', paletteName);
    applyPalette(paletteName, isDark);
    setShowPalette(false);
    gsap.to(toggleRef.current, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
  };

  // Custom tooltip
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const handleMouseMove = (e) => {
    if (!showPalette) {
      const rect = toggleRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltip({ visible: true, x: e.clientX, y: e.clientY - 30, text: `Hold for palettes` });
      }
    }
  };
  const handleMouseLeaveTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));

  return (
    <div className="theme-toggle-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeaveTooltip}>
      <button
        ref={toggleRef}
        className={`theme-toggle ${isDark ? 'dark' : 'light'} ${isAnimating ? 'animating' : ''}`}
        onClick={toggleTheme}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode. Current palette: ${currentPalette}`}
        title=""
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            <span className="icon sun">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>
            <span className="icon moon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </div>
        </div>
        <span className="sr-only">Toggle theme</span>
      </button>

      {tooltip.visible && (
        <div className="theme-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      {showPalette && (
        <div ref={paletteRef} className="palette-selector">
          <div className="palette-header">Choose Palette</div>
          <div className="palette-grid">
            {Object.keys(palettes).map(palette => (
              <button
                key={palette}
                className={`palette-option ${currentPalette === palette ? 'active' : ''}`}
                onClick={() => selectPalette(palette)}
                title={palette}
              >
                <div className="palette-preview">
                  <div className="color-swatch" style={{ backgroundColor: palettes[palette].dark.bg }}></div>
                  <div className="color-swatch" style={{ backgroundColor: palettes[palette].dark.accent }}></div>
                  <div className="color-swatch" style={{ backgroundColor: palettes[palette].dark.surface }}></div>
                </div>
                <span className="palette-name">{palette}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
