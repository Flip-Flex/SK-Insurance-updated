import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const useStickyScroll = (totalItems: number) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map 0-1 scroll to 0-3 index. 
  // Eliminates dead padding so the section releases immediately after the last card.
  const activeIdx = useTransform(scrollYProgress, [0, 1], [0, totalItems - 1], { clamp: true });

  return { containerRef, activeIdx };
};

