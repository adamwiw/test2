import React, { useState } from 'react';
import { gsap } from 'gsap';
import './MenuExplorer.css';

const MenuExplorer = () => {

  const [activeCategory, setActiveCategory] = useState('hot');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    { id: 'hot', label: 'Hot Coffee', icon: '☕' },
    { id: 'cold', label: 'Cold Brews', icon: '🧊' },
    { id: 'special', label: 'Specialties', icon: '✨' },
    { id: 'pastry', label: 'Pastries', icon: '🥐' },
  ];

  const menuItems = {
    hot: [
      { id: 1, name: 'Espresso', price: '$3.50', description: 'Rich, bold, and perfectly extracted', calories: 5, popular: true },
      { id: 2, name: 'Cappuccino', price: '$4.50', description: 'Silky microfoam meets bold espresso', calories: 120, popular: true },
      { id: 3, name: 'Americano', price: '$3.75', description: 'Espresso with hot water, smooth finish', calories: 10 },
      { id: 4, name: 'Mocha', price: '$5.25', description: 'Espresso, chocolate, and steamed milk', calories: 290, popular: true },
      { id: 5, name: 'Flat White', price: '$4.75', description: 'Velvety milk crema with espresso', calories: 110 },
      { id: 6, name: 'Cortado', price: '$4.00', description: 'Equal parts espresso and milk', calories: 60 },
    ],
    cold: [
      { id: 1, name: 'Cold Brew', price: '$4.50', description: '24-hour steeped, incredibly smooth', calories: 5, popular: true },
      { id: 2, name: 'Iced Latte', price: '$5.00', description: 'Espresso over ice with cold milk', calories: 130 },
      { id: 3, name: 'Nitro Cold Brew', price: '$5.50', description: 'Infused with nitrogen, creamy texture', calories: 5, popular: true },
      { id: 4, name: 'Iced Americano', price: '$4.00', description: 'Chilled espresso with cold water', calories: 10 },
      { id: 5, name: 'Cold Foam Latte', price: '$5.75', description: 'Velvety cold foam crown', calories: 150 },
      { id: 6, name: 'Frappe', price: '$6.00', description: 'Blended iced coffee perfection', calories: 250, popular: true },
    ],
    special: [
      { id: 1, name: 'Lavender Latte', price: '$6.50', description: 'Floral notes with espresso magic', calories: 200 },
      { id: 2, name: 'Matcha Brew', price: '$6.00', description: 'Premium matcha with house espresso', calories: 180, popular: true },
      { id: 3, name: 'Honey Cinnamon', price: '$5.75', description: 'Raw honey meets warm cinnamon spice', calories: 160 },
      { id: 4, name: 'Turmeric Golden', price: '$6.25', description: 'Anti-inflammatory turmeric latte', calories: 170 },
      { id: 5, name: 'Caramel Hazelnut', price: '$6.00', description: 'Nutty caramel swirl masterpiece', calories: 220, popular: true },
      { id: 6, name: 'Chai Espresso', price: '$5.50', description: 'Spiced chai meets espresso kick', calories: 190 },
    ],
    pastry: [
      { id: 1, name: 'Croissant', price: '$4.50', description: 'Buttery, flaky French perfection', calories: 310, popular: true },
      { id: 2, name: 'Blueberry Muffin', price: '$4.00', description: 'Fresh-baked with real berries', calories: 380 },
      { id: 3, name: 'Chocolate Babka', price: '$5.50', description: 'Swirled chocolate bread', calories: 420, popular: true },
      { id: 4, name: 'Cinnamon Roll', price: '$5.00', description: 'Cream cheese frosting crown', calories: 510 },
      { id: 5, name: 'Almond Croissant', price: '$5.25', description: 'Frangipane filled delight', calories: 390 },
      { id: 6, name: 'Pain au Chocolat', price: '$4.75', description: 'Dark chocolate baton center', calories: 340 },
    ],
  };

  const currentItems = menuItems[activeCategory];

  const handleCategoryChange = (categoryId) => {
    gsap.to('.menu-item', {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        setActiveCategory(categoryId);
        gsap.to('.menu-item', {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        });
      },
    });
  };

  const handleItemHover = (item) => {
    setHoveredItem(item.id);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    gsap.fromTo(
      '.item-details',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  };

  return (
    <section className="menu-explorer-section">
      <div className="menu-background-pattern" />
      <div className="content-wrapper">
        <div className="menu-header">
          <h2 className="menu-title">
            <span className="title-icon">☕</span>
            Explore Our Menu
            <span className="title-icon">☕</span>
          </h2>
          <p className="menu-subtitle">
            Crafted with passion, served with love. Every item tells a story.
          </p>
        </div>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${
                activeCategory === category.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="tab-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${hoveredItem === item.id ? 'hovered' : ''}`}
              onMouseEnter={() => handleItemHover(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick(item)}
            >
              <div className="item-header">
                <div className="item-name-container">
                  <h3 className="item-name">{item.name}</h3>
                  {item.popular && (
                    <div className="popular-badge">
                      <span className="flame">🔥</span> Popular
                    </div>
                  )}
                </div>
                <span className="item-price">{item.price}</span>
              </div>
              
              <p className="item-description">{item.description}</p>
              
              <div className="item-footer">
                <span className="calories">
                  <span className="cal-icon">⚡</span>
                  {item.calories} cal
                </span>
                <button className="view-details-btn">
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="item-details" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-modal"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
              <h3 className="modal-item-name">{selectedItem.name}</h3>
              <p className="modal-item-price">{selectedItem.price}</p>
              <p className="modal-item-description">
                {selectedItem.description}
              </p>
              <div className="modal-meta">
                <span className="modal-calories">
                  <span className="cal-icon">⚡</span>
                  {selectedItem.calories} Calories
                </span>
                {selectedItem.popular && (
                  <span className="modal-popular">
                    <span className="flame">🔥</span> Customer Favorite
                  </span>
                )}
              </div>
              <button className="add-to-order-btn">
                + Add to Order
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuExplorer;