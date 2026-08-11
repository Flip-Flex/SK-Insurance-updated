import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const SQRT_5000 = Math.sqrt(5000);

const defaultTestimonials = [
  {
    tempId: 0,
    testimonial: "My favorite solution in the market. We work 5x faster with COMPANY.",
    by: "Alex, CEO at TechCorp",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    testimonial: "I'm confident my data is safe with COMPANY. I can't say that about other providers.",
    by: "Dan, CTO at SecureNet",
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    tempId: 2,
    testimonial: "I know it's cliche, but we were lost before we found COMPANY. Can't thank you guys enough!",
    by: "Stephanie, COO at InnovateCo",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: "COMPANY's products make planning for the future seamless. Can't recommend them enough!",
    by: "Marie, CFO at FuturePlanning",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc: "https://i.pravatar.cc/150?img=6"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're on COMPANY, we're never going back.",
    by: "Pam, Marketing Director at BrandBuilders",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 7,
    testimonial: "I would be lost without COMPANY's in-depth analytics. The ROI is EASILY 100X for us.",
    by: "Daniel, Data Scientist at AnalyticsPro",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period.",
    by: "Fernando, UX Designer at UserFirst",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 9,
    testimonial: "I switched 5 years ago and never looked back.",
    by: "Andy, DevOps Engineer at CloudMasters",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a solution like COMPANY for YEARS. So glad I finally found one!",
    by: "Pete, Sales Director at RevenueRockets",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 11,
    testimonial: "It's so simple and intuitive, we got the team up to speed in 10 minutes.",
    by: "Marina, HR Manager at TalentForge",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 12,
    testimonial: "COMPANY's customer support is unparalleled. They're always there when we need them.",
    by: "Olivia, Customer Success Manager at ClientCare",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  },
  {
    tempId: 13,
    testimonial: "The efficiency gains we've seen since implementing COMPANY are off the charts!",
    by: "Raj, Operations Manager at StreamlineSolutions",
    imgSrc: "https://i.pravatar.cc/150?img=14"
  },
  {
    tempId: 14,
    testimonial: "COMPANY has revolutionized how we handle our workflow. It's a game-changer!",
    by: "Lila, Workflow Specialist at ProcessPro",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  },
  {
    tempId: 15,
    testimonial: "The scalability of COMPANY's solution is impressive. It grows with our business seamlessly.",
    by: "Trevor, Scaling Officer at GrowthGurus",
    imgSrc: "https://i.pravatar.cc/150?img=16"
  },
  {
    tempId: 16,
    testimonial: "I appreciate how COMPANY continually innovates. They're always one step ahead.",
    by: "Naomi, Innovation Lead at FutureTech",
    imgSrc: "https://i.pravatar.cc/150?img=17"
  },
  {
    tempId: 17,
    testimonial: "The ROI we've seen with COMPANY is incredible. It's paid for itself many times over.",
    by: "Victor, Finance Analyst at ProfitPeak",
    imgSrc: "https://i.pravatar.cc/150?img=18"
  },
  {
    tempId: 18,
    testimonial: "COMPANY's platform is so robust, yet easy to use. It's the perfect balance.",
    by: "Yuki, Tech Lead at BalancedTech",
    imgSrc: "https://i.pravatar.cc/150?img=19"
  },
  {
    tempId: 19,
    testimonial: "We've tried many solutions, but COMPANY stands out in terms of reliability and performance.",
    by: "Zoe, Performance Manager at ReliableSystems",
    imgSrc: "https://i.pravatar.cc/150?img=20"
  }
];

const TestimonialCard = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out flex flex-col overflow-hidden",
        isCenter 
          ? "z-10 bg-brand-accent text-neutral-1000 border-brand-accent" 
          : "z-0 bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 border-black/10 dark:border-white/10 hover:border-brand-accent/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(255,255,255,0.1)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-white/10"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      {testimonial.imgSrc && (
        <img
          src={testimonial.imgSrc}
          alt={`${testimonial.by?.split(',')[0]}`}
          className="mb-4 h-12 w-12 rounded-full bg-neutral-800 object-cover object-center"
          style={{
            boxShadow: "0px 0px 0px 2px rgba(255,255,255,0.1)"
          }}
        />
      )}
      <h3 className={cn(
        "text-base sm:text-xl font-medium overflow-y-auto flex-1 min-h-0 pr-2 pb-2",
        isCenter ? "text-neutral-1000" : "text-black dark:text-neutral-100"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "mt-auto pt-4 text-sm italic z-10 border-t",
        isCenter ? "text-neutral-800 border-black/10" : "text-neutral-600 dark:text-neutral-400 border-black/10 dark:border-white/10"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = ({ testimonials = defaultTestimonials }) => {
  const [cardSize, setCardSize] = useState(365);
  // Ensure each testimonial has a tempId for React keys
  const [testimonialsList, setTestimonialsList] = useState(() => 
    testimonials.map((t, i) => ({ ...t, tempId: t.tempId !== undefined ? t.tempId : i }))
  );

  useEffect(() => {
    setTestimonialsList(
      testimonials.map((t, i) => ({ ...t, tempId: t.tempId !== undefined ? t.tempId : i }))
    );
  }, [testimonials]);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!testimonialsList || testimonialsList.length === 0) return null;

  return (
    <div className="py-24 bg-neutral-50 dark:bg-neutral-1000 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
          What Our <span className="text-brand-accent">Clients Say</span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Hear from the people who have experienced our services first-hand.
        </p>
      </div>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 500 }}
      >
        {testimonialsList.map((testimonial, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length - 1) / 2
            : index - testimonialsList.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white dark:bg-neutral-900 border-2 border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-brand-accent hover:text-neutral-1000 hover:border-brand-accent dark:hover:text-neutral-1000",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-1000"
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white dark:bg-neutral-900 border-2 border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-brand-accent hover:text-neutral-1000 hover:border-brand-accent dark:hover:text-neutral-1000",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-1000"
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

