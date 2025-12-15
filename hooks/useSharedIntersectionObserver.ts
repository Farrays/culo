import { useEffect, useRef, useState } from 'react';

/**
 * Callback type for intersection observer
 */
type ObserverCallback = (isIntersecting: boolean) => void;

/**
 * Observer configuration options
 */
interface ObserverConfig {
  threshold: number;
  rootMargin: string;
  /** If true, callback fires only once when element becomes visible */
  once: boolean;
}

/**
 * Map to store callbacks for each observer configuration
 */
const observerMaps = new Map<string, Map<Element, ObserverCallback>>();
const observers = new Map<string, IntersectionObserver>();

/**
 * Creates a unique key for observer configuration
 */
const getConfigKey = (config: ObserverConfig): string =>
  `${config.threshold}-${config.rootMargin}-${config.once}`;

/**
 * Gets or creates a shared IntersectionObserver for the given configuration
 */
const getSharedObserver = (config: ObserverConfig): IntersectionObserver => {
  const key = getConfigKey(config);

  if (!observers.has(key)) {
    const callbackMap = new Map<Element, ObserverCallback>();
    observerMaps.set(key, callbackMap);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const callback = callbackMap.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
            if (config.once && entry.isIntersecting) {
              observer.unobserve(entry.target);
              callbackMap.delete(entry.target);
            }
          }
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin,
      }
    );

    observers.set(key, observer);
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return observers.get(key)!;
};

/**
 * Observes an element with the given configuration and callback
 */
const observeElement = (
  element: Element,
  callback: ObserverCallback,
  config: ObserverConfig
): void => {
  const key = getConfigKey(config);
  const callbackMap = observerMaps.get(key) || new Map();
  observerMaps.set(key, callbackMap);

  callbackMap.set(element, callback);
  getSharedObserver(config).observe(element);
};

/**
 * Stops observing an element
 */
const unobserveElement = (element: Element, config: ObserverConfig): void => {
  const key = getConfigKey(config);
  const callbackMap = observerMaps.get(key);
  const observer = observers.get(key);

  if (callbackMap) {
    callbackMap.delete(element);
  }
  if (observer) {
    observer.unobserve(element);
  }
};

/**
 * Default configurations for common use cases
 */
export const OBSERVER_CONFIGS = {
  /** For scroll animations - triggers when 10% visible with -50px bottom margin */
  animation: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    once: true,
  } as const,
  /** For counters - triggers when 50% visible */
  counter: {
    threshold: 0.5,
    rootMargin: '0px',
    once: true,
  } as const,
  /** For lazy loading images - triggers when entering viewport */
  lazyLoad: {
    threshold: 0,
    rootMargin: '50px 0px',
    once: true,
  } as const,
} satisfies Record<string, ObserverConfig>;

export type ObserverConfigKey = keyof typeof OBSERVER_CONFIGS;

/**
 * Hook that uses a shared IntersectionObserver for optimal performance.
 * Multiple components using the same configuration share a single observer.
 *
 * @param config - Observer configuration (use OBSERVER_CONFIGS presets or custom)
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 *
 * @example
 * ```tsx
 * // Using preset configuration
 * const [ref, isVisible] = useSharedIntersectionObserver(OBSERVER_CONFIGS.animation);
 *
 * // Using custom configuration
 * const [ref, isVisible] = useSharedIntersectionObserver({
 *   threshold: 0.25,
 *   rootMargin: '0px',
 *   once: true
 * });
 *
 * return (
 *   <div ref={ref} className={isVisible ? 'visible' : 'hidden'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useSharedIntersectionObserver<T extends HTMLElement = HTMLElement>(
  config: ObserverConfig = OBSERVER_CONFIGS.animation
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observeElement(
      element,
      (isIntersecting: boolean) => {
        if (isIntersecting) {
          setIsVisible(true);
        } else if (!config.once) {
          setIsVisible(false);
        }
      },
      config
    );

    return () => {
      unobserveElement(element, config);
    };
  }, [config]);

  return [ref, isVisible];
}

export default useSharedIntersectionObserver;
