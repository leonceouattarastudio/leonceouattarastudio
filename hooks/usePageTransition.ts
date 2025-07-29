'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UsePageTransitionOptions {
  duration?: number;
  easing?: string;
}

export const usePageTransition = (options: UsePageTransitionOptions = {}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const router = useRouter();

  const { duration = 500, easing = 'cubic-bezier(0.4, 0, 0.2, 1)' } = options;

  const navigateWithTransition = (href: string) => {
    setIsTransitioning(true);
    setTransitionStage('leaving');

    setTimeout(() => {
      router.push(href);
      setTransitionStage('entering');
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionStage('idle');
      }, duration / 2);
    }, duration / 2);
  };

  return {
    isTransitioning,
    transitionStage,
    navigateWithTransition,
    duration,
    easing
  };
};

export default usePageTransition;