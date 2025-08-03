// React Performance Optimizations
// This file contains hooks and utilities to prevent freezing and improve performance

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Custom hook for debouncing
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for throttling
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Custom hook for memory management
export const useMemoryManager = (maxItems = 50) => {
  const cleanup = useCallback(() => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear any cached data
    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }, []);

  const limitArray = useCallback((array, max = maxItems) => {
    if (array.length > max) {
      return array.slice(-max);
    }
    return array;
  }, [maxItems]);

  return { cleanup, limitArray };
};

// Custom hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    // Log performance warnings
    if (timeSinceLastRender < 16) { // Less than 60fps
      console.warn(`⚠️ ${componentName} rendering too frequently: ${timeSinceLastRender}ms`);
    }

    if (renderCount.current > 100) {
      console.warn(`⚠️ ${componentName} has rendered ${renderCount.current} times - consider optimization`);
    }
  });

  return { renderCount: renderCount.current };
};

// Custom hook for lazy loading
export const useLazyLoad = (items, itemsPerPage = 10) => {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + itemsPerPage, items.length));
      setIsLoading(false);
    }, 100);
  }, [items.length, itemsPerPage]);

  const visibleData = useMemo(() => {
    return items.slice(0, visibleItems);
  }, [items, visibleItems]);

  return { visibleData, isLoading, loadMore, hasMore: visibleItems < items.length };
};

// Custom hook for virtual scrolling (simplified)
export const useVirtualScroll = (items, itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    containerRef,
    handleScroll
  };
};

// Performance optimization wrapper
export const withPerformanceOptimization = (Component, options = {}) => {
  const {
    memo = true,
    shouldComponentUpdate = null,
    displayName = Component.displayName || Component.name
  } = options;

  let OptimizedComponent = Component;

  if (memo) {
    OptimizedComponent = React.memo(Component, shouldComponentUpdate);
  }

  OptimizedComponent.displayName = `Optimized(${displayName})`;

  return OptimizedComponent;
};

// Batch state updates utility
export const batchStateUpdates = (updates, delay = 16) => {
  return new Promise(resolve => {
    setTimeout(() => {
      updates.forEach(update => update());
      resolve();
    }, delay);
  });
};

// Memory leak detection
export const useMemoryLeakDetection = (componentName) => {
  useEffect(() => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    return () => {
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryDiff = finalMemory - initialMemory;
      
      if (memoryDiff > 10 * 1024 * 1024) { // 10MB threshold
        console.warn(`⚠️ Potential memory leak in ${componentName}: ${Math.round(memoryDiff / 1024 / 1024)}MB`);
      }
    };
  });
};

// Export all utilities
export default {
  useDebounce,
  useThrottle,
  useMemoryManager,
  usePerformanceMonitor,
  useLazyLoad,
  useVirtualScroll,
  withPerformanceOptimization,
  batchStateUpdates,
  useMemoryLeakDetection
}; 