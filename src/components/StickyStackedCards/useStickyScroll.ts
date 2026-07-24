import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const useStickyScroll = (totalItems: number) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map 0-0.8 scroll to 0-3 index. 
  // The last 20% of the scroll acts as release padding.
  const activeIdx = useTransform(scrollYProgress, [0, 0.8], [0, totalItems - 1], { clamp: true });

  return { containerRef, activeIdx };
};
