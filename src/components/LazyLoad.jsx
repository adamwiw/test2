import React, { Suspense, useState, useEffect } from 'react';

// Simple loading placeholder
const LoadingPlaceholder = ({ height = '400px', children }) => (
  <div 
    className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"
    style={{ minHeight: height }}
  >
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
      <p className="text-gray-400 text-sm">Loading...</p>
      {children}
    </div>
  </div>
);

// Lazy load wrapper for components
export const LazyLoad = ({ 
  children, 
  fallback = <LoadingPlaceholder />,
  rootMargin = '200px',
  threshold = 0.1,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={containerRef} className={className}>
      {!isVisible && fallback}
      {isVisible && (
        <Suspense fallback={fallback}>
          {React.cloneElement(children, { onLoad: () => setIsLoaded(true) })}
        </Suspense>
      )}
    </div>
  );
};

// Lazy load image with blur placeholder
export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading...%3C/text%3E%3C/svg%3E',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          {...props}
        />
      )}
      
      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
          <span className="text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
};

// Preload critical resources
export const Preload = ({ children }) => {
  useEffect(() => {
    // Preload critical images
    const links = document.querySelectorAll('link[rel="preload"]');
    links.forEach(link => {
      if (link.href) {
        const img = new Image();
        img.src = link.href;
      }
    });
  }, []);

  return children;
};

export default LazyLoad;
