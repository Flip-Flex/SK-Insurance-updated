import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { IconType } from 'react-icons';

interface CardData {
  icon: IconType;
  title: string;
  desc: string;
}

interface StickyCardProps {
  card: CardData;
  idx: number;
  totalCards: number;
  activeIdx: MotionValue<number>;
}

export const StickyCard: React.FC<StickyCardProps> = ({ card, idx, totalCards, activeIdx }) => {
  // We expand the domain to explicitly define a "Reading Phase" and a "Transition Phase".
  // For each integer `i`, `i` to `i + 0.6` is the reading phase (completely static).
  // `i + 0.6` to `i + 1.0` is the transition phase.
  const input: number[] = [];
  for (let i = 0; i < totalCards; i++) {
    input.push(i);
    if (i < totalCards - 1) {
      input.push(i + 0.6);
    }
  }

  // Y Translation: Wait at 120% below -> Active at 0px -> Pushed up by -28px per depth level
  const yOutput = input.map(v => {
    // If v is at or before the end of the previous card's reading phase, stay off-screen.
    if (v <= idx - 0.4) return `120%`;
    
    // If v is exactly the current card's integer or its reading plateau, stay perfectly at 0.
    if (v >= idx && v <= idx + 0.6) return `0px`;
    
    // If v is past this card's reading phase, it is pushed up into the stack.
    // Calculate how many layers deep it has been pushed.
    const pushedCount = Math.floor(v) - idx;
    return `${-pushedCount * 28}px`;
  });

  // Scale: Enters at 1 -> Scales down by 0.02 per depth level
  const scaleOutput = input.map(v => {
    if (v <= idx + 0.6) return 1;
    const pushedCount = Math.floor(v) - idx;
    return 1 - (pushedCount * 0.02);
  });

  // Border Brightness: Active = slightly brighter border (0.2 opacity). Older = normal (0.05).
  const borderOpacity = input.map(v => {
    if (v >= idx && v <= idx + 0.6) return 0.2;
    return 0.05;
  });

  // Box Shadow: Active = Largest. Middle = Medium. Bottom = Small.
  const shadowOpacity = input.map(v => {
    if (v < idx) return 0;
    if (v >= idx && v <= idx + 0.6) return 0.15; // Largest
    
    const pushedCount = Math.floor(v) - idx;
    if (pushedCount === 1) return 0.08; // Medium
    return 0.03; // Small
  });

  const y = useTransform(activeIdx, input, yOutput);
  const scale = useTransform(activeIdx, input, scaleOutput);
  
  // Use a template to combine the motion values into a valid CSS string
  const rawShadowOpacity = useTransform(activeIdx, input, shadowOpacity);
  const boxShadow = useTransform(
    rawShadowOpacity,
    (opacity) => `0px 30px 60px -15px rgba(0, 0, 0, ${opacity})`
  );

  const rawBorderOpacity = useTransform(activeIdx, input, borderOpacity);
  const borderColor = useTransform(
    rawBorderOpacity,
    (opacity) => `rgba(128, 128, 128, ${opacity})`
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        zIndex: idx, // Natural stacking order
        transformOrigin: "top center"
      }}
      className="w-full absolute left-0 right-0 top-1/2 -translate-y-1/2 cursor-default"
    >
      <motion.div 
        style={{
          boxShadow,
          borderColor
        }}
        className="w-full rounded-[24px] p-8 sm:p-10 border glass-panel flex flex-col justify-between space-y-6 bg-neutral-50/95 dark:bg-neutral-1000/95 backdrop-blur-2xl"
      >
        <div>
          <div className="p-4 bg-white dark:bg-neutral-900 text-neutral-1000 dark:text-white rounded-[16px] inline-block mb-4 shadow-sm">
            <card.icon className="text-3xl text-neutral-1000 dark:text-white" />
          </div>
          <h3 className="text-lg font-bold text-neutral-1000 dark:text-white uppercase tracking-wider">{card.title}</h3>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-3">
            {card.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
