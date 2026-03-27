import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import './EasterEggs.css';

/**
 * EasterEggs Component
 * 
 * Hidden secrets and special effects triggered by:
 * - Konami Code: ↑↑↓↓←→←→BA
 * - Console messages
 * - Special interactions
 * - Secret clicks
 * - Hidden messages
 */
const EasterEggs = () => {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const [secretMessage, setSecretMessage] = useState('');
  const [secretMode, setSecretMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [coffeeCupPosition, setCoffeeCupPosition] = useState({ x: -100, y: -100 });
  const [showCoffeeCup, setShowCoffeeCup] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [showPixelArt, setShowPixelArt] = useState(false);
  const clickAreaRef = useRef(null);
  
  // Konami code sequence: ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, KeyB, KeyA
  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  
  // Secret messages for console
  const SECRET_MESSAGES = [
    "🎮 You found the console! You're a true explorer!",
    "☕ The coffee knows your secrets...",
    "🚀 Psst... try the Konami code: ↑↑↓↓←→←→BA",
    "🎉 Congratulations! You're one of the 1% who checks the console!",
    "🔮 The code is all around you... if you know where to look",
    "⚡ Speed demon detected! You found this quickly!",
    "🌟 Star power activated! (Just kidding, but keep looking!)",
    "🎪 Welcome to the secret club! Membership: 1",
    "💎 Diamonds are forever, but secrets are temporary...",
    "🎵 The coffee is brewing... can you hear it?",
    "🔧 Developer mode: Type 'window.devMode()' to unlock",
    "🎨 Hidden art: Triple-click the logo to reveal pixel magic",
    "☀️  The sun is hot, but the coffee is hotter",
    "🌙 Night mode: Press 'N' for a dark surprise",
    "🎯 Bullseye! You found another secret"
  ];
  
  // Easter egg effects
  const EASTER_EGG_EFFECTS = [
    'rainbow-mode',
    'matrix-rain',
    'confetti-blast',
    'neon-glow',
    'retro-glitch',
    'coffee-spill',
    'starfield',
    'bubble-mode',
    'fireworks',
    'aurora-borealis'
  ];
  
  // Hidden messages that appear on specific interactions
  const HIDDEN_MESSAGES = [
    "You have the eye of a hawk! 🦅",
    "The coffee cup is watching you... ☕👁️",
    "Secret #42: The best coffee is the one you don't have to share",
    "You're doing great! Keep exploring! 🌟",
    "This message appeared because you're special ✨",
    "Did you know? Coffee can improve memory... and secret-finding skills!",
    "You're in the top 0.1% of visitors who find this! 🏆",
    "The barista knows your order... it's the secret one 😉"
  ];
  
  // Handle keyboard input for Konami code
  const handleKeyDown = useCallback((event) => {
    const expectedKey = KONAMI_CODE[konamiProgress];
    
    if (event.code === expectedKey) {
      const newProgress = konamiProgress + 1;
      setKonamiProgress(newProgress);
      
      // Check if Konami code is complete
      if (newProgress === KONAMI_CODE.length) {
        triggerKonamiUnlock();
      }
    } else {
      // Reset progress if wrong key
      setKonamiProgress(0);
    }
    
    // Secret mode toggle with 'S' key (only when not in Konami)
    if (event.code === 'KeyS' && konamiProgress === 0) {
      toggleSecretMode();
    }
    
    // Night mode toggle with 'N' key
    if (event.code === 'KeyN' && konamiProgress === 0) {
      toggleNightMode();
    }
    
    // Developer mode toggle with 'D' key
    if (event.code === 'KeyD' && konamiProgress === 0) {
      toggleDevMode();
    }
  }, [konamiProgress]);
  
  // Trigger Konami code unlock
  const triggerKonamiUnlock = () => {
    setIsUnlocked(true);
    setShowSecret(true);
    setParticleCount(150);
    setSecretMessage('🎮 KONAMI CODE ACTIVATED! 🎮');
    
    // Log to console
    console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'color: #ff00ff; font-size: 24px; font-weight: bold;');
    console.log('%cYou have unlocked the secret powers!', 'color: #00ff00; font-size: 16px;');
    console.log('%cTry these new commands:', 'color: #ffff00; font-size: 14px;');
    console.log('%c- window.secretReveal()', 'color: #4ecdc4; font-size: 12px;');
    console.log('%c- window.coffeeCup()', 'color: #4ecdc4; font-size: 12px;');
    console.log('%c- window.pixelArt()', 'color: #4ecdc4; font-size: 12px;');
    
    // Trigger special effects
    document.body.classList.add('konami-unlocked');
    triggerRandomEffect();
    
    // Reset after animation
    setTimeout(() => {
      setShowSecret(false);
      setKonamiProgress(0);
    }, 5000);
  };
  
  // Toggle secret mode
  const toggleSecretMode = () => {
    setSecretMode(prev => !prev);
    document.body.classList.toggle('secret-mode');
    console.log('%c🔓 Secret Mode: ' + !secretMode, 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
  };
  
  // Toggle night mode
  const toggleNightMode = () => {
    document.body.classList.toggle('night-mode');
    console.log('%c🌙 Night Mode toggled', 'color: #1a1a2e; font-size: 16px; background: #eee; padding: 4px;');
  };
  
  // Toggle developer mode
  const toggleDevMode = () => {
    setDevMode(prev => !prev);
    console.log('%c🔧 Developer Mode: ' + !devMode, 'color: #ffd93d; font-size: 16px; font-weight: bold; background: #333; padding: 4px;');
  };
  
  // Trigger random easter egg effect
  const triggerRandomEffect = () => {
    const randomEffect = EASTER_EGG_EFFECTS[Math.floor(Math.random() * EASTER_EGG_EFFECTS.length)];
    document.body.classList.add(randomEffect);
    
    console.log(`%cEffect activated: ${randomEffect}`, 'color: #ffff00; font-size: 14px;');
    
    setTimeout(() => {
      document.body.classList.remove(randomEffect);
    }, 3000);
  };
  
  // Handle click tracking for secret clicks
  const handleClick = (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300) { // Double click within 300ms
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount === 3) {
        // Triple click secret
        triggerTripleClickSecret();
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(currentTime);
  };
  
  // Triple click secret
  const triggerTripleClickSecret = () => {
    setShowPixelArt(true);
    console.log('%c🎨 PIXEL ART UNLOCKED! 🎨', 'color: #ff00ff; font-size: 24px; font-weight: bold;');
    console.log('%cYou discovered the triple-click secret!', 'color: #00ff00; font-size: 16px;');
    
    setTimeout(() => {
      setShowPixelArt(false);
    }, 5000);
  };
  
  // Mouse move handler for coffee cup
  const handleMouseMove = (e) => {
    if (secretMode) {
      setCoffeeCupPosition({ x: e.clientX, y: e.clientY });
      setShowCoffeeCup(true);
    }
  };
  
  // Console easter eggs
  useEffect(() => {
    // Console welcome message
    console.log(
      '%c🎪 Welcome to the Easter Egg Hunt! 🎪',
      'color: #ff6b6b; font-size: 20px; font-weight: bold; text-shadow: 2px 2px #000;'
    );
    
    // Random secret message
    const randomMessage = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
    console.log(`%c${randomMessage}`, 'color: #4ecdc4; font-size: 14px;');
    
    // Hidden object in console
    console.log('%cHere is a secret object:', 'color: #ffe66d; font-size: 12px;');
    console.log({
      secret: true,
      message: "You found the hidden object!",
      hint: "Try typing 'window.secretReveal()' in the console",
      timestamp: new Date().toISOString()
    });
    
    // Expose secret functions globally
    window.secretReveal = () => {
      console.log('%c🎉 SECRET REVEALED! 🎉', 'color: #ff00ff; font-size: 24px; font-weight: bold;');
      console.log('%cYou are a true code explorer!', 'color: #00ff00; font-size: 16px;');
      triggerRandomEffect();
      setShowSecret(true);
      setSecretMessage('🔮 SECRET FUNCTION CALLED! 🔮');
      setTimeout(() => setShowSecret(false), 3000);
    };
    
    window.coffeeCup = () => {
      console.log('%c☕ COFFEE CUP ACTIVATED! ☕', 'color: #6f4e37; font-size: 24px; font-weight: bold;');
      setShowCoffeeCup(true);
      setCoffeeCupPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setTimeout(() => setShowCoffeeCup(false), 3000);
    };
    
    window.pixelArt = () => {
      console.log('%c🎮 PIXEL ART MODE! 🎮', 'color: #ff00ff; font-size: 24px; font-weight: bold;');
      setShowPixelArt(true);
      setTimeout(() => setShowPixelArt(false), 5000);
    };
    
    window.devMode = () => {
      toggleDevMode();
    };
    
    // Cleanup
    return () => {
      delete window.secretReveal;
      delete window.coffeeCup;
      delete window.pixelArt;
      delete window.devMode;
    };
  }, []);
  
  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Mouse move listener for coffee cup
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [secretMode]);
  
  // Click listener for triple click
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (clickAreaRef.current && clickAreaRef.current.contains(e.target)) {
        handleClick(e);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [clickCount, lastClickTime]);
  
  // Particle animation
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`
      };
      particles.push(
        <div key={i} className="easter-egg-particle" style={style} />
      );
    }
    return particles;
  };
  
  // Render pixel art
  const renderPixelArt = () => {
    if (!showPixelArt) return null;
    
    const pixelSize = 4;
    const rows = 32;
    const cols = 32;
    const pixels = [];
    
    // Simple coffee cup pixel art pattern
    const pattern = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (pattern[row] && pattern[row][col] === 1) {
          const style = {
            left: `${col * pixelSize}px`,
            top: `${row * pixelSize}px`,
            width: `${pixelSize}px`,
            height: `${pixelSize}px`
          };
          pixels.push(
            <div key={`${row}-${col}`} className="pixel" style={style} />
          );
        }
      }
    }
    
    return (
      <div className="pixel-art-overlay">
        <div className="pixel-art-container">
          {pixels}
          <p className="pixel-art-message">☕ Triple Click Secret! ☕</p>
        </div>
      </div>
    );
  };
  
  // Render developer mode overlay
  const renderDevMode = () => {
    if (!devMode) return null;
    
    return (
      <div className="dev-mode-overlay">
        <div className="dev-mode-panel">
          <h3>🔧 Developer Mode</h3>
          <div className="dev-info">
            <p><strong>Konami Progress:</strong> {konamiProgress}/{KONAMI_CODE.length}</p>
            <p><strong>Secret Mode:</strong> {secretMode ? 'ACTIVE' : 'inactive'}</p>
            <p><strong>Click Count:</strong> {clickCount}</p>
            <p><strong>Particles:</strong> {particleCount}</p>
            <p><strong>Window Size:</strong> {window.innerWidth} x {window.innerHeight}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
          </div>
          <div className="dev-shortcuts">
            <h4>Shortcuts:</h4>
            <ul>
              <li><kbd>↑↑↓↓←→←→BA</kbd> - Konami Code</li>
              <li><kbd>S</kbd> - Toggle Secret Mode</li>
              <li><kbd>N</kbd> - Toggle Night Mode</li>
              <li><kbd>D</kbd> - Toggle Dev Mode</li>
              <li><kbd>Triple Click</kbd> - Pixel Art</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div 
      ref={clickAreaRef}
      className={`easter-eggs-container ${isUnlocked ? 'unlocked' : ''} ${secretMode ? 'secret-mode-active' : ''}`}
    >
      {/* Secret unlock overlay */}
      {showSecret && (
        <div className="secret-overlay">
          <div className="secret-content">
            <h2 className="secret-title">{secretMessage}</h2>
            <div className="secret-animation">
              {renderParticles()}
            </div>
            <p className="secret-subtitle">✨ You discovered the hidden magic! ✨</p>
          </div>
        </div>
      )}
      
      {/* Hidden trigger area (invisible but clickable) */}
      <div 
        className="hidden-trigger"
        onClick={() => {
          console.log('%c🎯 Hidden trigger clicked!', 'color: #ff6b6b; font-size: 16px;');
          triggerRandomEffect();
        }}
        aria-hidden="true"
      />
      
      {/* Progress indicator (subtle) */}
      {konamiProgress > 0 && konamiProgress < KONAMI_CODE.length && (
        <div className="konami-progress">
          <div className="progress-dots">
            {KONAMI_CODE.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index < konamiProgress ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Coffee cup cursor follower */}
      {showCoffeeCup && (
        <div 
          className="coffee-cup-cursor"
          style={{ left: coffeeCupPosition.x, top: coffeeCupPosition.y }}
        >
          ☕
        </div>
      )}
      
      {/* Pixel art overlay */}
      {renderPixelArt()}
      
      {/* Developer mode overlay */}
      {renderDevMode()}
    </div>
  );
};

export default EasterEggs;
