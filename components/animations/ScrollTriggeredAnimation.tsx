'use client';

import React, { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimationConfig, animationVariants, createStaggeredAnimation } from '@/lib/animations';

interface ScrollTriggeredAnimationProps extends ScrollAnimationConfig {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  triggerOnce?: boolean;
  disabled?: boolean;
}

export const ScrollTriggeredAnimation: React.FC<ScrollTriggeredAnimationProps> = ({
  children,
  className = '',
  as: Component = 'div',
  animation = 'fadeIn',
  duration = 800,
  delay = 0,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  disabled = false
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    disabled
  });

  const variant = animationVariants[animation];
  const initialStyle = variant.initial;
  const animateStyle = variant.animate;

  const style: React.CSSProperties = {
    ...initialStyle,
    ...(isVisible ? animateStyle : {}),
    transition: `all ${duration}ms ${easing} ${delay}ms`,
    willChange: 'transform, opacity'
  };

  return (
    <Component
      ref={elementRef}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

// Composant pour les listes avec animation staggered
interface ScrollTriggeredListProps extends ScrollAnimationConfig {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  itemAs?: keyof JSX.IntrinsicElements;
}

export const ScrollTriggeredList: React.FC<ScrollTriggeredListProps> = ({
  children,
  className = '',
  itemClassName = '',
  as: Component = 'div',
  itemAs: ItemComponent = 'div',
  animation = 'slideUp',
  duration = 600,
  delay = 0,
  stagger = 100,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const variant = animationVariants[animation];

  return (
    <Component ref={elementRef} className={className}>
      {children.map((child, index) => {
        const staggeredDelay = createStaggeredAnimation(delay, stagger || 100, index);
        const initialStyle = variant.initial;
        const animateStyle = variant.animate;

        const style: React.CSSProperties = {
          ...initialStyle,
          ...(isVisible ? animateStyle : {}),
          transition: `all ${duration}ms ${easing} ${staggeredDelay.delay}ms`,
          willChange: 'transform, opacity'
        };

        return (
          <ItemComponent
            key={index}
            className={itemClassName}
            style={style}
          >
            {child}
          </ItemComponent>
        );
      })}
    </Component>
  );
};

export default ScrollTriggeredAnimation;