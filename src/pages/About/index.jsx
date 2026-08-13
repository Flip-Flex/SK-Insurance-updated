import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { FaAward, FaShieldAlt, FaUsers, FaChartLine, FaTimes, FaSearchPlus, FaLinkedin, FaInstagram, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';
import { useTranslation } from '../../context/LanguageContext';
import { Hover3DCard } from '../../components/ui/Hover3DCard';

/* ─── Animated Counter ─── */
const Counter = ({ from, to, suffix = "", duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      if (ref.current) ref.current.textContent = Math.floor(from + (to - from) * p) + suffix;
      if (p < 1) raf = requestAnimationFrame(step);
      else if (ref.current) ref.current.textContent = to + suffix;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, suffix, duration]);

  return <span ref={ref}>{from}{suffix}</span>;
};

/* ─── Award Card ─── */
const AwardCard = ({ aw, onClick, index = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [8, -8]);
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);
  const sx = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const sy = useSpring(rotateY, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => onClick(index)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="group cursor-pointer relative rounded-2xl overflow-hidden break-inside-avoid mb-6 bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-white/8 hover:border-stone-400 dark:hover:border-brand-accent/40 transition-all duration-500 shadow-sm hover:shadow-lg dark:shadow-none"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <img
          src={aw.img}
          alt={aw.title}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute bottom-3 left-0 w-full px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-xs font-semibold text-white text-center leading-tight drop-shadow-md">{aw.title}</h3>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaSearchPlus className="text-stone-700 dark:text-white text-sm" />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Section Heading Component ─── */
const SectionTag = ({ children }) => (
  <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-4">
    {children}
  </span>
);

/* ─── Main Component ─── */
export const About = () => {
  const [selectedAwardIndex, setSelectedAwardIndex] = useState(null);
  const { t } = useTranslation();

  const peopleData = [
    {
      name: "Mrs. Kumutha Krishnamoorthy",
      designation: "CEO & Founder",
      quote: "Mrs. Kumutha Krishnamoorthy is the visionary CEO & Founder of SK Smart Investments, leading the organization with a strong commitment to integrity, innovation, and customer-first financial services.",
      src: "/kumutha_krishnamoorthy.jpg",
      highlights: ["Strategic Vision", "Operational Excellence"]
    },
    {
      name: "Mr. Prakash Gajendiran",
      designation: "Founder & MD",
      quote: "Certified Financial Consultant & Senior Business Associate Leader with over 22 years of experience, guiding countless clients in making informed financial decisions.",
      src: "/prakash_gajendiran.jpg",
      stats: [
        { num: 22, suffix: "+", label: "Years Experience" },
        { num: 3, suffix: "x", label: "Aura Achiever" }
      ]
    }
  ];

  const [awards, setAwards] = useState([
    { title: 'Dream Agency Elite Aspirant Award', tag: 'INDUSTRY RECOGNITION', desc: 'Recognized for remarkable progress, commitment to excellence, and continuous professional growth.', img: '/Awards_JPG/IMG_3623.jpg' },
    { title: 'MDRT Aspirant Achievement', tag: 'INDUSTRY RECOGNITION', desc: 'Honored for successfully qualifying for the MDRT Aspirant milestone, reflecting dedication to world-class financial advisory standards.', img: '/Awards_JPG/IMG_3631.jpg' },
    { title: 'InfinPro Consultant Excellence', tag: 'INDUSTRY RECOGNITION', desc: 'Presented in appreciation of outstanding consultant performance and commitment to delivering quality financial guidance.', img: '/Awards_JPG/IMG_3624.jpg' },
    { title: 'Tambaram Branch Performance Excellence', tag: 'INDUSTRY RECOGNITION', desc: 'Recognized as a top-performing branch for outstanding business growth, customer satisfaction, and leadership.', img: '/Awards_JPG/IMG_3634.jpg' },
    { title: 'Dronacharya Branch Excellence Award', tag: 'INDUSTRY RECOGNITION', desc: 'Awarded by Tata AIA Life Insurance for outstanding branch leadership, business excellence, and consistent advisory performance.', img: '/Awards_JPG/IMG_3619.jpg' },
    { title: 'Outstanding Performer Award', tag: 'INDUSTRY RECOGNITION', desc: 'Recognized as a consistent top performer for exceptional business achievements and client service excellence.', img: '/Awards_JPG/IMG_3628.jpg' },
    { title: 'Million Dollar Club Qualifier', tag: 'INDUSTRY RECOGNITION', desc: 'Qualified for the prestigious Million Dollar Club in recognition of outstanding sales performance and client trust.', img: '/Awards_JPG/IMG_3638.jpg' },
    { title: 'Pragati Business Growth Excellence', tag: 'INDUSTRY RECOGNITION', desc: 'Recognized for achieving exceptional business growth, innovation, and consistent client-focused financial advisory services.', img: '/Awards_JPG/IMG_3620.jpg' },
    { title: 'Family Inspiration Recognition', tag: 'INDUSTRY RECOGNITION', desc: 'A special recognition celebrating dedication, family support, and commitment behind entrepreneurial success.', img: '/Awards_JPG/IMG_3626.jpg' },
    { title: 'Malaysia Training Conclave Qualifier', tag: 'INDUSTRY RECOGNITION', desc: 'Qualified to participate in the exclusive Malaysia Training Conclave, recognizing outstanding business achievement and leadership excellence.', img: '/Awards_JPG/IMG_3643.jpg' },
    { title: 'Dream Agency Aspirant Recognition', tag: 'INDUSTRY RECOGNITION', desc: 'Honored as a high-potential advisor demonstrating exceptional dedication, leadership, and business performance within the Dream Agency program.', img: '/Awards_JPG/IMG_3622.jpg' },
    { title: 'Leadership Appreciation Certificate', tag: 'INDUSTRY RECOGNITION', desc: 'Presented in recognition of leadership, professional integrity, and continuous contribution to organizational success.', img: '/Awards_JPG/IMG_3629.jpg' },
    { title: 'Donautsav Business Excellence Award', tag: 'INDUSTRY RECOGNITION', desc: 'Honored for exceptional business performance, customer commitment, and continued professional growth within the Dream Team Agency.', img: '/Awards_JPG/IMG_3639.jpg' },
    { title: 'Business Growth Achievement Certificate', tag: 'INDUSTRY RECOGNITION', desc: 'Awarded for successfully completing the Aim For Your Business Growth leadership workshop and enhancing professional capabilities.', img: '/Awards_JPG/IMG_3625.jpg' },
    { title: 'MDRT Aspirant Excellence Award', tag: 'INDUSTRY RECOGNITION', desc: 'Awarded for outstanding commitment toward achieving Million Dollar Round Table performance benchmarks.', img: '/Awards_JPG/IMG_3633.jpg' },
    { title: 'AI & Technology Learning Certificate', tag: 'INDUSTRY RECOGNITION', desc: 'Successfully completed advanced AI learning programs focused on improving productivity and modern advisory practices.', img: '/Awards_JPG/IMG_3627.jpg' },
    { title: 'Dream Agency Branch Champion', tag: 'INDUSTRY RECOGNITION', desc: 'Awarded for exceptional branch management, operational excellence, and sustained business performance.', img: '/Awards_JPG/IMG_3636.jpg' }
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedAwardIndex(null);
      if (e.key === 'ArrowRight') setSelectedAwardIndex((p) => (p !== null && p < awards.length - 1 ? p + 1 : p));
      if (e.key === 'ArrowLeft') setSelectedAwardIndex((p) => (p !== null && p > 0 ? p - 1 : p));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [awards.length]);

  useEffect(() => {
    const unsub = subscribeToCollection('gallery', (data) => {
      if (data && data.length > 0) { /* setAwards(data); */ }
    });
    return () => unsub();
  }, []);

  const principles = [
    { title: 'Absolute Transparency', desc: 'Zero hidden clauses, clear deductible guides, and upfront premium definitions for total peace of mind.', icon: FaShieldAlt },
    { title: 'Actuarial Precision', desc: 'Goal-based wealth planners and SIP calculators designed using real-time market data indexes.', icon: FaChartLine },
    { title: 'Community Advocacy', desc: 'Providing Kanchipuram and wider Tamil Nadu with local, accessible, and personalized financial coaching.', icon: FaUsers },
    { title: 'Dedicated Claims Desk', desc: 'Pre-sales advice and full post-sales filing support to ensure maximum claim clearance rates.', icon: FaAward }
  ];

  const milestones = [
    { year: '2004', title: 'Independent Advisory', desc: 'Managing Director Prakash Gajendiran starts independent financial planning services in Kanchipuram.', colorClass: 'group-hover:bg-brand-accent group-hover:text-stone-900 group-hover:shadow-[0_0_20px_rgba(255,179,0,0.6)]' },
    { year: '2012', title: 'Portfolio Expansion', desc: 'Secures primary partnership certifications with India’s leading life insurers (LIC, Tata AIA).', colorClass: 'group-hover:bg-brand-accent group-hover:text-stone-900 group-hover:shadow-[0_0_20px_rgba(255,179,0,0.6)]' },
    { year: '2018', title: 'AUM Milestones', desc: 'Protects over 2,500 local families and manages significant long-term portfolios.', colorClass: 'group-hover:bg-brand-accent group-hover:text-stone-900 group-hover:shadow-[0_0_20px_rgba(255,179,0,0.6)]' },
    { year: '2025', title: 'MD Plaza HQ', desc: 'Establishes state-of-the-art office at #104, West Raja Street, launching digital portals.', colorClass: 'group-hover:bg-brand-accent group-hover:text-stone-900 group-hover:shadow-[0_0_20px_rgba(255,179,0,0.6)]' }
  ];

  const missions = [
    { title: 'Personalized Solutions', text: 'Deliver tailored insurance and financial solutions to individual needs.' },
    { title: 'Premium Products', text: 'Offer products from leading insurance companies with competitive pricing.' },
    { title: 'Expert Guidance', text: 'Simplify insurance through honest advice and professional guidance.' },
    { title: 'Seamless Support', text: 'Ensure quick policy issuance and seamless renewal support.' },
    { title: 'Claims Advocacy', text: 'Provide dedicated claims assistance until successful settlement.' }
  ];

  return (
    <div className="w-full bg-stone-50 dark:bg-[#0a0a0a] min-h-screen text-stone-900 dark:text-stone-100 overflow-clip">

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-end pb-16 sm:pb-24 pt-32 sm:pt-40 overflow-hidden">
        {/* Warm ambient wash */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-amber-100/60 dark:bg-brand-accent/[0.06] rounded-bl-[40%] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-stone-200/50 dark:bg-stone-800/20 rounded-tr-[30%] blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <SectionTag>About SK Smart Investments</SectionTag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[clamp(2rem,6vw,5rem)] uppercase font-extrabold leading-[1.05] tracking-tight text-stone-900 dark:text-white max-w-5xl mt-6"
          >
            SECURING WEALTH,{' '}
            <span className="text-brand-accent">EMPOWERING FUTURES.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 max-w-3xl mx-auto text-lg text-stone-600 dark:text-stone-400 leading-relaxed"
          >
            With over two decades of dedicated expertise, we specialize in comprehensive insurance planning — delivering institutional-grade protection for your life, health, vehicles, and long-term legacy.
          </motion.p>



          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-12 sm:gap-20 mt-16 pt-10 border-t border-stone-200 dark:border-stone-800"
          >
            {[
              { n: 22, s: '+', l: 'Years of Trust' },
              { n: 5000, s: '+', l: 'Families Protected' },
              { n: 150, s: 'Cr+', l: 'AUM Managed' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white tabular-nums">
                  {s.n}{s.s}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-500 mt-1 font-medium tracking-wide">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHO WE ARE
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Left col */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <SectionTag>Who We Are</SectionTag>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-stone-900 dark:text-white mb-8">
              The Foundation of Our Legacy
            </h2>
            <div className="space-y-5 text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>
                At <strong className="text-stone-900 dark:text-white font-semibold">SK Smart Investments</strong>, we believe financial security begins with informed decisions and trusted guidance.
              </p>
              <p>
                Our mission is to simplify the insurance journey by offering expert advice, transparent recommendations, and access to a wide range of insurance products from India's leading companies.
              </p>
              <p>
                Whether you're planning for your family's future, protecting your health, securing your business, or building long-term wealth, we provide solutions tailored to your unique financial goals.
              </p>
            </div>
          </motion.div>

          {/* Right col — two stacked cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-7 hover:shadow-md dark:hover:shadow-none transition-shadow duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-brand-accent mb-5">
                <FaUsers className="text-lg" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Tailored</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">Every customer has different priorities and aspirations.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex-1 bg-brand-accent rounded-2xl p-7 hover:shadow-lg transition-shadow duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-stone-900 mb-5">
                <FaShieldAlt className="text-lg" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Assurance</h4>
              <p className="text-sm text-stone-800/80 leading-relaxed font-medium">The right balance of protection, affordability, and long-term value.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VISION & MISSION
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white dark:bg-[#111] border-y border-stone-200 dark:border-stone-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-20">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
          >
            <div className="lg:w-1/3 shrink-0">
              <SectionTag>Our Vision</SectionTag>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
                Where We're Headed
              </h2>
            </div>
            <div className="lg:w-2/3 lg:border-l border-stone-200 dark:border-stone-800 lg:pl-12">
              <p className="text-xl sm:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed font-light italic">
                "To become one of India's most trusted insurance and financial advisory firms by delivering innovative protection solutions, exceptional customer service, and lifelong financial security for every client."
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-full h-px bg-stone-200 dark:bg-stone-800/50" />

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-10">
              <SectionTag>Our Mission</SectionTag>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
                What Drives Us
              </h2>
            </div>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
              {missions.map((m, i) => (
                <div
                  key={i}
                  className="group bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-xl p-6 hover:border-brand-accent/50 transition-colors duration-300 flex flex-col"
                >
                  <span className="text-3xl font-black text-brand-accent/20 dark:text-brand-accent/10 tabular-nums mb-3 group-hover:text-brand-accent/40 transition-colors">0{i + 1}</span>
                  <h4 className="text-base font-bold text-stone-900 dark:text-white leading-tight mb-3">{m.title}</h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed flex-1">{m.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW WE WORK
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center">
          <SectionTag>How We Work</SectionTag>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight">
            Our Guiding Principles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-400"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 text-xl shrink-0 group-hover:bg-brand-accent group-hover:text-stone-900 transition-colors duration-400">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{p.title}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-stone-100 dark:bg-[#111] border-y border-stone-200 dark:border-stone-800/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 md:mb-20 flex flex-col items-center">
            <SectionTag>Our Journey</SectionTag>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white leading-tight">
              Milestones That Matter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative bg-white dark:bg-stone-900/60 p-8 lg:p-10 rounded-[2rem] border border-stone-200 dark:border-stone-800 hover:border-brand-accent/50 transition-all duration-300 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Huge Faded Year Background */}
                <div className="absolute -bottom-4 -right-4 text-[110px] font-black text-stone-100 dark:text-stone-800/30 group-hover:text-brand-accent/5 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                  {m.year}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`inline-flex items-center justify-center px-5 py-2 rounded-full bg-brand-accent/10 text-brand-accent font-black text-lg tracking-wider mb-6 self-start transition-all duration-300 ${m.colorClass || ''}`}>
                    {m.year}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">{m.title}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed flex-1">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AWARDS
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>Industry Recognition</SectionTag>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white mb-5 leading-tight">
            Awards & Achievements
          </h2>
          <p className="text-base text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Every recognition represents our unwavering commitment to delivering trusted financial guidance, exceptional client service, and consistent excellence.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-5">
          {awards.map((aw, idx) => (
            <AwardCard key={idx} aw={aw} onClick={setSelectedAwardIndex} index={idx} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LEADERSHIP
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white dark:bg-[#111] border-y border-stone-200 dark:border-stone-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionTag>Our Leadership</SectionTag>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white mb-5 leading-tight">
              Visionary Leadership
            </h2>
            <p className="text-base text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Meet the visionaries who guide SK Smart Investments with unwavering integrity and a commitment to securing your financial future.
            </p>
          </div>

          <div className="space-y-20 lg:space-y-28">
            {peopleData.map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center"
              >
                {/* Photo */}
                <div className="order-1 w-[85%] max-w-[320px] sm:max-w-none sm:w-2/5 lg:w-1/3 shrink-0 mx-auto lg:mx-0">
                  <div className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-900 group border border-stone-200/50 dark:border-white/10">
                    <img
                      src={person.src}
                      alt={person.name}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="order-2 w-full lg:w-7/12 flex flex-col mt-4 lg:mt-0">
                  <div className="mb-6 lg:mb-8 text-left">
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mb-2">{person.name}</h4>
                    <p className="text-sm font-bold text-brand-accent uppercase tracking-widest">{person.designation}</p>
                  </div>
                  
                  <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed italic mb-8 text-left">
                    "{person.quote}"
                  </p>
                  <div className="w-12 h-1 bg-brand-accent mb-8 rounded-full" />

                  {person.highlights && (
                    <div className="space-y-4">
                      {person.highlights.map((h, hi) => (
                        <div key={hi} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-brand-accent shrink-0" />
                          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {person.stats && (
                    <div className="flex gap-10">
                      {person.stats.map((st, si) => (
                        <div key={si}>
                          <div className="text-3xl font-bold text-stone-900 dark:text-white tabular-nums">
                            <Counter from={0} to={st.num} suffix={st.suffix} />
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium tracking-wide mt-1">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SOCIALS & CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        {/* Socials */}
        <div>
          <div className="text-center mb-10">
            <SectionTag>Connect With Us</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">Join Our Network</h2>
            <p className="text-base text-stone-500 dark:text-stone-400 mt-3 max-w-xl mx-auto">
              Stay updated with our latest insights, company news, and financial strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Instagram */}
            <Hover3DCard href="https://www.instagram.com/sk_smartinvestments/" className="w-full rounded-xl">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl group-hover:border-pink-400/50 dark:group-hover:border-pink-500/30 transition-colors duration-400 h-full">
                <div className="w-11 h-11 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 group-hover:bg-gradient-to-br group-hover:from-[#833ab4] group-hover:via-[#fd1d1d] group-hover:to-[#fcb045] group-hover:text-white transition-all duration-500 text-xl shrink-0">
                  <FaInstagram />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">Instagram</h3>
                  <p className="text-xs text-stone-400">@sk_smartinvestments</p>
                </div>
                <FaArrowRight className="ml-auto text-stone-300 dark:text-stone-600 group-hover:text-pink-500 transition-colors text-sm" />
              </div>
            </Hover3DCard>

            {/* LinkedIn */}
            <Hover3DCard href="https://www.linkedin.com/company/sksmartinvestments/" className="w-full rounded-xl">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl group-hover:border-[#0077b5]/40 dark:group-hover:border-[#0077b5]/30 transition-colors duration-400 h-full">
                <div className="w-11 h-11 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 group-hover:bg-[#0077b5] group-hover:text-white transition-all duration-500 text-xl shrink-0">
                  <FaLinkedin />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">LinkedIn</h3>
                  <p className="text-xs text-stone-400">SK Smart Investments</p>
                </div>
                <FaArrowRight className="ml-auto text-stone-300 dark:text-stone-600 group-hover:text-[#0077b5] transition-colors text-sm" />
              </div>
            </Hover3DCard>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden bg-stone-900 dark:bg-stone-900 p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-accent/5 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block text-xs font-semibold text-brand-accent tracking-widest uppercase mb-4">The Next Step</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Ready to Secure Your Future?
            </h2>
            <p className="text-base text-stone-400 max-w-lg mx-auto mb-8">
              Let's build your financial journey together with absolute transparency and unwavering trust.
            </p>
            <button className="inline-flex items-center gap-3 bg-brand-accent text-stone-900 font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300">
              Book Consultation
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIGHTBOX
      ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedAwardIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 cursor-zoom-out"
            onClick={() => setSelectedAwardIndex(null)}
          >
            {/* Nav arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedAwardIndex(p => Math.max(p - 1, 0)); }}
              disabled={selectedAwardIndex === 0}
              className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-black disabled:opacity-0 transition-all z-[110]"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedAwardIndex(p => Math.min(p + 1, awards.length - 1)); }}
              disabled={selectedAwardIndex === awards.length - 1}
              className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-black disabled:opacity-0 transition-all z-[110]"
            >
              <FaArrowRight />
            </button>

            <motion.div
              key={selectedAwardIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-700/50 flex flex-col md:flex-row cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedAwardIndex(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-brand-accent hover:text-black transition-all z-50"
              >
                <FaTimes />
              </button>

              <div className="w-full md:w-1/2 bg-black/30 flex items-center justify-center p-8 min-h-[40vh]">
                <img
                  src={awards[selectedAwardIndex].img}
                  className="w-full h-full object-contain max-h-[60vh]"
                  alt={awards[selectedAwardIndex].title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <FaAward className="text-brand-accent text-sm" />
                  <span className="text-xs text-brand-accent uppercase tracking-widest font-semibold">{awards[selectedAwardIndex].tag}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">{awards[selectedAwardIndex].title}</h3>
                <div className="w-10 h-0.5 bg-brand-accent mb-4" />
                <p className="text-sm text-stone-400 leading-relaxed mb-8">{awards[selectedAwardIndex].desc}</p>
                <div className="mt-auto flex items-center gap-3 text-stone-500 text-xs font-medium tracking-widest">
                  <span className="text-white">{String(selectedAwardIndex + 1).padStart(2, '0')}</span>
                  <span className="w-8 h-px bg-stone-700" />
                  <span>{String(awards.length).padStart(2, '0')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default About;
