import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';

/**
 * Props for the AnimateOnScroll component.
 */
interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number; // in ms
  style?: React.CSSProperties;
  as?: ElementType;
}

// Singleton IntersectionObserver for better performance
// Instead of creating one observer per element, we use a single shared observer
type ObserverCallback = (isIntersecting: boolean) => void;
const observerCallbacks = new Map<Element, ObserverCallback>();

let sharedObserver: IntersectionObserver | null = null;

const getSharedObserver = (): IntersectionObserver => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const callback = observerCallbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
            if (entry.isIntersecting) {
              // Once visible, unobserve and remove callback
              sharedObserver?.unobserve(entry.target);
              observerCallbacks.delete(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  }
  return sharedObserver;
};

const observeElement = (element: Element, callback: ObserverCallback): void => {
  observerCallbacks.set(element, callback);
  getSharedObserver().observe(element);
};

const unobserveElement = (element: Element): void => {
  observerCallbacks.delete(element);
  sharedObserver?.unobserve(element);
};

/**
 * Animates elements when they enter the viewport using a fade-up effect.
 * Uses a singleton IntersectionObserver for optimal performance.
 * Respects user's reduced motion preferences.
 *
 * @param children - Elements to animate
 * @param className - Additional CSS classes
 * @param delay - Delay in ms before starting animation (default: 0)
 * @param style - Inline styles to apply
 * @param as - HTML element type to render (default: 'div')
 *
 * @example
 * ```tsx
 * <AnimateOnScroll delay={200}>
 *   <Card>Content appears with fade-up animation</Card>
 * </AnimateOnScroll>
 *
 * <AnimateOnScroll as="section" className="my-section">
 *   <h2>Section Title</h2>
 * </AnimateOnScroll>
 * ```
 */
const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  style,
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) return;

    // Use the shared observer instead of creating a new one
    observeElement(currentRef, (isIntersecting: boolean) => {
      if (isIntersecting) {
        setIsVisible(true);
      }
    });

    return () => {
      if (currentRef) {
        unobserveElement(currentRef);
      }
    };
  }, [prefersReducedMotion]);

  // If reduced motion, render without animation classes
  if (prefersReducedMotion) {
    return (
      <Component ref={ref as React.RefObject<never>} className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref as React.RefObject<never>}
      className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
};

export default AnimateOnScroll;
