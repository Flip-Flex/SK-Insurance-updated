import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  location?: string;
  image?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent w-full"
      >
        {[
          ...new Array(4).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ quote, image, author, role, location }, i) => (
                <div className="p-8 sm:p-10 rounded-[32px] border border-white/5 shadow-lg shadow-black/10 w-full bg-neutral-900/40 backdrop-blur-xl" key={i}>
                  <div className="text-[15px] leading-relaxed text-neutral-300">"{quote}"</div>
                  <div className="flex items-center gap-3 mt-6">
                    <img
                      width={40}
                      height={40}
                      src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`}
                      alt={author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight text-white">{author}</div>
                      <div className="text-xs leading-5 opacity-60 tracking-widest uppercase text-brand-accent mt-0.5">
                        {role} {location ? `• ${location}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

interface EditorialTestimonialsProps {
  testimonials?: Testimonial[];
}

export const EditorialTestimonials: React.FC<EditorialTestimonialsProps> = ({ testimonials: propTestimonials }) => {
  const { t } = useTranslation();

  const fallbackTestimonials: Testimonial[] = [
    {
      quote: "I am grateful for the opportunity to secure our family's financial roadmap. The clarity, prompt response, and digital simplicity exceeded all expectations.",
      author: "Harini Harini",
      role: "Verified Client",
      location: "Chennai, India"
    },
    {
      quote: "My experience was exceptional. Their advisory guided us through health and life plans with complete transparency and zero hidden terms.",
      author: "Dhivya Kumaran",
      role: "Policyholder",
      location: "Dubai, UAE"
    },
    {
      quote: "The underwriting team guided me throughout the claim settlement process. Cashless approval took under 30 minutes at the hospital.",
      author: "Manimozhi E",
      role: "Corporate Client",
      location: "Bengaluru, India"
    },
    {
      quote: "Seamless digital onboarding and instant policy downloads. True integrity in modern financial and risk advisory.",
      author: "Vikram Rajan",
      role: "HNI Investor",
      location: "London, UK"
    },
    {
      quote: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
      author: "Briana Patton",
      role: "Operations Manager"
    },
    {
      quote: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
      author: "Bilal Ahmed",
      role: "IT Manager"
    },
    {
      quote: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
      author: "Saman Malik",
      role: "Customer Support Lead"
    },
    {
      quote: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
      author: "Omar Raza",
      role: "CEO"
    },
    {
      quote: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
      author: "Zainab Hussain",
      role: "Project Manager"
    }
  ];

  const list = (propTestimonials && propTestimonials.length > 0) ? propTestimonials : fallbackTestimonials;

  // Split into 4 columns for wider screens
  const getCol = (colIndex: number) => {
    return list.filter((_, i) => i % 4 === colIndex);
  };

  const firstColumn = getCol(0);
  const secondColumn = getCol(1);
  const thirdColumn = getCol(2);
  const fourthColumn = getCol(3);

  return (
    <section className="bg-transparent relative py-12 sm:py-24 overflow-hidden border-t border-white/5 w-full">
      {/* Background Ambient Glow */}

      <div className="w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center md:items-end justify-between max-w-[1400px] mx-auto px-4 md:px-8 xl:px-16 w-full gap-6 md:gap-12"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4">
              <span className="text-[11px] font-extrabold text-brand-accent tracking-[0.3em] uppercase">
                // VOICES OF TRUST
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[900] tracking-[-1px] text-white leading-tight uppercase mt-2">
              What our clients say
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-400 max-w-sm leading-relaxed font-normal tracking-wide text-center md:text-right md:pb-2">
            Discover the experiences of our valued policyholders and partners.
          </p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-16 max-w-[1400px] mx-auto px-4 md:px-8 xl:px-16 overflow-hidden max-h-[738px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn.length ? firstColumn : list} className="flex-1" duration={35} />
          <TestimonialsColumn testimonials={secondColumn.length ? secondColumn : list} className="hidden md:block flex-1" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn.length ? thirdColumn : list} className="hidden lg:block flex-1" duration={35} />
          <TestimonialsColumn testimonials={fourthColumn.length ? fourthColumn : list} className="hidden xl:block flex-1" duration={35} />
        </div>
      </div>
    </section>
  );
};