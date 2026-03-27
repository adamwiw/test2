import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Menu.css';

gsap.registerPlugin(ScrollTrigger);

const menuItems = [
  {
    id: 1,
    name: 'Signature Espresso',
    description: 'Bold, rich, and perfectly balanced with notes of dark chocolate and caramel',
    price: '$4.50',
    category: 'Espresso',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
    tags: ['Popular', 'Bestseller']
  },
  {
    id: 2,
    name: 'Velvet Latte',
    description: 'Silky steamed milk with vanilla and a hint of cinnamon, topped with microfoam art',
    price: '$5.95',
    category: 'Latte',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
    tags: ['Sweet', 'Creamy']
  },
  {
    id: 3,
    name: 'Cold Brew Reserve',
    description: 'Slow-steeped for 20 hours, smooth and naturally sweet with low acidity',
    price: '$5.50',
    category: 'Cold Brew',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
    tags: ['Refreshing', 'Strong']
  },
  {
    id: 4,
    name: 'Matcha Cloud',
    description: 'Ceremonial grade matcha whisked to perfection with oat milk and vanilla',
    price: '$6.25',
    category: 'Specialty',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
    tags: ['Healthy', 'Vegan']
  },
  {
    id: 5,
    name: 'Mocha Supreme',
    description: 'Rich chocolate espresso with steamed milk and whipped cream, drizzled with cocoa',
    price: '$6.00',
    category: 'Mocha',
    image: 'https://images.unsplash.com/photo-1578314675249-a6918a397d43?w=400&q=80',
    tags: ['Indulgent', 'Sweet']
  },
  {
    id: 6,
    name: 'Pour Over Flight',
    description: 'Three single-origin coffees brewed to order, tasting notes provided',
    price: '$8.50',
    category: 'Pour Over',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    tags: ['Artisan', 'Experience']
  }
];

const categories = ['All', 'Espresso', 'Latte', 'Cold Brew', 'Specialty', 'Mocha', 'Pour Over'];

const MenuCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cardRef.current) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Entrance animation
    gsap.fromTo(cardRef.current,
      { y: 100, opacity: 0, rotationY: -15 },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePosition({ x, y });

    const rotateX = (y / rect.height) * 10;
    const rotateY = (x / rect.width) * 10;

    gsap.to(cardRef.current, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center center'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`menu-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotateX(${-mousePosition.x * 0.01}deg) rotateY(${mousePosition.y * 0.01}deg)`
      }}
    >
      <div className="card-inner">
        <div className="card-image-container">
          <img src={item.image} alt={item.name} className="card-image" loading="lazy" />
          <div className="card-overlay"></div>
          <div className="card-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="card-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="card-content">
          <div className="card-category">{item.category}</div>
          <h3 className="card-title">{item.name}</h3>
          <p className="card-description">{item.description}</p>
          <div className="card-footer">
            <span className="card-price">{item.price}</span>
            <button className="card-add-btn" aria-label={`Add ${item.name} to order`}>
              <span>+</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Shine effect */}
      <div
        className="card-shine"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x + 150}px ${mousePosition.y + 150}px, rgba(255,255,255,0.15), transparent 40%)`
        }}
      ></div>
    </div>
  );
};

const Menu = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(menuItems);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Title animation
    gsap.fromTo(titleRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <section ref={sectionRef} className="menu-section" id="menu" aria-labelledby="menu-title">
      <div className="menu-container">
        <div className="menu-header">
          <h2 ref={titleRef} id="menu-title" className="menu-title">
            Our <span className="title-accent">Menu</span>
          </h2>
          <p className="menu-subtitle">
            Handcrafted beverages made with ethically sourced, premium ingredients
          </p>
        </div>

        {/* Category Filter */}
        <div className="menu-filter" role="tablist" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls="menu-grid"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div id="menu-grid" className="menu-grid" role="grid">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="menu-grid-item" role="gridcell">
              <MenuCard item={item} index={index} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="menu-empty">
            <p>No items found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
