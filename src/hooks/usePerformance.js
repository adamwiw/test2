import { useEffect, useRef, useState, useCallback } from 'react';

// Core Web Vitals monitoring
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTI: null,
    TBT: null
  });
  
  const observerRef = useRef(null);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    // Measure LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({
        ...prev,
        LCP: Math.round(lastEntry.startTime)
      }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        setMetrics(prev => ({
          ...prev,
          FID: Math.round(entry.processingStart - entry.startTime)
        }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics(prev => ({
        ...prev,
        CLS: Math.round(clsValue * 1000) / 1000
      }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      setMetrics(prev => ({
        ...prev,
        FCP: Math.round(firstEntry.startTime)
      }));
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  return metrics;
};

// Resource timing analyzer
export const useResourceTiming = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      setResources(entries.map(entry => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        duration: Math.round(entry.duration),
        size: entry.transferSize || 0,
        startTime: Math.round(entry.startTime)
      })));
    });
    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return resources;
};

// Long task detector (for TBT)
export const useLongTasks = (threshold = 50) => {
  const [longTasks, setLongTasks] = useState([]);

  useEffect(() => {
    const observer = new PerformanceObserver((entryList) => {
      const tasks = entryList.getEntries().map(entry => ({
        startTime: entry.startTime,
        duration: entry.duration,
        attribution: entry.attribution
      }));
      setLongTasks(prev => [...prev, ...tasks]);
    });
    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  }, []);

  return longTasks;
};

// Memory usage monitor (Chrome only)
export const useMemoryInfo = () => {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    if ('memory' in performance) {
      const mem = performance.memory;
      setMemory({
        usedJSHeapSize: Math.round(mem.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(mem.totalJSHeapSize / 1024 / 1024),
        jsHeapSizeLimit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024)
      });
    }
  }, []);

  return memory;
};

// Custom hook for measuring component render times
export const useRenderTimer = (componentName) => {
  const startTimeRef = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;
    if (duration > 16) { // More than one frame
      console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
    }
  });
};

// Debounced performance logger
export const usePerformanceLogger = () => {
  const logRef = useRef([]);
  
  const logMetric = useCallback((name, value) => {
    logRef.current.push({ name, value, timestamp: Date.now() });
  }, []);

  const getMetrics = useCallback(() => {
    return [...logRef.current];
  }, []);

  const clearMetrics = useCallback(() => {
    logRef.current = [];
  }, []);

  return { logMetric, getMetrics, clearMetrics };
};

export default usePerformance;
