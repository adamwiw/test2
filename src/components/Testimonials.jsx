import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "The best coffee I've ever had! The atmosphere is perfect for both work and relaxation. My new favorite spot in the city.",
    author: "Sarah Mitchell",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    quote: "An absolute gem! The pastries are divine and the staff makes you feel like family. I come here every morning before work.",
    author: "James Chen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    quote: "Finally a cafe that understands what good coffee means. The single-origin pour-over changed my life. Can't recommend enough!",
    author: "Emma Rodriguez",
    role: "Photographer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonial-card',
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <svg key={i} className="testimonial-star" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section ref={sectionRef} className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <span className="testimonials-tag">Testimonials</span>
          <h2 className="testimonials-title">What People Say</h2>
          <p className="testimonials-subtitle">Don&apos;t just take our word for it</p>
          <div className="testimonials-underline" />
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-card ${hoveredCard === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="testimonial-quote-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="testimonial-stars">
                {renderStars(testimonial.rating)}
              </div>

              <blockquote className="testimonial-quote">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="testimonial-author">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="testimonial-avatar"
                  loading="lazy"
                />
                <div className="testimonial-author-info">
                  <p className="testimonial-author-name">{testimonial.author}</p>
                  <p className="testimonial-author-role">{testimonial.role}</p>
                </div>
              </div>

              <div className="testimonial-card-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
