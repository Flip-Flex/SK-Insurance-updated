import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { FaShieldAlt, FaHeartbeat, FaCar, FaUserShield, FaHandshake, FaAward, FaStar, FaTrophy, FaChevronDown } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

import { useRef } from 'react';
import { StickyStackedCards } from '../../components/StickyStackedCards';
import { PremiumEditorialStats } from '../../components/PremiumEditorialStats';
import { EditorialTrustValues } from '../../components/EditorialTrustValues';
import { EditorialTestimonials } from '../../components/EditorialTestimonials';
const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [displayValue, setDisplayValue] = React.useState('');
  const elementRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    let prefix = '';
    let suffix = '';
    let numericString = '';
    
    const str = String(value);
    
    if (str.startsWith('₹')) {
      prefix = '₹';
      numericString = str.substring(1);
    } else {
      numericString = str;
    }
    
    if (numericString.endsWith('M+')) {
      suffix = 'M+';
      numericString = numericString.substring(0, numericString.length - 2);
    } else if (numericString.endsWith('%')) {
      suffix = '%';
      numericString = numericString.substring(0, numericString.length - 1);
    } else if (numericString.endsWith('+')) {
      suffix = '+';
      numericString = numericString.substring(0, numericString.length - 1);
    } else if (numericString.includes(' / ')) {
      const parts = numericString.split(' / ');
      numericString = parts[0];
      suffix = ' / ' + parts[1];
    }
    
    const cleanNumStr = numericString.replace(/,/g, '');
    const targetNum = parseFloat(cleanNumStr);
    
    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !animatedRef.current) {
        animatedRef.current = true;
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
          const currentVal = progress * targetNum;
          
          let formattedVal = '';
          if (cleanNumStr.includes('.')) {
            const decimals = cleanNumStr.split('.')[1].length;
            formattedVal = currentVal.toFixed(decimals);
          } else {
            formattedVal = Math.floor(currentVal).toString();
          }
          
          if (value.includes(',')) {
            formattedVal = Math.floor(currentVal).toLocaleString('en-US');
          }
          
          setDisplayValue(`${prefix}${formattedVal}${suffix}`);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setDisplayValue(value);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return <span ref={elementRef}>{displayValue || value}</span>;
};

const TrustStatCard = ({ stat, idx }) => {
  const Icon = stat.icon;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
      className="relative h-[220px] rounded-[20px] p-8 flex flex-col justify-start overflow-hidden group transition-all duration-300 ease-out hover:-translate-y-[6px] bg-neutral-1000 backdrop-blur-[20px] border border-white/10 hover:border-white/20 shadow-premium-dark hover:shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
    >
      {/* 12-15s Glass Reflection Loop */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[20px]">
        <motion.div 
          animate={{ x: ["-150%", "200%", "200%"] }}
          transition={{ duration: 12, times: [0, 0.1, 1], repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg]" 
        />
      </div>

      {/* One-time Border Sweep */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[20px]">
        <motion.div 
          initial={{ left: "-100%" }}
          whileInView={{ left: "200%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: idx * 0.15 + 0.3, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent skew-x-[-30deg]"
        />
      </div>

      {/* Subtle Radial Background Gradient inside card */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-80" 
        style={{ 
          background: 'radial-gradient(circle at 0% 0%, rgba(246, 255, 0, 0.08) 0%, transparent 60%)' 
        }} 
      />

      <div className="relative z-10 flex justify-between items-start gap-8 w-full">
        <h3 className={`${stat.size} font-[800] text-brand-accent tracking-[-2px] leading-none whitespace-nowrap overflow-visible flex-1`}>
          <AnimatedCounter value={stat.number} />
        </h3>
        
        <div className="w-[48px] h-[48px] min-w-[48px] rounded-full bg-brand-accent/[0.08] flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.1] group-hover:rotate-[10deg] shadow-[inset_0_2px_4px_rgba(246,255,0,0.15)] border border-brand-accent/10">
          <Icon className="text-[20px] text-brand-accent" />
        </div>
      </div>

      <p className="relative z-10 mt-5 text-[18px] font-[600] text-neutral-400 uppercase tracking-[0.8px] leading-relaxed opacity-90 w-full break-words">
        {stat.label}
      </p>
    </motion.div>
  );
};


export const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  
  const desktopVideoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    // Determine which video to load to prevent downloading 37MB on mobile
    const updateVideoSrc = () => {
      if (window.innerWidth >= 1024) {
        setVideoSrc('/sk_video.mp4');
      } else if (window.innerWidth >= 768) {
        setVideoSrc('/Tablet.mp4');
      } else {
        setVideoSrc('/sk_mobile.mp4');
      }
    };
    
    updateVideoSrc();
    window.addEventListener('resize', updateVideoSrc);
    return () => window.removeEventListener('resize', updateVideoSrc);
  }, []);

  useEffect(() => {
    const playVideos = () => {
      if (desktopVideoRef.current) desktopVideoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    };
    
    // Attempt to play immediately on mount
    playVideos();
    
    // Attempt to play on visibility change (sometimes helps with mobile restrictions)
    const handleVisibilityChange = () => {
      if (!document.hidden) playVideos();
    };
    
    // Attempt to play on first user interaction as a fallback
    const handleInteraction = () => {
      playVideos();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, []);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Listen to plans in real-time and sort by displayOrder
    const unsubscribe = subscribeToCollection('plans', (data) => {
      const sorted = [...data].sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? parseInt(a.displayOrder) : 999;
        const orderB = b.displayOrder !== undefined ? parseInt(b.displayOrder) : 999;
        return orderA - orderB;
      });
      setPlans(sorted);
    });
    return () => unsubscribe();
  }, []);

  const defaultPartners = [
    {
      name: 'Postal Office',
      type: 'Government / PLI',
      logo: '/logos/Postal Office.png',
      onlineLogo: '/logos/Postal Office.png',
      tag: 'INDIA POST TRUST',
      desc: 'Government of India postal life insurance with lowest premiums & maximum bonus rates.'
    },
    {
      name: 'Future Generali',
      type: 'General & Health',
      logo: '/logos/Future Generali.jpg',
      onlineLogo: '/logos/Future Generali.jpg',
      tag: 'FAST TRACK CLAIMS',
      desc: 'Global insurance expertise with instant digital policy issuance & hassle-free claim settlement.'
    },
    {
      name: 'Bajaj Allianz',
      type: 'General & Motor',
      logo: '/logos/bajaj_allianz.png',
      onlineLogo: 'https://logo.clearbit.com/bajajallianz.com',
      tag: 'GLOBAL ASSIST',
      desc: 'Worldwide emergency care, motor zero-dep, & personal accident cover.'
    },
    {
      name: 'Aditya Birla Sun Life',
      type: 'Life & Savings',
      logo: '/logos/Aditya Birla Sun Life.jpg',
      onlineLogo: '/logos/Aditya Birla Sun Life.jpg',
      tag: 'WEALTH SHIELD',
      desc: 'Flexible savings and market-linked returns to fulfill family goals & milestones.'
    },
    {
      name: 'Oriental Insurance',
      type: 'General & Property',
      logo: '/logos/oriental_insurance.png',
      onlineLogo: '/logos/oriental_insurance.png',
      tag: 'PUBLIC SECTOR TRUST',
      desc: 'Premier PSU insurer providing comprehensive home, fire, motor & commercial coverage.'
    },
    {
      name: 'Tata AIA Life',
      type: 'Life & Term',
      logo: '/logos/tata_aia.png',
      onlineLogo: 'https://logo.clearbit.com/tataaia.com',
      tag: 'HIGH PAYOUT',
      desc: 'Comprehensive protection with wealth creation & monthly pension options.'
    },
    {
      name: 'ICICI Prudential / Lombard',
      type: 'General & Life',
      logo: '/logos/icici_prudential.png',
      onlineLogo: 'https://logo.clearbit.com/icicipruamc.com',
      tag: 'INSTANT CLAIMS',
      desc: 'Bumper-to-bumper protection with instant digital policy issuance & claim status tracker.'
    },
    {
      name: 'HDFC Life',
      type: 'Life & Health',
      logo: '/logos/hdfc_life.png',
      onlineLogo: 'https://logo.clearbit.com/hdfclife.com',
      tag: '4X COVER SHIELD',
      desc: 'Guaranteed payout protection plans with digital onboarding services.'
    },
    {
      name: 'SBI Life Insurance',
      type: 'Life & ULIP',
      logo: '/logos/sbi_life.png',
      onlineLogo: 'https://logo.clearbit.com/sbilife.co.in',
      tag: 'SOVEREIGN BANK TRUST',
      desc: 'Trusted sovereign financial security backed by State Bank of India.'
    },
    {
      name: 'Niva Bupa Health',
      type: 'Health Care',
      logo: '/logos/niva_bupa.png',
      onlineLogo: 'https://logo.clearbit.com/nivabupa.com',
      tag: 'CRITICAL SHIELD',
      desc: 'Comprehensive medical coverage with direct hospital desk approval.'
    },
    {
      name: 'Allianz Care',
      type: 'Global Health',
      logo: '/logos/bajaj_allianz.png',
      onlineLogo: 'https://logo.clearbit.com/allianz.com',
      tag: 'WORLDWIDE COVER',
      desc: 'International travel & healthcare protection for global professionals.'
    },
    {
      name: 'Kotak Mahindra Life',
      type: 'Life & Retirement',
      logo: '/logos/Kotak Mahindra Life.jpg',
      onlineLogo: '/logos/Kotak Mahindra Life.jpg',
      tag: 'SMART RETIREMENT',
      desc: 'Guaranteed income plans for lifelong financial independence & security.'
    },
    {
      name: 'PNB MetLife',
      type: 'Life & Child',
      logo: '/logos/PNB MetLife.png',
      onlineLogo: '/logos/PNB MetLife.png',
      tag: 'CHILD FUTURE',
      desc: 'Tailored education and milestone security plans for growing children.'
    },
    {
      name: 'ManipalCigna Health',
      type: 'Health Care',
      logo: '/logos/ManipalCigna Health.png',
      onlineLogo: '/logos/ManipalCigna Health.png',
      tag: 'WELLNESS FIRST',
      desc: 'Restoration benefit and preventive healthcare checkups included.'
    },
    {
      name: 'Star Health Insurance',
      type: 'Health Care',
      logo: '/logos/star_health.png',
      onlineLogo: 'https://logo.clearbit.com/starhealth.in',
      tag: 'CASHLESS CARE',
      desc: '100% Cashless network with zero co-pay at 14,000+ top hospitals.'
    },
    {
      name: 'Max Life / Axis',
      type: 'Life & Term',
      logo: '/logos/axis_max.png',
      onlineLogo: '/logos/axis_max.png',
      tag: 'TOP CLAIM RATIO',
      desc: 'Industry leading 99.5% claim settlement ratio with swift payouts.'
    }
  ];

  const defaultTestimonials = [
    {
      quote: "I am grateful for the opportunity to complete my internship with this organization. During this internship, I gained valuable knowledge about the insurance industry, customer relationship management, and financial planning.",
      author: "Harini",
      role: "Verified Client"
    },
    {
      quote: "My internship at sk smart investment company was a valuable learning experience. I improved my communication skill, learned about insurance products and gained practical knowledge.",
      author: "Dhivya Kumaran",
      role: "Verified Client"
    },
    {
      quote: "The mentors and staff members were supportive and guided me throughout the internship, which made the learning experience more comfortable and effective.",
      author: "Manimozhi E",
      role: "Verified Client"
    },
    {
      quote: "The personalized financial planning advice I received was exceptional. They really took the time to understand my family's goals and set us up for long-term success.",
      author: "Priya Sharma",
      role: "Verified Client"
    },
    {
      quote: "Excellent customer service and very transparent processes. Getting my motor insurance renewed took less than 10 minutes online with their assistance.",
      author: "Arun Venkatesh",
      role: "Verified Client"
    },
    {
      quote: "SK Smart Investments helped me find the perfect health insurance plan for my parents. The team explained everything clearly and ensured I got the best coverage.",
      author: "Rajesh Kumar",
      role: "Verified Client"
    },
    {
      quote: "Seamless digital onboarding and instant policy downloads. True integrity in modern financial and risk advisory.",
      author: "Vikram Rajan",
      role: "Verified Client"
    }
  ];

  const [partnersList, setPartnersList] = useState(defaultPartners);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    // Listen to partners in real-time
    const unsubscribePartners = subscribeToCollection('partners', (data) => {
      if (data && data.length > 0) setPartnersList(data);
    });
    // Listen to testimonials in real-time
    const unsubscribeTestimonials = subscribeToCollection('testimonials', (data) => {
      if (data && data.length > 0) {
        const mapped = data.map(t => ({
          quote: t.text || t.quote || '',
          author: t.name || t.author || '',
          role: t.role || ''
        }));
        setTestimonials(mapped);
      }
    });
    return () => {
      unsubscribePartners();
      unsubscribeTestimonials();
    };
  }, []);

  const handleImageError = (e, b) => {
    if (e.target.src.includes('clearbit')) {
      e.target.src = b.logo;
    } else {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'block';
    }
  };

  const stats = [
    { number: '98.7%', label: t('claims_rate'), icon: FaShieldAlt, size: 'text-[54px]' },
    { number: '₹420M+', label: t('claims_disbursed'), icon: FaHandshake, size: 'text-[52px]' },
    { number: '150,000+', label: t('clients_protected'), icon: FaUserShield, size: 'text-[50px]' },
    { number: '4.9 / 5', label: t('avg_rating'), icon: FaAward, size: 'text-[48px]' }
  ];

  const values = [
    {
      title: 'Digital-First Simplicity',
      description: 'Scans, quotes, and payouts managed seamlessly via client portals with instant status tracker feeds.',
      icon: FaUserShield
    },
    {
      title: 'Underwriting Integrity',
      description: 'Transparent calculators reflecting genuine actuarial risk tables with zero surprise charges.',
      icon: FaHandshake
    },
    {
      title: 'Award-Winning Underwriting',
      description: 'Highly commended boutique operations recognized globally for custom risk modeling options.',
      icon: FaAward
    }
  ];

  return (
    <div className="relative">
      {/* Full-width Fixed Background Video Banner at the Top */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Dynamic Responsive Video - Only loads one video to save bandwidth */}
        {videoSrc && (
          <video 
            key={videoSrc}
            ref={desktopVideoRef}
            className="fixed top-0 left-0 w-full h-screen object-cover -z-20 pointer-events-none" 
            autoPlay 
            loop 
            muted 
            defaultMuted
            playsInline
            webkit-playsinline="true"
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 cursor-pointer"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col items-center transition-transform hover:scale-110">
            <FaChevronDown className="text-xl text-black" />
          </div>
        </motion.div>
      </section>

      {/* Parallax Content Overlay Wrap - Scrolls up over the fixed video */}
      <div className="relative bg-neutral-1000 z-10 pt-16 pb-0 space-y-24 border-t border-white/5 shadow-premium-dark">

      {/* Counters Stats Strip */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <PremiumEditorialStats stats={stats} />
      </section>

      {/* Educational Section: What is Insurance & Types */}
      <section className="w-full">
        <StickyStackedCards />
      </section>

      {/* Trust Values Section */}
      <EditorialTrustValues values={values} />


      {/* Testimonials Strip */}
      <EditorialTestimonials testimonials={testimonials} />
      </div>
    </div>
  );
};
export default Home;
