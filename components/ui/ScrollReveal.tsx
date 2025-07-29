'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'flipIn';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  stagger?: number;
  distance?: number;
}

const ScrollReveal = ({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  triggerOnce = true,
  stagger = 0,
  distance = 30
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay + stagger);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, stagger, threshold, triggerOnce, hasTriggered]);

  const animations = {
    fadeIn: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: ''
    },
    slideUp: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`
    },
    slideDown: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'translateY(0)' : `translateY(-${distance}px)`
    },
    slideLeft: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'translateX(0)' : `translateX(${distance}px)`
    },
    slideRight: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'translateX(0)' : `translateX(-${distance}px)`
    },
    scaleIn: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'scale(1)' : 'scale(0.8)'
    },
    rotateIn: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'rotate(0deg)' : 'rotate(-10deg)'
    },
    flipIn: {
      initial: 'opacity-0',
      animate: 'opacity-100',
      transform: isVisible ? 'rotateY(0deg)' : 'rotateY(-90deg)'
    }
  };

  const currentAnimation = animations[animation];

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all ease-out',
        isVisible ? currentAnimation.animate : currentAnimation.initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transform: currentAnimation.transform,
        transformOrigin: 'center'
      }}
    >
      {children}
    </div>
  );
};

// Hook pour révéler plusieurs éléments avec stagger
const useScrollRevealStagger = (itemCount: number, staggerDelay = 100) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Révéler les éléments un par un avec délai
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, i]);
            }, i * staggerDelay);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [itemCount, staggerDelay]);

  return { visibleItems, containerRef };
};

// Composant pour révéler une liste d'éléments
interface ScrollRevealListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  animation?: ScrollRevealProps['animation'];
  staggerDelay?: number;
  threshold?: number;
}

const ScrollRevealList = ({
  children,
  className,
  itemClassName,
  animation = 'slideUp',
  staggerDelay = 100,
  threshold = 0.1
}: ScrollRevealListProps) => {
  const { visibleItems, containerRef } = useScrollRevealStagger(children.length, staggerDelay);

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          delay={0}
          threshold={threshold}
          className={cn(
            'transition-all duration-600 ease-out',
            visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            itemClassName
          )}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

// Composant pour révéler du texte lettre par lettre
interface ScrollRevealTextProps {
  text: string;
  className?: string;
  letterDelay?: number;
  wordDelay?: number;
  threshold?: number;
}

const ScrollRevealText = ({
  text,
  className,
  letterDelay = 50,
  wordDelay = 200,
  threshold = 0.1
}: ScrollRevealTextProps) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const words = text.split(' ');
          let charIndex = 0;

          words.forEach((word, wordIndex) => {
            setTimeout(() => {
              word.split('').forEach((_, letterIndex) => {
                setTimeout(() => {
                  setVisibleChars(charIndex + letterIndex + 1);
                }, letterIndex * letterDelay);
              });
              charIndex += word.length + 1; // +1 pour l'espace
            }, wordIndex * wordDelay);
          });
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [text, letterDelay, wordDelay, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            'transition-all duration-300 ease-out',
            index < visibleChars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
          style={{ transitionDelay: `${index * 20}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

// Hook pour détecter si un élément est visible
const useInView = (threshold = 0.1, triggerOnce = true) => {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsInView(true);
          setHasTriggered(true);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, triggerOnce, hasTriggered]);

  return { ref, isInView };
};

export { 
  ScrollReveal, 
  ScrollRevealList, 
  ScrollRevealText, 
  useScrollRevealStagger, 
  useInView 
};

export type { 
  ScrollRevealProps, 
  ScrollRevealListProps, 
  ScrollRevealTextProps 
};