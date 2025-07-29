'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimationConfig, defaultAnimationConfig } from '@/lib/animations';

interface UseScrollAnimationOptions extends AnimationConfig {
  triggerOnce?: boolean;
  disabled?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const {
    threshold = defaultAnimationConfig.threshold,
    rootMargin = defaultAnimationConfig.rootMargin,
    triggerOnce = true,
    disabled = false
  } = options;

  useEffect(() => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          setHasTriggered(true);
        } else if (!triggerOnce && !isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, disabled]);

  return {
    elementRef,
    isVisible,
    hasTriggered
  };
};

export default useScrollAnimation;