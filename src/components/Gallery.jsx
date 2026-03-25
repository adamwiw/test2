import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const galleryRef = useRef(null);
  const itemsRef = useRef([]);
  const gridRef = useRef(null);

  const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', category: 'coffee', title: 'Espresso Art', height: 300 },
    { id: 2, src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', category: 'interior', title: 'Cozy Corner', height: 250 },
    { id: 3, src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', category: 'food', title: 'Fresh Pastries', height: 280 },
    { id: 4, src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', category: 'events', title: 'Live Music Night', height: 320 },
    { id: 5, src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', category: 'coffee', title: 'Latte Perfection', height: 260 },
    { id: 6, src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800', category: 'interior', title: 'Modern Space', height: 290 },
    { id: 7, src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800', category: 'food', title: 'Brunch Special', height: 270 },
    { id: 8, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', category: 'events', title: 'Art Exhibition', height: 310 },
    { id: 9, src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800', category: 'coffee', title: 'Coffee Beans', height: 240 },
    { id: 10, src: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', category: 'interior', title: 'Rustic Vibes', height: 300 },
    { id: 11, src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'food', title: 'Gourmet Dish', height: 280 },
    { id: 12, src: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', category: 'events', title: 'Community Gathering', height: 260 },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'interior', label: 'Interior' },
    { id: 'food', label: 'Food' },
    { id: 'events', label: 'Events' },
  ];

  // Drag to scroll functionality
  const handleMouseDown = (e) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
    galleryRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (galleryRef.current) {
        galleryRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging]);

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleMouseLeave]);

  useEffect(() => {
    filterImages(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    animateEntrance();
  }, [filteredImages]);

  // Mouse tracking for parallax effect
  const handleMouseMoveLocal = useCallback((e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!galleryRef.current) return;

    // Parallax effect on grid
    gsap.to(gridRef.current, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: galleryRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Staggered reveal on scroll
    gsap.fromTo(itemsRef.current,
      { 
        opacity: 0, 
        y: 100, 
        scale: 0.8, 
        rotationY: 15 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotationY: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredImages]);

  const filterImages = (category) => {
    const filtered = category === 'all' 
      ? galleryImages 
      : galleryImages.filter(img => img.category === category);
    setFilteredImages(filtered);
  };

  const animateEntrance = () => {
    if (itemsRef.current.length === 0) return;
    
    gsap.fromTo(itemsRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  };

  const handleFilterClick = (category) => {
    if (category === selectedCategory) return;
    
    // Animate out current items
    gsap.to(itemsRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.95,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedCategory(category);
      }
    });
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    gsap.fromTo('.lightbox-content', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  };

  const closeLightbox = () => {
    gsap.to('.lightbox-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setSelectedImage(null)
    });
  };

  const handleNextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <section 
      className="gallery-section" 
      ref={galleryRef}
      onMouseMove={handleMouseMoveLocal}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="gallery-title">Our Gallery</h2>
          <p className="gallery-subtitle">Explore moments from our café</p>
        </div>

        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleFilterClick(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="masonry-grid" ref={gridRef}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              ref={(el) => (itemsRef.current[index] = el)}
              className="masonry-item"
              style={{ '--item-height': `${image.height}px` }}
              onClick={() => openLightbox(image)}
            >
              <div className="gallery-image-wrapper">
                <img
                  src={image.src}
                  alt={image.title}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h3 className="overlay-title">{image.title}</h3>
                    <span className="overlay-category">{image.category}</span>
                    <div className="overlay-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="drag-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8L22 12L18 16"></path>
            <path d="M6 8L2 12L6 16"></path>
          </svg>
          <span>Drag to scroll</span>
        </div>
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <button className="lightbox-nav lightbox-prev" onClick={handlePrevImage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="lightbox-image"
            />

            <button className="lightbox-nav lightbox-next" onClick={handleNextImage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
