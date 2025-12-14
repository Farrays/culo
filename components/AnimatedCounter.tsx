import React, { useEffect, useState, useRef, memo } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = memo(function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  className = '',
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const startTime = Date.now();

            const updateCount = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);

              // Easing function para animación más suave
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);

              const currentCount = Math.floor(easeOutQuart * target);
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(target);
              }
            };

            requestAnimationFrame(updateCount);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    const element = elementRef.current;
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [target, duration, hasAnimated]);

  return (
    <div ref={elementRef} className={className}>
      {count}
      {suffix}
    </div>
  );
});

export default AnimatedCounter;
