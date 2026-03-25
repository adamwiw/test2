import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const loadingRef = useRef(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Animate out
          gsap.to('.loading-screen', {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: onComplete
          });
          gsap.to('.loading-content', {
            y: -50,
            opacity: 0,
            duration: 0.6,
            delay: 0.2
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Animate coffee bean rotation
    gsap.to('.coffee-bean-loader', {
      rotate: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear'
    });

    // Animate progress bar
    gsap.to('.progress-fill', {
      width: '100%',
      duration: 3,
      ease: 'power2.inOut'
    });

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-amber-900 via-amber-950 to-black">
      <div className="loading-content relative text-center">
        {/* Animated Coffee Bean */}
        <div className="coffee-bean-loader mb-8 text-8xl opacity-80">
          ☕
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-amber-100" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          DEBUGGER'S CAFE
        </h1>
        <p className="text-amber-300 text-lg mb-8">Brewing something amazing...</p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-amber-900/50 rounded-full overflow-hidden mx-auto">
          <div
            className="progress-fill h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <p className="text-amber-200/60 text-sm mt-4 font-mono">
          {Math.floor(Math.min(progress, 100))}% COMPLETE
        </p>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 text-6xl opacity-20 animate-pulse">
          ⚡
        </div>
        <div className="absolute -bottom-20 -right-20 text-6xl opacity-20 animate-pulse">
          🔥
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;