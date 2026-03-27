import React, { useState } from 'react';
import gsap from 'gsap';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake animation for errors
      gsap.to('.contact-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitStatus('success');
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitStatus(null);
    }, 3000);
  };

  const subjects = [
    'General Inquiry',
    'Catering Request',
    'Feedback',
    'Partnership',
    'Career Opportunities',
    'Other',
  ];

  return (
    <section className="contact-section">
      <div className="contact-background" />
      <div className="content-wrapper">
        <div className="contact-header">
          <h2 className="contact-title">
            <span className="title-icon">✉️</span>
            Get in Touch
            <span className="title-icon">✉️</span>
          </h2>
          <p className="contact-subtitle">
            Have questions, feedback, or want to partner with us? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3 className="info-title">Location</h3>
              <p className="info-text">
                123 Coffee Street
                <br />
                Downtown District
                <br />
                City, State 12345
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3 className="info-title">Phone</h3>
              <p className="info-text">
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3 className="info-title">Email</h3>
              <p className="info-text">
                <a href="mailto:hello@hackercafe.com">hello@hackercafe.com</a>
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">⏰</div>
              <h3 className="info-title">Hours</h3>
              <p className="info-text">
                Mon - Fri: 7am - 9pm
                <br />
                Sat - Sun: 8am - 10pm
              </p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+1 (234) 567-890"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <span className="error-message">{errors.subject}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`form-input textarea ${errors.message ? 'error' : ''}`}
                placeholder="Tell us what's on your mind..."
                rows={6}
              />
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <span className="button-icon">→</span>
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;