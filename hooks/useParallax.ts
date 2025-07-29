'use client';

import { useEffect, useState, useRef } from 'react';
import { ParallaxConfig } from '@/lib/animations';

interface UseParallaxOptions extends ParallaxConfig {
  disabled?: boolean;
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  const {
    speed = 0.5,
    direction = 'up',
    scale = false,
    rotate = false,
    disabled = false
  } = options;

  useEffect(() => {
    if (disabled) return;

    const updateScrollY = () => {
      setScrollY(window.pageYOffset);
    };

    const updateElementPosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.pageYOffset);
        setElementHeight(rect.height);
      }
    };

    updateElementPosition();
    window.addEventListener('scroll', updateScrollY, { passive: true });
    window.addEventListener('resize', updateElementPosition);

    return () => {
      window.removeEventListener('scroll', updateScrollY);
      window.removeEventListener('resize', updateElementPosition);
    };
  }, [disabled]);

  const getTransform = () => {
    if (disabled) return '';

    const elementCenter = elementTop + elementHeight / 2;
    const windowCenter = scrollY + window.innerHeight / 2;
    const distance = windowCenter - elementCenter;
    const offset = distance * speed;

    let transform = '';

    // Translation
    switch (direction) {
      case 'up':
        transform += `translateY(-${offset}px)`;
        break;
      case 'down':
        transform += `translateY(${offset}px)`;
        break;
      case 'left':
        transform += `translateX(-${offset}px)`;
        break;
      case 'right':
        transform += `translateX(${offset}px)`;
        break;
    }

    // Scale
    if (scale) {
      const scaleValue = 1 + (offset * 0.001);
      transform += ` scale(${Math.max(0.5, Math.min(1.5, scaleValue))})`;
    }

    // Rotation
    if (rotate) {
      const rotateValue = offset * 0.1;
      transform += ` rotate(${rotateValue}deg)`;
    }

    return transform;
  };

  return {
    elementRef,
    transform: getTransform(),
    scrollY,
    elementTop,
    elementHeight
  };
};

export default useParallax;