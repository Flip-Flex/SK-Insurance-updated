import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { FaAward, FaCalendarAlt, FaShieldAlt, FaUsers, FaChartLine, FaTimes, FaSearchPlus, FaLinkedin, FaInstagram, FaQuoteLeft, FaArrowRight, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';
import SplitText from '../../components/common/SplitText';
import { useTranslation } from '../../context/LanguageContext';

// Utility for animating numbers
const Counter = ({ from, to, suffix = "", duration = 2 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;

      const animate = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        const current = Math.floor(from + (to - from) * progress);
        
        if (nodeRef.current) {
          nodeRef.current.textContent = current + suffix;
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          if (nodeRef.current) nodeRef.current.textContent = to + suffix;
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, suffix, duration]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
};

// 3D Tilt Card Component for Awards
const TiltCard = ({ aw, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className="group cursor-zoom-in relative bg-neutral-900/40 rounded-[32px] border border-white/5 p-4 hover:border-brand-accent/30 transition-colors duration-500 flex flex-col h-[400px]"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] pointer-events-none"
        style={{ transform: "translateZ(10px)" }}
      />
      
      <div 
        className="relative w-full h-full rounded-[24px] overflow-hidden bg-black border border-white/5 shadow-2xl"
        style={{ transform: "translateZ(30px)" }}
      >
        <img
          src={aw.img}
          alt={aw.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        
        {/* Light Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none skew-x-12" />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
          <FaSearchPlus className="text-3xl text-white mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{aw.title}</h3>
          <p className="text-xs text-brand-accent mt-2 font-extrabold tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{aw.tag}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Horizontal Scroll Container
const HorizontalPrinciples = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); // 4 cards = 400vw width

  const principles = [
    { title: 'Absolute Transparency', desc: 'Zero hidden clauses, clear deductible guides, and upfront premium definitions for total peace of mind.', icon: FaShieldAlt },
    { title: 'Actuarial Precision', desc: 'Goal-based wealth planners and SIP calculators designed using real-time market data indexes.', icon: FaChartLine },
    { title: 'Community Advocacy', desc: 'Providing Kanchipuram and wider Tamil Nadu with local, accessible, and personalized financial coaching.', icon: FaUsers },
    { title: 'Dedicated Claims Desk', desc: 'Pre-sales advice and full post-sales filing support to ensure maximum claim clearance rates.', icon: FaAward }
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-24">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto w-full mb-12">
          <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full">Chapter IV</span>
          <h2 className="text-4xl sm:text-5xl font-[900] text-white mt-4 uppercase">How We Work</h2>
        </div>
        
        <motion.div style={{ x }} className="flex w-[400vw]">
          {principles.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="w-[100vw] flex items-center justify-center px-4 sm:px-8">
                <div className="w-full max-w-4xl bg-neutral-900/40 border border-white/5 rounded-[40px] p-12 sm:p-20 relative overflow-hidden group hover:border-brand-accent/30 transition-colors duration-500">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
                    <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center text-4xl text-white group-hover:text-black group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-500 shadow-2xl shrink-0">
                      <Icon />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl sm:text-4xl font-[900] text-white uppercase">{val.title}</h3>
                      <p className="text-lg text-neutral-400 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-12 left-0 w-full px-4 sm:px-8 max-w-7xl mx-auto right-0">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-accent"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const About = () => {
  const [selectedAward, setSelectedAward] = useState(null);
  const { t } = useTranslation();

  const [awards, setAwards] = useState([
    { title: 'Excellence in Financial Planning', tag: 'CERTIFIED EXCELLENCE', desc: 'Recognized for outstanding client portfolio management.', img: '/IMG-20260714-WA0061.jpg' },
    { title: 'Best Insurance Distributor', tag: 'TOP DISTRIBUTOR', desc: 'Commended for seamless claim settlement support.', img: '/IMG-20260714-WA0062.jpg' },
    { title: 'Trusted Mutual Fund Advisory', tag: 'GOAL-BASED GROWTH', desc: 'Honored for delivering goal-based growth.', img: '/IMG-20260714-WA0063.jpg' },
    { title: 'Financial Literacy Contributor', tag: 'COMMUNITY ADVOCATE', desc: 'Public education campaigns on investment strategies.', img: '/IMG-20260714-WA0064.jpg' }
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('gallery', (data) => {
      if (data && data.length > 0) setAwards(data);
    });
    return () => unsubscribe();
  }, []);

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    xStart: (i * 17) % 100,
    yStart: (i * 23) % 100,
    duration: 15 + (i % 10),
    delay: i * 0.5
  }));

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full bg-black min-h-screen text-white overflow-hidden pb-24">
      
      {/* Chapter 1: Cinematic Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Moving Gradient Background */}
        <motion.div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at center, rgba(246,255,0,0.15) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 80% 20%, rgba(82,39,255,0.15) 0%, rgba(0,0,0,0) 50%)',
            backgroundSize: '200% 200%'
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 bg-brand-accent/40 rounded-full blur-[1px]"
              style={{ left: `${p.xStart}%`, top: `${p.yStart}%` }}
              animate={{ y: [0, -300], x: [0, (p.id % 2 === 0 ? 50 : -50)], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.4em] text-brand-accent border border-brand-accent/30 px-4 py-1.5 rounded-full bg-brand-accent/5 backdrop-blur-sm"
          >
            About SK Smart Investments
          </motion.div>

          <div className="flex flex-col items-center space-y-2">
            <SplitText text="Securing Wealth." className="text-5xl sm:text-7xl lg:text-[6rem] font-[900] tracking-[-2px] text-white leading-[1.1] uppercase" delay={0} duration={0.6} />
            <SplitText text="Empowering Futures." className="text-5xl sm:text-7xl lg:text-[6rem] font-[900] tracking-[-2px] text-brand-accent leading-[1.1] uppercase" delay={150} duration={0.6} />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-12 bg-neutral-900/50 backdrop-blur-md border border-white/5 py-4 px-8 rounded-full shadow-2xl">
            <SplitText text="22 Years of Trust." className="text-sm sm:text-base text-neutral-300 font-extrabold uppercase tracking-widest" delay={300} duration={0.6} />
            <span className="hidden sm:block text-brand-accent opacity-50">•</span>
            <SplitText text="5000+ Families Protected." className="text-sm sm:text-base text-neutral-300 font-extrabold uppercase tracking-widest" delay={450} duration={0.6} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-3 text-neutral-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Scroll to discover our story</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-brand-accent bg-neutral-950/50 backdrop-blur-md"
          >
            <FaArrowRight className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Chapter 2: Who We Are */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* Left - Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-4">
              <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full">Chapter I</span>
              <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px]">Who We Are</h2>
              <p className="text-neutral-400 font-medium">The foundation of our legacy.</p>
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="lg:w-2/3 space-y-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="space-y-8 text-lg text-neutral-300 font-normal leading-relaxed"
            >
              <p className="text-white font-medium text-2xl sm:text-3xl border-l-4 border-brand-accent pl-6 leading-tight">
                At SK Smart Investments, we believe financial security begins with informed decisions and trusted guidance.
              </p>
              <p>
                Our mission is to simplify the insurance journey by offering expert advice, transparent recommendations, and access to a wide range of insurance products from India's leading companies. Whether you're planning for your family's future, protecting your health, securing your business, or building long-term wealth, we provide solutions tailored to your unique financial goals.
              </p>
              <p>
                We understand that every customer has different priorities and aspirations. That's why our experienced advisors carefully assess your needs before recommending insurance and investment plans that offer the right balance of protection, affordability, and long-term value.
              </p>
            </motion.div>

            {/* Parallax Image Block */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="relative h-[400px] sm:h-[500px] w-full rounded-[40px] overflow-hidden group border border-white/5"
            >
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                <FaHome className="text-6xl text-neutral-800" />
                <span className="absolute mt-24 text-neutral-600 text-xs tracking-widest uppercase font-bold">HQ Office View</span>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(246,255,0,0.15)_0%,rgba(0,0,0,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                <FaMapMarkerAlt className="text-brand-accent" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Kanchipuram, TN</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Our Impact (Statistics) */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-12 inline-block">Chapter II : Impact</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { num: 22, suffix: '+', label: 'Years of Trust' },
            { num: 5000, suffix: '+', label: 'Families Protected' },
            { num: 150, suffix: 'Cr+', label: 'AUM Managed' },
            { num: 2025, suffix: '', label: 'HQ Inauguration' },
          ].map((stat, i) => (
            <div key={i} className="relative group pt-8">
              <motion.div 
                className="absolute top-0 left-0 h-px bg-white/20 origin-left w-full" 
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} 
              />
              <div className="absolute top-0 left-0 h-px bg-brand-accent w-0 group-hover:w-full transition-all duration-700 ease-out" />
              
              <h3 className="text-5xl sm:text-6xl font-[900] text-white mt-6 tabular-nums">
                <Counter from={0} to={stat.num} suffix={stat.suffix} />
              </h3>
              <p className="text-neutral-400 text-xs uppercase font-extrabold tracking-[0.2em] mt-4">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 4: What We Believe (Vision & Mission) */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5 mt-12">
        <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-12 inline-block">Chapter III : Core Beliefs</span>
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Vision Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="lg:w-1/2 relative bg-neutral-900/30 p-12 sm:p-16 rounded-[48px] border border-white/5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(246,255,0,0.05)_0%,rgba(0,0,0,0)_50%)]" />
            <div className="text-[250px] text-white/[0.03] absolute -top-16 -left-4 font-serif leading-none pointer-events-none">"</div>
            
            <h2 className="text-3xl font-[900] text-white mb-8 uppercase tracking-widest relative z-10 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-brand-accent text-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(246,255,0,0.5)]">👁️‍🗨️</span>
              Vision
            </h2>
            <p className="text-2xl sm:text-3xl text-neutral-200 leading-tight italic relative z-10 font-medium">
              To become one of India's most trusted insurance and financial advisory firms by delivering innovative protection solutions, exceptional customer service, and lifelong financial security for every client.
            </p>
          </motion.div>

          {/* Mission Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/2 p-4 sm:p-8 relative"
          >
            <h2 className="text-3xl font-[900] text-white mb-12 uppercase tracking-widest flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-brand-accent text-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(246,255,0,0.5)]">🎯</span>
              Mission
            </h2>
            
            <div className="space-y-10 relative border-l border-white/10 pl-10">
              <motion.div 
                className="absolute left-[-1px] top-0 w-[2px] bg-brand-accent origin-top" 
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} 
              />
              
              {[
                'Deliver personalized insurance and financial solutions tailored to individual needs.',
                'Offer products from leading insurance companies with competitive pricing.',
                'Simplify insurance through honest advice and professional guidance.',
                'Ensure quick policy issuance and seamless renewal support.',
                'Provide dedicated claims assistance until successful settlement.'
              ].map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                  className="relative"
                >
                  <div className="absolute -left-[45px] top-1.5 w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(246,255,0,0.8)]" />
                  <p className="text-lg text-neutral-300">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter 5: How We Work (Horizontal Sticky Scroll) */}
      <HorizontalPrinciples />

      {/* Chapter 6: Our Journey (Horizontal Timeline) */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">Chapter V</span>
        <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px] mb-24">Our Journey</h2>
        
        <div className="relative">
          {/* Horizontal Line */}
          <motion.div 
            className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 origin-left"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          />

          <div className="flex justify-between items-center relative z-10 w-full overflow-x-auto hide-scrollbar pb-16 pt-16 gap-8 px-4">
            {[
              { year: '2004', title: 'Independent Advisory', desc: 'Managing Director Prakash Gajendiran starts independent financial planning services in Kanchipuram.' },
              { year: '2012', title: 'Portfolio Expansion', desc: 'Secures primary partnership certifications with India’s leading life insurers (LIC, Tata AIA).' },
              { year: '2018', title: 'AUM Milestones', desc: 'Protects over 2,500 local families and manages significant long-term portfolios.' },
              { year: '2025', title: 'MD Plaza Headquarters', desc: 'Establishes state-of-the-art office at #104, West Raja Street, launching digital portals.' }
            ].map((mile, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.2 }}
                className="flex flex-col items-center text-center min-w-[280px] w-full"
              >
                <div className={`mb-8 ${i % 2 !== 0 ? 'order-last mt-8 mb-0' : ''}`}>
                  <h3 className="text-lg font-bold text-white uppercase mb-2">{mile.title}</h3>
                  <p className="text-sm text-neutral-400">{mile.desc}</p>
                </div>
                
                <div className="w-6 h-6 rounded-full bg-black border-4 border-brand-accent shadow-[0_0_20px_rgba(246,255,0,0.6)] flex-shrink-0 relative z-20 my-4 group cursor-default hover:scale-150 transition-transform duration-500">
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 opacity-20 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {mile.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 7: Awards Gallery */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">Chapter VI</span>
          <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px]">Industry Recognition</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((aw, idx) => (
            <TiltCard key={idx} aw={aw} onClick={() => setSelectedAward(aw)} />
          ))}
        </div>
      </section>

      {/* Chapter 8: Leadership (The People) */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
        <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">Chapter VII</span>
        <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px] mb-24">The People Behind</h2>

        <div className="flex flex-col gap-32">
          {/* Kumutha */}
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full md:w-2/5 relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
              <img src="/kumutha_krishnamoorthy.jpg" alt="Mrs. Kumutha Krishnamoorthy" className="relative z-10 w-full aspect-[3/4] object-cover object-[center_12%] rounded-[40px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-3/5 space-y-8">
              <div>
                <h3 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-tight">Mrs. Kumutha Krishnamoorthy</h3>
                <p className="text-sm font-extrabold text-brand-accent uppercase tracking-[0.3em] mt-2">CEO & Founder</p>
              </div>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Mrs. Kumutha Krishnamoorthy is the visionary CEO & Founder of SK Smart Investments, leading the organization with a strong commitment to integrity, innovation, and customer-first financial services.
              </p>
              <div className="border-l-2 border-white/10 pl-6 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-brand-accent" />
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Strategic Vision</h4>
                  <p className="text-sm text-neutral-400">Leads the company's long-term strategic goals and expansion.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-brand-accent" />
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">Operational Excellence</h4>
                  <p className="text-sm text-neutral-400">Oversees daily operations ensuring seamless client experiences.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Prakash */}
          <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full md:w-2/5 relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
              <img src="/prakash_gajendiran.jpg" alt="Mr. Prakash Gajendiran" className="relative z-10 w-full aspect-[3/4] object-cover object-top rounded-[40px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-3/5 space-y-8">
              <div>
                <h3 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-tight">Mr. Prakash Gajendiran</h3>
                <p className="text-sm font-extrabold text-brand-accent uppercase tracking-[0.3em] mt-2">Founder & MD</p>
              </div>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Certified Financial Consultant & Senior Business Associate Leader with over 22 years of experience, guiding countless clients in making informed financial decisions.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-neutral-900/50 p-6 rounded-[24px] border border-white/5">
                  <h4 className="text-4xl font-[900] text-white mb-2"><Counter from={0} to={22} suffix="+" /></h4>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Years Experience</p>
                </div>
                <div className="bg-neutral-900/50 p-6 rounded-[24px] border border-white/5">
                  <h4 className="text-4xl font-[900] text-white mb-2"><Counter from={0} to={3} suffix="x" /></h4>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Aura Achiever</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter 9: Socials & Footer CTA */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-24">
        {/* Socials */}
        <div>
          <span className="text-[10px] text-brand-accent uppercase tracking-widest border border-brand-accent/20 px-3 py-1 rounded-full mb-4 inline-block">Chapter VIII</span>
          <h2 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-[-1px] mb-12">Connect With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="block group">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 border border-white/5 rounded-[40px] p-10 flex items-center justify-between hover:border-pink-500/50 transition-all duration-500 backdrop-blur-md">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-black text-pink-500 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500 shadow-xl">
                    <FaInstagram />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">Instagram Feed</h3>
                    <p className="text-sm font-bold text-pink-400">@sk_smartinvestments</p>
                  </div>
                </div>
                <FaArrowRight className="text-2xl text-white/20 group-hover:text-pink-500 group-hover:-rotate-45 transition-all duration-300" />
              </motion.div>
            </a>
            
            <a href="https://www.linkedin.com/company/sksmartinvestments/" target="_blank" rel="noopener noreferrer" className="block group">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#0077b5]/10 to-transparent border border-white/5 rounded-[40px] p-10 flex items-center justify-between hover:border-blue-500/50 transition-all duration-500 backdrop-blur-md">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-black text-blue-500 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-xl">
                    <FaLinkedin />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">LinkedIn Corporate</h3>
                    <p className="text-sm font-bold text-blue-400">SK Smart Investments</p>
                  </div>
                </div>
                <FaArrowRight className="text-2xl text-white/20 group-hover:text-blue-500 group-hover:-rotate-45 transition-all duration-300" />
              </motion.div>
            </a>
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative w-full bg-brand-accent text-black rounded-[48px] p-12 sm:p-20 text-center overflow-hidden flex flex-col items-center shadow-[0_0_50px_rgba(246,255,0,0.2)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0)_60%)]" />
          <h2 className="text-4xl sm:text-6xl font-[900] uppercase tracking-[-1px] mb-6 relative z-10">Ready to Secure Your Future?</h2>
          <p className="text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-12 relative z-10">Let's build your financial journey together with absolute transparency and unwavering trust.</p>
          <button className="relative z-10 bg-black text-brand-accent font-extrabold uppercase tracking-widest px-10 py-5 rounded-full text-sm hover:bg-neutral-900 hover:scale-105 transition-all flex items-center gap-4 group shadow-2xl">
            Book a Free Consultation
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Lightbox Certificate Zoom Overlay */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 cursor-zoom-out" 
            onClick={() => setSelectedAward(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full bg-neutral-900 rounded-[32px] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] p-4 border border-brand-accent/30 relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                onClick={() => setSelectedAward(null)}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black border border-white/10 text-white hover:bg-brand-accent hover:text-black hover:border-brand-accent transition-all cursor-pointer z-10"
              >
                <FaTimes />
              </button>
              <img 
                src={selectedAward.img} 
                className="w-full h-auto max-h-[75vh] object-contain rounded-[24px]" 
                alt={selectedAward.title} 
              />
              <div className="px-4 pb-2 pt-4 text-center">
                <h3 className="text-xl font-[900] text-white uppercase tracking-wider">{selectedAward.title}</h3>
                <p className="text-xs text-brand-accent mt-2 tracking-[0.2em] uppercase font-bold">{selectedAward.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default About;
