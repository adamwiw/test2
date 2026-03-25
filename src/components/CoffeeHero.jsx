import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, MeshDistortMaterial, Stars, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// 3D COMPONENTS
// ============================================

// Animated Coffee Cup with Steam
function CoffeeCup({ position = [0, 0, 0], scale = 1 }) {
  const cupRef = useRef();
  const steamRef = useRef();
  
  useFrame((state) => {
    if (cupRef.current) {
      cupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      cupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
    if (steamRef.current) {
      steamRef.current.rotation.y += 0.01;
      steamRef.current.children.forEach((child, i) => {
        child.scale.multiplyScalar(1.01);
        if (child.scale.x > 2) child.scale.set(0.5, 0.5, 0.5);
      });
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={cupRef} position={position} scale={scale}>
        {/* Cup body */}
        <mesh>
          <cylinderGeometry args={[1, 0.8, 1.5, 32]} />
          <MeshDistortMaterial
            color="#8B4513"
            speed={2}
            distort={0.2}
            radius={1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Cup handle */}
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Steam particles */}
        <group ref={steamRef}>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[Math.sin(i) * 0.3, 1.2 + i * 0.1, Math.cos(i) * 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="white" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

// Floating Coffee Beans
function CoffeeBeans({ count = 100, spread = 15 }) {
  const beans = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ],
      scale: 0.05 + Math.random() * 0.15,
      speed: 0.5 + Math.random() * 1.5
    }));
  }, [count, spread]);

  return (
    <group>
      {beans.map((bean, i) => (
        <FloatingBean key={i} {...bean} />
      ))}
    </group>
  );
}

function FloatingBean({ position, rotation, scale, speed }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.01 * speed;
      ref.current.rotation.y += 0.015 * speed;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
    </Float>
  );
}

// Animated Stars/Particles
function ParticleField({ count = 2000 }) {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      // Vary colors: white, amber, light brown
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; // white
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.2; // amber
      } else {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 0.3; // brown
      }
    }
    return { positions, colors };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================
// MAIN HERO COMPONENT
// ============================================

const CoffeeHero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [useVideo, setUseVideo] = useState(false);

  // GSAP Animations
  useGSAP(() => {
    if (!isLoaded) return;

    // Parallax on 3D scene or video
    gsap.to('.hero-background-element', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(titleRef.current,
      { y: 150, opacity: 0, rotationX: -60, scale: 0.7, skewY: 7 },
      { y: 0, opacity: 1, rotationX: 0, scale: 1, skewY: 0, duration: 1.8, delay: 0.3 }
    )
    .fromTo(subtitleRef.current,
      { y: 100, opacity: 0, scale: 0.8, filter: 'blur(10px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2 }, '-=1.2'
    )
    .fromTo(buttonsRef.current.children,
      { y: 80, opacity: 0, stagger: 0.2, scale: 0.85, rotationX: -15 },
      { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.9, stagger: 0.15 }, '-=0.9'
    )
    .fromTo(statsRef.current.children,
      { y: 60, opacity: 0, stagger: 0.1, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08 }, '-=0.7'
    )
    .fromTo(featuresRef.current.children,
      { x: -50, opacity: 0, stagger: 0.1 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.5'
    );

    // Floating animation for decorative elements
    gsap.to('.hero-particle', {
      y: 'random(-40, 40)',
      x: 'random(-40, 40)',
      duration: 'random(4, 8)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { amount: 4, from: 'random' }
    });

    // Mouse parallax for title
    gsap.to(titleRef.current, {
      x: mousePosition.x * 0.15,
      y: mousePosition.y * 0.15,
      duration: 0.8,
      ease: 'power2.out'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded, mousePosition]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 60;
    const y = (clientY / window.innerHeight - 0.5) * 60;
    setMousePosition({ x, y });

    // 3D tilt effect on content
    if (contentRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((clientY - rect.top - centerY) / centerY) * -8;
      const rotateY = ((clientX - rect.left - centerX) / centerX) * 8;

      gsap.to(contentRef.current, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
        transformOrigin: 'center center'
      });

      // Subtle movement for particles
      gsap.to('.hero-particle', {
        x: (i) => (i % 2 === 0 ? 8 : -8) * (clientX / window.innerWidth - 0.5),
        y: (i) => (i % 2 === 0 ? 8 : -8) * (clientY / window.innerHeight - 0.5),
        duration: 0.3
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const stats = [
    { number: '50K+', label: 'Cups Served', icon: '☕' },
    { number: '1K+', label: 'Happy Customers', icon: '❤️' },
    { number: '4.9', label: 'Average Rating', icon: '⭐' },
    { number: '100%', label: 'Organic Beans', icon: '🌱' }
  ];

  const features = [
    { icon: '🚀', title: 'Lightning Fast', desc: 'Order in seconds' },
    { icon: '🎧', title: 'Chill Vibes', desc: 'Curated playlists' },
    { icon: '💻', title: 'Power Stations', desc: 'Charge your devices' },
    { icon: '🥐', title: 'Fresh Baked', desc: 'Daily pastries' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef} 
      className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Element - 3D Scene or Video */}
      <div className="hero-background-element absolute inset-0 z-0">
        {useVideo ? (
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
            poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-at-a-cafe-4799-large.mp4" type="video/mp4" />
          </video>
        ) : (
          <Canvas 
            camera={{ position: [0, 0, 12], fov: 60 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance'
            }}
            dpr={[1, 2]}
          >
            <color attach="background" args={['#0a0a0a']} />
            <fog attach="fog" args={['#0a0a0a', 10, 30]} />
            
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#FFD700" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8B4513" />
            <spotLight 
              position={[0, 15, 0]} 
              angle={0.4} 
              penumbra={1} 
              intensity={1.5}
              color="#FFA500"
              castShadow
            />
            
            <CoffeeCup position={[0, 0, 0]} scale={1.5} />
            <CoffeeCup position={[-4, 1, -3]} scale={0.8} />
            <CoffeeCup position={[4, -0.5, -2]} scale={0.7} />
            
            <CoffeeBeans count={150} spread={20} />
            <ParticleField count={3000} />
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade />
            
            <Environment preset="city" />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/80 z-10" />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              animationDelay: `${Math.random() * 3}s`,
              filter: `blur(${Math.random() * 2}px)`
            }}
          />
        ))}
      </div>

      {/* Main Content with 3D Tilt */}
      <div className="relative z-40 text-center px-4 max-w-7xl mx-auto">
        <div ref={contentRef} className="hero-content-wrapper">
          {/* Badge */}
          <div className="mb-8 inline-block">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-amber-300 border border-amber-500/30">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Now Open • 24/7
            </span>
          </div>

          {/* Title */}
          <div ref={titleRef} className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-4 leading-tight" 
                style={{ 
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  textShadow: '0 0 40px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0,0,0,0.5)'
                }}>
              DEBUGGER'S CAFE
            </h1>
            <div className="text-2xl md:text-3xl lg:text-5xl text-amber-300 font-light tracking-wider">
              Where Code Meets Coffee
            </div>
          </div>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Fuel your creativity with artisan coffee crafted for developers. 
            <span className="text-amber-300 font-semibold"> 24/7 WiFi • Zero Distractions • Infinite Caffeine</span>
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <button 
              onClick={() => scrollToSection('menu')}
              className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/60 active:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Explore Menu
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => scrollToSection('about')}
              className="group relative px-10 py-5 border-2 border-white/60 text-white font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-110 hover:bg-white hover:text-black hover:border-white active:scale-105 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">▶</span>
                Watch Story
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-amber-400/50 group"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-300 mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-300 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div ref={featuresRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <div className="text-lg font-bold text-white mb-2">{feature.title}</div>
                <div className="text-sm text-gray-400">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-2 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Mouse Follower Glow */}
      <div 
        className="fixed w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      {/* Background Toggle Button */}
      <button 
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20 hover:bg-white/20 transition-all"
        onClick={() => setUseVideo(!useVideo)}
        aria-label="Toggle background"
      >
        {useVideo ? '🎬 Video' : '🎨 3D Scene'}
      </button>
    </section>
  );
};

export default CoffeeHero;