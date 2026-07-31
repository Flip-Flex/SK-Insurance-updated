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
const TiltCard = ({ aw, onClick, index = 0 }) => {
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group cursor-zoom-in relative bg-neutral-900/40 rounded-[32px] border border-white/5 p-4 hover:border-brand-accent/40 hover:bg-neutral-900/80 transition-all duration-500 flex flex-col h-[480px] shadow-2xl"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px] pointer-events-none"
        style={{ transform: "translateZ(10px)" }}
      />
      
      {/* Image Container */}
      <div 
        className="relative w-full h-[240px] shrink-0 rounded-[24px] overflow-hidden bg-black border border-white/10 group-hover:border-white/20 transition-colors duration-500"
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
        
        {/* Zoom Icon Badge */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/10">
          <FaSearchPlus className="text-white text-lg" />
        </div>
      </div>

      {/* Content Container */}
      <div 
        className="flex-1 flex flex-col pt-6 relative"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FaAward className="text-brand-accent text-sm" />
          <span className="text-[10px] text-brand-accent uppercase tracking-[0.2em] font-extrabold">{aw.tag}</span>
        </div>
        
        <h3 className="text-xl font-[900] text-white leading-tight mb-3 group-hover:text-brand-accent transition-colors duration-300 line-clamp-2">
          {aw.title}
        </h3>
        
        <p className="text-sm text-neutral-400 font-medium line-clamp-3">
          {aw.desc}
        </p>
      </div>

      {/* Decorative gradient line at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent group-hover:w-1/2 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100" />
    </motion.div>
  );
};

// Horizontal Scroll Container
const HorizontalPrinciples = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start start", "end end"]
  });
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
    <div className="w-full bg-black min-h-screen text-white overflow-clip pb-24">
      
      {/* Chapter 1: Cinematic Hero Section */}
      <section className="relative w-full min-h-[90vh] pt-32 lg:pt-40 flex flex-col items-center justify-center text-center overflow-hidden">
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
          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4 w-full">
            
            <div className="flex flex-col items-center space-y-4">
              <SplitText text="Securing Wealth." className="text-4xl sm:text-6xl lg:text-7xl font-[900] tracking-tight text-white leading-[1.1] pb-4 lg:pb-6" delay={0} duration={1} />
              <SplitText text="Empowering Futures." className="text-4xl sm:text-6xl lg:text-7xl font-[900] tracking-tight text-brand-accent leading-[1.1] pb-4 lg:pb-6" delay={200} duration={1} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 mt-24">
              <div className="flex flex-col items-center">
                <SplitText text="22" className="text-6xl sm:text-7xl lg:text-8xl font-[900] text-white" delay={400} duration={0.8} />
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase mt-4">Years of Trust</span>
              </div>
              <div className="hidden sm:block w-[1px] h-12 bg-white/20"></div>
              <div className="flex flex-col items-center">
                <SplitText text="5000+" className="text-6xl sm:text-7xl lg:text-8xl font-[900] text-white" delay={500} duration={0.8} />
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase mt-4">Families Protected</span>
              </div>
            </div>
          </div>


      </section>

      {/* Chapter 2: Who We Are - Cinematic Storytelling Redesign */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Typography & Story */}
          <div className="w-full lg:w-1/2 space-y-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <h2 className="text-sm text-brand-accent uppercase tracking-[0.3em] font-extrabold mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-brand-accent"></span>
                Who We Are
              </h2>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-white leading-[1.1] tracking-tight">
                The Foundation of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Our Legacy.</span>
              </h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="space-y-6 text-lg text-neutral-400 font-medium leading-relaxed relative">
              <div className="absolute -left-6 sm:-left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-accent/50 to-transparent"></div>
              <p>
                At <strong className="text-white">SK Smart Investments</strong>, we believe financial security begins with informed decisions and trusted guidance.
              </p>
              <p>
                Our mission is to simplify the insurance journey by offering expert advice, transparent recommendations, and access to a wide range of insurance products from India's leading companies.
              </p>
              <p>
                Whether you're planning for your family's future, protecting your health, securing your business, or building long-term wealth, we provide solutions tailored to your unique financial goals.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Elegant Layered Glass Cards */}
          <div className="w-full lg:w-1/2 relative h-[500px] sm:h-[600px] flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] bg-brand-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            {/* Card 1: Experience */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -5, x: 20 }} whileInView={{ opacity: 1, y: 0, rotate: -5, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }}
              className="absolute top-4 sm:top-10 right-4 sm:right-12 w-64 sm:w-72 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 hover:z-30 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-default group"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-brand-accent mb-6 border border-white/5 group-hover:bg-brand-accent group-hover:text-black transition-colors">
                <FaUsers className="text-xl" />
              </div>
              <h4 className="text-xl sm:text-2xl font-[900] text-white uppercase tracking-widest mb-2">Tailored</h4>
              <p className="text-xs sm:text-sm text-neutral-400">Every customer has different priorities and aspirations.</p>
            </motion.div>

            {/* Card 2: Trust */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: 5, x: -20 }} whileInView={{ opacity: 1, y: 0, rotate: 5, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }}
              className="absolute bottom-4 sm:bottom-10 left-4 sm:left-12 w-64 sm:w-72 bg-brand-accent backdrop-blur-xl border border-brand-accent/50 rounded-[32px] p-6 sm:p-8 shadow-[0_0_40px_rgba(246,255,0,0.2)] z-20 hover:z-30 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-default"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-brand-accent mb-6 shadow-inner">
                <FaShieldAlt className="text-xl" />
              </div>
              <h4 className="text-xl sm:text-2xl font-[900] text-black uppercase tracking-widest mb-2">Assurance</h4>
              <p className="text-xs sm:text-sm text-black/80 font-bold">The right balance of protection, affordability, and long-term value.</p>
            </motion.div>

            {/* Floating Visual Accent Rings */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full hidden sm:block pointer-events-none"
            ></motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-brand-accent/20 border-dashed rounded-full hidden sm:block pointer-events-none"
            ></motion.div>

          </div>
        </div>
      </section>

      {/* Chapter 3: Our Impact (Statistics) */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
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
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="space-y-12 lg:space-y-16">
          
          {/* Vision Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="relative w-full rounded-3xl lg:rounded-[48px] bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-12 lg:p-20 overflow-hidden group shadow-[0_30px_100px_-20px_rgba(0,0,0,1)]"
          >
            {/* Hover Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/15 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              <div className="w-full lg:w-1/3 text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="w-20 h-20 rounded-full border border-brand-accent/30 flex items-center justify-center mb-6 bg-brand-accent/5 shadow-[0_0_30px_rgba(246,255,0,0.1)]">
                  <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">👁️‍🗨️</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-white uppercase tracking-tight leading-none">
                  Our <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Vision</span>
                </h2>
              </div>
              
              <div className="w-full lg:w-2/3 lg:border-l border-white/10 lg:pl-16 relative">
                <div className="absolute -left-6 lg:-left-[66px] top-0 text-[120px] text-brand-accent/10 font-serif leading-none hidden lg:block">"</div>
                <p className="text-xl sm:text-2xl lg:text-3xl text-neutral-200 leading-relaxed font-light italic relative z-10 text-center lg:text-left">
                  To become one of India's most trusted insurance and financial advisory firms by delivering innovative protection solutions, exceptional customer service, and lifelong financial security for every client.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full rounded-3xl lg:rounded-[48px] bg-neutral-950/80 backdrop-blur-xl border border-white/5 p-6 sm:p-12 lg:p-20 group shadow-[0_30px_100px_-20px_rgba(0,0,0,1)]"
          >
            {/* Hover Glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              <div className="w-full lg:w-1/3 text-center lg:text-left pt-2 flex flex-col items-center lg:items-start lg:sticky lg:top-32">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/5">
                  <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">🎯</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-white uppercase tracking-tight leading-none">
                  Our <br />
                  <span className="text-white/30">Mission</span>
                </h2>
              </div>
              
              <div className="w-full lg:w-2/3 flex flex-col gap-4 sm:gap-6 relative">
                {[
                  { title: 'Personalized Solutions', text: 'Deliver tailored insurance and financial solutions to individual needs.' },
                  { title: 'Premium Products', text: 'Offer products from leading insurance companies with competitive pricing.' },
                  { title: 'Expert Guidance', text: 'Simplify insurance through honest advice and professional guidance.' },
                  { title: 'Seamless Support', text: 'Ensure quick policy issuance and seamless renewal support.' },
                  { title: 'Claims Advocacy', text: 'Provide dedicated claims assistance until successful settlement.' }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="sticky bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:bg-neutral-800 hover:border-brand-accent/30 transition-all duration-300 group/card shadow-xl"
                    style={{ 
                      top: `calc(100px + ${i * 20}px)`, 
                      zIndex: i 
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center font-black text-sm group-hover/card:bg-brand-accent group-hover/card:text-black transition-colors">
                        0{i + 1}
                      </div>
                      <h4 className="text-white font-[900] uppercase tracking-wider text-sm">{item.title}</h4>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Chapter 5: How We Work (Horizontal Sticky Scroll) */}
      <HorizontalPrinciples />

      {/* Chapter 6: Our Journey (Timeline) */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px] mb-16 lg:mb-24">Our Journey</h2>
        
        <div className="relative">
          {/* Horizontal Line - Desktop */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 origin-left"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          />
          
          {/* Vertical Line - Mobile/Tablet */}
          <motion.div 
            className="lg:hidden absolute top-0 left-[18px] sm:left-[34px] w-1 h-full bg-white/10 origin-top"
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          />

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center relative z-10 w-full lg:pb-16 lg:pt-16 gap-12 lg:gap-8 px-2 sm:px-6 lg:px-4">
            {[
              { year: '2004', title: 'Independent Advisory', desc: 'Managing Director Prakash Gajendiran starts independent financial planning services in Kanchipuram.' },
              { year: '2012', title: 'Portfolio Expansion', desc: 'Secures primary partnership certifications with India’s leading life insurers (LIC, Tata AIA).' },
              { year: '2018', title: 'AUM Milestones', desc: 'Protects over 2,500 local families and manages significant long-term portfolios.' },
              { year: '2025', title: 'MD Plaza Headquarters', desc: 'Establishes state-of-the-art office at #104, West Raja Street, launching digital portals.' }
            ].map((mile, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.2 }}
                className="flex flex-row lg:flex-col items-start lg:items-center lg:text-center w-full lg:min-w-[280px] gap-6 lg:gap-0"
              >
                {/* Mobile/Tablet: Timeline Dot */}
                <div className="lg:hidden flex flex-col items-center pt-1 z-20">
                  <div className="w-6 h-6 rounded-full bg-black border-4 border-brand-accent shadow-[0_0_20px_rgba(246,255,0,0.6)] flex-shrink-0" />
                </div>

                <div className={`flex-1 lg:flex-none lg:mb-8 ${i % 2 !== 0 ? 'lg:order-last lg:mt-8 lg:mb-0' : ''}`}>
                  {/* Mobile/Tablet: Year */}
                  <div className="lg:hidden text-brand-accent font-[900] text-3xl tracking-widest mb-2 opacity-80">
                    {mile.year}
                  </div>
                  <h3 className="text-xl lg:text-lg font-bold text-white uppercase mb-2">{mile.title}</h3>
                  <p className="text-base lg:text-sm text-neutral-400">{mile.desc}</p>
                </div>
                
                {/* Desktop: Dot and Year */}
                <div className="hidden lg:flex w-6 h-6 rounded-full bg-black border-4 border-brand-accent shadow-[0_0_20px_rgba(246,255,0,0.6)] flex-shrink-0 relative z-20 my-4 group cursor-default hover:scale-150 transition-transform duration-500">
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
          <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px]">Industry Recognition</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((aw, idx) => (
            <TiltCard key={idx} aw={aw} onClick={() => setSelectedAward(aw)} index={idx} />
          ))}
        </div>
      </section>

      {/* Chapter 8: Leadership (The People) */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
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
        {/* Socials - Unified Interactive Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative w-full rounded-[48px] bg-neutral-900/40 border border-white/5 p-8 sm:p-16 overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Animated Noise/Texture Background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-[-1px] mb-4">Join Our Network</h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto font-medium">Stay updated with our latest insights, company news, and financial strategies on your favorite platforms.</p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-4xl relative z-10">
            {/* Instagram */}
            <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="group flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-[32px]" />
              <div className="relative h-full flex flex-col items-center justify-center text-center bg-black border border-white/10 p-10 rounded-[32px] hover:border-pink-500/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-20 h-20 rounded-[24px] bg-neutral-900 flex items-center justify-center text-4xl text-neutral-500 group-hover:text-white group-hover:bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] transition-all duration-500 shadow-xl mb-6 transform group-hover:scale-110 group-hover:rotate-12">
                  <FaInstagram />
                </div>
                
                <h3 className="text-2xl font-[900] uppercase tracking-wider text-white mb-2">Instagram</h3>
                <p className="text-xs font-bold text-neutral-500 tracking-widest group-hover:text-pink-400 transition-colors uppercase">@sk_smartinvestments</p>
                
                <div className="mt-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-pink-500 group-hover:border-pink-500 group-hover:-rotate-45 transition-all duration-300">
                  <FaArrowRight />
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/sksmartinvestments/" target="_blank" rel="noopener noreferrer" className="group flex-1 relative">
              <div className="absolute inset-0 bg-[#0077b5] blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-[32px]" />
              <div className="relative h-full flex flex-col items-center justify-center text-center bg-black border border-white/10 p-10 rounded-[32px] hover:border-[#0077b5]/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#0077b5] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-20 h-20 rounded-[24px] bg-neutral-900 flex items-center justify-center text-4xl text-neutral-500 group-hover:text-white group-hover:bg-[#0077b5] transition-all duration-500 shadow-xl mb-6 transform group-hover:scale-110 group-hover:-rotate-12">
                  <FaLinkedin />
                </div>
                
                <h3 className="text-2xl font-[900] uppercase tracking-wider text-white mb-2">LinkedIn</h3>
                <p className="text-xs font-bold text-neutral-500 tracking-widest group-hover:text-blue-400 transition-colors uppercase">SK Smart Investments</p>
                
                <div className="mt-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-[#0077b5] group-hover:border-[#0077b5] group-hover:-rotate-45 transition-all duration-300">
                  <FaArrowRight />
                </div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Footer CTA - Total Redesign */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative w-full rounded-[48px] bg-black border border-white/10 overflow-hidden group"
        >
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl pointer-events-none">
            <motion.div 
              className="absolute inset-0 bg-brand-accent/20 blur-[120px] rounded-[100%]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Grain Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />

          {/* Top Border Highlight */}
          <div className="absolute top-0 left-[10%] w-[80%] h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-12 sm:p-20 gap-16 lg:gap-12">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="text-[10px] text-brand-accent uppercase tracking-[0.3em] border border-brand-accent/20 bg-brand-accent/5 px-4 py-2 rounded-full mb-8 inline-block backdrop-blur-md font-extrabold shadow-[0_0_20px_rgba(246,255,0,0.1)]">
                The Next Step
              </span>
              <h2 className="text-5xl sm:text-7xl font-[900] text-white uppercase tracking-[-2px] mb-6 leading-[1.1]">
                Ready to Secure <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">
                  Your Future?
                </span>
              </h2>
              <p className="text-xl text-neutral-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Let's build your financial journey together with absolute transparency and unwavering trust.
              </p>
            </div>

            {/* Right Content - Massive Button Pill */}
            <div className="shrink-0 flex items-center justify-center">
              <button className="relative overflow-hidden rounded-[40px] bg-brand-accent text-black font-[900] uppercase tracking-[0.2em] p-2 pr-10 flex items-center gap-6 group/btn hover:scale-105 transition-all duration-500 shadow-[0_0_50px_rgba(246,255,0,0.15)] hover:shadow-[0_0_80px_rgba(246,255,0,0.3)] border border-brand-accent/50">
                
                {/* Sweep effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out skew-x-12" />
                
                <div className="relative z-10 w-20 h-20 rounded-[32px] bg-black flex items-center justify-center text-brand-accent text-3xl group-hover/btn:rotate-45 transition-transform duration-500 shadow-inner border border-white/10">
                  <FaArrowRight />
                </div>
                
                <span className="relative z-10 text-sm sm:text-base mt-0.5 whitespace-nowrap">
                  Book Consultation
                </span>
              </button>
            </div>

          </div>
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
