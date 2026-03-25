import React, { Suspense, lazy, useState, useEffect } from 'react';

// Dynamic import wrapper with loading states
export const lazyLoad = (importFn, loadingComponent) => {
  return lazy(() =>
    importFn().catch(error => {
      console.error('Failed to load component:', error);
      return { default: loadingComponent };
    })
  );
};

// Preload a lazy component
export const preloadComponent = (lazyComponent) => {
  if (lazyComponent.preload) {
    lazyComponent.preload();
  }
};

// Preload multiple components
export const preloadComponents = (components) => {
  components.forEach(component => {
    if (component.preload) {
      component.preload();
    }
  });
};

// Higher-order component for adding loading states
export const withLoadingState = (Component, loadingComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return loadingComponent;
    }

    return <Component {...props} />;
  };
};

// Route-based code splitting helper
export const createLazyRoute = (importFn, loadingComponent) => {
  const LazyComponent = lazy(importFn);
  
  const RouteComponent = (props) => (
    <Suspense fallback={loadingComponent}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  RouteComponent.preload = () => {
    LazyComponent.preload();
  };
  
  return RouteComponent;
};

// Component priority levels for preloading
export const PRIORITY = {
  CRITICAL: 'critical', // Above the fold, load immediately
  HIGH: 'high', // Visible on first interaction, preload soon
  MEDIUM: 'medium', // Below the fold, load on idle
  LOW: 'low' // Only load when needed
};

// Smart preloader based on user behavior
export const SmartPreloader = () => {
  useEffect(() => {
    // Preload high-priority components after initial load
    const timer = setTimeout(() => {
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('preload-high-priority'));
    }, 2000);

    // Preload medium-priority on idle
    const idleCallback = window.requestIdleCallback || (cb => setTimeout(cb, 1000));
    const idleTimer = idleCallback(() => {
      window.dispatchEvent(new CustomEvent('preload-medium-priority'));
    }, { timeout: 3000 });

    return () => {
      clearTimeout(timer);
      window.cancelIdleCallback?.(idleTimer);
    };
  }, []);

  return null;
};

// Hook for component-level preloading
export const usePreload = (priority = PRIORITY.MEDIUM) => {
  const [shouldPreload, setShouldPreload] = useState(
    priority === PRIORITY.CRITICAL
  );

  useEffect(() => {
    if (shouldPreload) return;

    const handlePreload = (event) => {
      if (
        (event.detail === PRIORITY.HIGH && priority === PRIORITY.HIGH) ||
        (event.detail === PRIORITY.MEDIUM && priority === PRIORITY.MEDIUM) ||
        (event.detail === 'all')
      ) {
        setShouldPreload(true);
      }
    };

    window.addEventListener('preload-high-priority', handlePreload);
    window.addEventListener('preload-medium-priority', handlePreload);
    window.addEventListener('preload-all', handlePreload);

    return () => {
      window.removeEventListener('preload-high-priority', handlePreload);
      window.removeEventListener('preload-medium-priority', handlePreload);
      window.removeEventListener('preload-all', handlePreload);
    };
  }, [priority, shouldPreload]);

  return shouldPreload;
};

// Bundle analyzer helper (development only)
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available via: bun run build --analyze');
  }
};

export default {
  lazyLoad,
  preloadComponent,
  preloadComponents,
  withLoadingState,
  createLazyRoute,
  SmartPreloader,
  usePreload,
  analyzeBundle
};
