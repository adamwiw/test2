import { useState, useEffect, useRef } from 'react'
import './App.css'

// Donut data with funny descriptions
const donuts = [
  {
    id: 1,
    name: "The Existential Crisis",
    description: "Chocolate glaze with sprinkles of doubt. It's dark, it's deep, and it questions your life choices.",
    price: "$4.50",
    gradient: "from-purple-600 via-pink-500 to-red-500",
    emoji: "🍩"
  },
  {
    id: 2,
    name: "Glazed & Confused",
    description: "Our signature. Classic glazed but with a twist of existential wonder. You'll be confused how you lived without it.",
    price: "$3.99",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    emoji: "🍩"
  },
  {
    id: 3,
    name: "The Monday",
    description: "Coffee-flavored with a bitter aftertaste that perfectly mimics your soul. Comes with extra dread.",
    price: "$4.25",
    gradient: "from-amber-600 via-orange-500 to-red-600",
    emoji: "🍩"
  },
  {
    id: 4,
    name: "Sugar High",
    description: "So much sugar you'll vibrate through dimensions. Not responsible for spontaneous dancing.",
    price: "$5.00",
    gradient: "from-pink-400 via-rose-500 to-purple-600",
    emoji: "🍩"
  },
  {
    id: 5,
    name: "The Chillax",
    description: "Matcha green tea glaze with zen-like calm. May cause sudden bouts of contentment.",
    price: "$4.75",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    emoji: "🍩"
  },
  {
    id: 6,
    name: "Midnight Snack",
    description: "Dark chocolate with edible glitter for when you're up at 3am questioning everything.",
    price: "$4.50",
    gradient: "from-slate-800 via-gray-900 to-black",
    emoji: "🍩"
  },
  {
    id: 7,
    name: "The Party Animal",
    description: "Rainbow sprinkles and pop rocks. It's a rave in donut form. Bring earplugs for your taste buds.",
    price: "$5.50",
    gradient: "from-yellow-400 via-pink-500 to-cyan-400",
    emoji: "🍩"
  },
  {
    id: 8,
    name: "The Sophisticate",
    description: "Gold leaf, edible flowers, and a pretentious attitude. It judges you while you eat it.",
    price: "$7.99",
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
    emoji: "🍩"
  },
  {
    id: 9,
    name: "The Rebirth",
    description: "Phoenix-shaped with fiery cinnamon. Rises from the ashes of your previous diet.",
    price: "$6.00",
    gradient: "from-orange-500 via-red-500 to-amber-600",
    emoji: "🍩"
  },
  {
    id: 10,
    name: "The Void",
    description: "Black sesame and charcoal. So dark it absorbs light and your will to count calories.",
    price: "$4.99",
    gradient: "from-gray-900 via-black to-gray-800",
    emoji: "🍩"
  }
]

// Floating donut component for background effect
const FloatingDonut = ({ delay, size, gradient, x, y }) => (
  <div
    className="fixed pointer-events-none opacity-20 animate-float"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      animationDelay: `${delay}s`,
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} blur-xl`}></div>
  </div>
)

// Donut card component
const DonutCard = ({ donut, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="glass-panel donut-card animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${donut.gradient} transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl filter drop-shadow-2xl">{donut.emoji}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 neon-text">{donut.name}</h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{donut.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-cyan-300">{donut.price}</span>
        <button className="glass-button text-sm px-6 py-2">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// Particle background component
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 10 + 15,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/30"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function App() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const floatingDonuts = [
    { delay: 0, size: 80, gradient: 'from-purple-500 to-pink-500', x: 10, y: 20 },
    { delay: 2, size: 60, gradient: 'from-cyan-400 to-blue-500', x: 85, y: 15 },
    { delay: 4, size: 100, gradient: 'from-pink-500 to-rose-500', x: 75, y: 60 },
    { delay: 1, size: 50, gradient: 'from-green-400 to-emerald-500', x: 15, y: 70 },
    { delay: 3, size: 70, gradient: 'from-amber-500 to-orange-500', x: 90, y: 85 },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Particle background */}
      <ParticleBackground />

      {/* Floating donuts */}
      {floatingDonuts.map((donut, i) => (
        <FloatingDonut key={i} {...donut} />
      ))}

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1
            className="text-6xl md:text-8xl font-black mb-6 animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, #00ffff, #8b5cf6, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.6))',
            }}
          >
            Glazed & Confused
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Where Donuts Meet Existential Enlightenment
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Experience donuts so divine, you'll question reality. Handcrafted with cosmic ingredients and a dash of philosophical madness.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button className="glass-button text-xl px-12 py-5 animate-glow">
              Order Now
            </button>
            <button className="px-12 py-5 rounded-full border-2 border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300 transition-all duration-300 text-lg font-semibold">
              View Menu
            </button>
          </div>

          <div className="mt-16 animate-bounce">
            <svg className="w-8 h-8 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 neon-text">Our Menu</h2>
            <p className="text-gray-400 text-lg">Each donut is a journey into the unknown</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {donuts.map((donut, index) => (
              <DonutCard key={donut.id} donut={donut} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            © 2024 Glazed & Confused. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Crafted with ✨ and existential dread.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
