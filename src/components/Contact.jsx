import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Contact.css';

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const formRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-form', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      gsap.from('.contact-info', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      });
      
      gsap.from('.form-group', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out'
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const socialLinks = [
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Facebook', icon: '👥', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' }
  ];

  const openingHours = [
    { day: 'Monday - Friday', hours: '7:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '9:00 AM - 8:00 PM' }
  ];

  return (
    <section ref={sectionRef} className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">We&apos;d love to hear from you. Drop by for a coffee or send us a message!</p>
        </div>

        <div className="contact-content">
          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            {submitSuccess && (
              <div className="success-message">
                ✨ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? 'error' : ''}
                placeholder="How can we help?"
              />
              {errors.subject && <span className="error-text">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                placeholder="Tell us what's on your mind..."
                rows="5"
              />
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message ☕'}
            </button>
          </form>

          <div className="contact-info">
            <div className="info-card location-card">
              <h3>📍 Location</h3>
              <p>123 Coffee Street</p>
              <p>Downtown District</p>
              <p>New York, NY 10001</p>
              <div className="map-placeholder">
                <div className="map-content">
                  <span className="map-icon">🗺️</span>
                  <p>Interactive Map</p>
                  <small>Click to view on Google Maps</small>
                </div>
              </div>
            </div>

            <div className="info-card hours-card">
              <h3>🕐 Opening Hours</h3>
              {openingHours.map((schedule, index) => (
                <div key={index} className="hours-row">
                  <span className="day">{schedule.day}</span>
                  <span className="hours">{schedule.hours}</span>
                </div>
              ))}
            </div>

            <div className="info-card social-card">
              <h3>🌐 Follow Us</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="info-card contact-card">
              <h3>📞 Contact Info</h3>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Email:</strong> hello@hackercafe.com</p>
              <p><strong>Emergency:</strong> (555) 911-0000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
