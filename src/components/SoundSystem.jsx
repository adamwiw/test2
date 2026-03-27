import React, { useEffect, useRef, useCallback, useState } from 'react';

/**
 * SoundSystem Component
 * 
 * Handles all audio effects for the café demo:
 * - Coffee brewing sounds
 * - Steam hissing effects
 * - Button clicks
 * - Hover sounds
 * - Background ambience
 * - Easter egg jingles
 */
const SoundSystem = () => {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  
  // Sound effect definitions
  const soundEffects = {
    click: { type: 'synthetic', frequency: 800, duration: 0.05, waveform: 'square' },
    hover: { type: 'synthetic', frequency: 400, duration: 0.03, waveform: 'sine' },
    success: { type: 'synthetic', frequency: 523.25, duration: 0.15, waveform: 'triangle' },
    coffeePour: { type: 'synthetic', frequency: 200, duration: 0.8, waveform: 'sawtooth' },
    steamHiss: { type: 'synthetic', frequency: 3000, duration: 1.2, waveform: 'sine' },
    cafeAmbience: { type: 'synthetic', frequency: 100, duration: 30, waveform: 'sine' },
    buttonPress: { type: 'synthetic', frequency: 600, duration: 0.1, waveform: 'square' },
    notification: { type: 'synthetic', frequency: 880, duration: 0.2, waveform: 'sine' },
    menuOpen: { type: 'synthetic', frequency: 440, duration: 0.3, waveform: 'triangle' },
    menuClose: { type: 'synthetic', frequency: 330, duration: 0.25, waveform: 'triangle' },
    konamiUnlock: { type: 'synthetic', frequency: 440, duration: 2, waveform: 'square' },
    secretReveal: { type: 'synthetic', frequency: 1000, duration: 1.5, waveform: 'sine' }
  };
  
  // Initialize Web Audio API
  const initializeAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create master gain node
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = volume;
      
      // Connect to destination
      masterGainRef.current.connect(audioContextRef.current.destination);
      
      setIsInitialized(true);
      console.log('🎵 Sound System Initialized');
      
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }, [volume]);
  
  // Play synthetic sound
  const playSyntheticSound = useCallback((name) => {
    if (!audioContextRef.current || muted) return;
    
    const sound = soundEffects[name];
    if (!sound || sound.type !== 'synthetic') return;
    
    const context = audioContextRef.current;
    const now = context.currentTime;
    
    // Create oscillator
    const oscillator = context.createOscillator();
    oscillator.type = sound.waveform;
    oscillator.frequency.setValueAtTime(sound.frequency, now);
    
    // Create gain node for envelope
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + sound.duration);
    
    // Add slight frequency variation for realism
    const variation = (Math.random() - 0.5) * 20;
    oscillator.frequency.setValueAtTime(sound.frequency + variation, now);
    
    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    
    oscillator.start(now);
    oscillator.stop(now + sound.duration);
    
    // Cleanup
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, sound.duration * 1000 + 100);
    
  }, [muted]);
  
  // Play complex sound (multiple oscillators)
  const playComplexSound = useCallback((baseFreq, duration, waveform = 'sine') => {
    if (!audioContextRef.current || muted) return;
    
    const context = audioContextRef.current;
    const now = context.currentTime;
    
    // Create harmonics
    const harmonics = [1, 2, 3, 4];
    const oscillators = [];
    const gainNodes = [];
    
    harmonics.forEach((harmonic, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(baseFreq * harmonic, now);
      
      const amplitude = 0.15 / harmonic;
      gainNode.gain.setValueAtTime(amplitude, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
      
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });
    
    // Cleanup
    setTimeout(() => {
      oscillators.forEach(osc => osc.disconnect());
      gainNodes.forEach(gain => gain.disconnect());
    }, duration * 1000 + 100);
    
  }, [muted]);
  
  // Play coffee brewing sound sequence
  const playCoffeeBrewing = useCallback(() => {
    if (!audioContextRef.current || muted) return;
    
    const context = audioContextRef.current;
    const now = context.currentTime;
    
    // Create noise buffer for steam sound
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const noiseSource = context.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Filter for steam hiss
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(5, now);
    
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    
    noiseSource.start(now);
    noiseSource.stop(now + 2);
    
    // Add dripping sounds
    setTimeout(() => playSyntheticSound('coffeePour'), 500);
    setTimeout(() => playSyntheticSound('coffeePour'), 1200);
    setTimeout(() => playSyntheticSound('coffeePour'), 1800);
    
    console.log('☕ Coffee brewing sound playing');
    
  }, [muted, playSyntheticSound]);
  
  // Play ambient café sounds
  const playCafeAmbience = useCallback(() => {
    if (!audioContextRef.current || muted) return;
    
    const context = audioContextRef.current;
    const now = context.currentTime;
    
    // Low frequency hum (coffee machines)
    const humOscillator = context.createOscillator();
    const humGain = context.createGain();
    
    humOscillator.type = 'sine';
    humOscillator.frequency.setValueAtTime(60, now);
    
    humGain.gain.setValueAtTime(0.05, now);
    humGain.gain.setValueAtTime(0.05, now + 15);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 30);
    
    humOscillator.connect(humGain);
    humGain.connect(masterGainRef.current);
    
    humOscillator.start(now);
    humOscillator.stop(now + 30);
    
    console.log('🎵 Café ambience playing');
    
  }, [muted]);
  
  // Play Konami unlock fanfare
  const playKonami_unlock = useCallback(() => {
    if (!audioContextRef.current || muted) return;
    
    const notes = [440, 494, 554, 587, 659, 587, 554, 494, 440, 392]; // A-G melodic sequence
    const noteDuration = 0.15;
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        playSyntheticSound({
          type: 'synthetic',
          frequency: freq,
          duration: noteDuration,
          waveform: 'square'
        });
      }, index * noteDuration * 1000);
    });
    
    console.log('🎮 Konami unlock fanfare playing');
    
  }, [muted]);
  
  // Set volume
  const setVolumeLevel = useCallback((newVolume) => {
    setVolume(newVolume);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : newVolume;
    }
  }, [muted]);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = !muted ? 0 : volume;
    }
  }, [muted, volume]);
  
  // Initialize on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isInitialized) {
        initializeAudio();
      }
    };
    
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isInitialized, initializeAudio]);
  
  // Setup global sound triggers
  useEffect(() => {
    if (!isInitialized) return;
    
    // Click sounds for buttons
    const handleClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        playSyntheticSound('click');
      }
    };
    
    // Hover sounds for interactive elements
    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || 
          e.target.tagName === 'A' || e.target.closest('a')) {
        playSyntheticSound('hover');
      }
    };
    
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseenter', handleMouseEnter, true);
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [isInitialized, playSyntheticSound]);
  
  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Expose sound functions globally for other components
  useEffect(() => {
    window.soundSystem = {
      play: playSyntheticSound,
      playComplex: playComplexSound,
      playCoffee: playCoffeeBrewing,
      playAmbience: playCafeAmbience,
      playKonami: playKonami_unlock,
      setVolume: setVolumeLevel,
      toggleMute: toggleMute,
      isReady: isInitialized
    };
    
    return () => {
      delete window.soundSystem;
    };
  }, [
    playSyntheticSound,
    playComplexSound,
    playCoffeeBrewing,
    playCafeAmbience,
    playKonami_unlock,
    setVolumeLevel,
    toggleMute,
    isInitialized
  ]);
  
  // Debug sound controls (shift+alt+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        console.log('🎵 Sound System Debug:');
        console.log('- Initialized:', isInitialized);
        console.log('- Volume:', volume);
        console.log('- Muted:', muted);
        console.log('- Available functions:', Object.keys(window.soundSystem || {}));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInitialized, volume, muted]);
  
  return null; // This component doesn't render anything visible
};

export default SoundSystem;