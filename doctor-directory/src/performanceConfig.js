// Performance Configuration for React App
// This file contains settings to optimize performance and prevent freezing

export const PERFORMANCE_CONFIG = {
  // Debounce delays
  DEBOUNCE_DELAYS: {
    EQUIPMENT_SEARCH: 300,
    CHAT_INPUT: 200,
    FORM_VALIDATION: 500
  },

  // Memory management
  MEMORY_LIMITS: {
    MAX_CHAT_MESSAGES: 50,
    MAX_TRAINING_RESOURCES: 100,
    MAX_SUGGESTIONS: 10
  },

  // Rendering optimizations
  RENDER_OPTIONS: {
    VIRTUAL_SCROLLING_THRESHOLD: 20,
    LAZY_LOADING_THRESHOLD: 5,
    BATCH_UPDATE_DELAY: 16 // ~60fps
  },

  // API timeouts
  API_TIMEOUTS: {
    DEFAULT: 30000,
    CHAT: 15000,
    GENERATION: 60000
  },

  // Cache settings
  CACHE: {
    ENABLED: true,
    TTL: 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 50
  }
};

// Performance monitoring utilities
export const PerformanceUtils = {
  // Debounce function
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Memory cleanup
  cleanupMemory: () => {
    if (window.gc) {
      window.gc();
    }
  },

  // Performance monitoring
  measurePerformance: (name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  }
};

// React performance optimizations
export const ReactOptimizations = {
  // Memoization helper
  memoize: (fn, deps) => {
    let lastArgs = null;
    let lastResult = null;
    
    return (...args) => {
      const argsChanged = !lastArgs || args.length !== lastArgs.length || 
        args.some((arg, i) => arg !== lastArgs[i]);
      
      if (argsChanged) {
        lastArgs = args;
        lastResult = fn(...args);
      }
      
      return lastResult;
    };
  },

  // Batch state updates
  batchUpdate: (updates, delay = PERFORMANCE_CONFIG.RENDER_OPTIONS.BATCH_UPDATE_DELAY) => {
    return new Promise(resolve => {
      setTimeout(() => {
        updates.forEach(update => update());
        resolve();
      }, delay);
    });
  }
};

export default PERFORMANCE_CONFIG; 