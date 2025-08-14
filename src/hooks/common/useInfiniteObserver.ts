import { useEffect, useRef } from 'react';

type Options = {
  enabled?: boolean;           
  onIntersect: () => void;     
  root?: Element | null;
  rootMargin?: string;      
  threshold?: number;    
};

export default function useInfiniteObserver({
  enabled = true,
  onIntersect,
  root = null,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0,
}: Options) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { root, rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return ref; 
}
