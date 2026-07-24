import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { FaAward, FaCalendarAlt, FaShieldAlt, FaUsers, FaChartLine, FaRegClock, FaTimes, FaSearchPlus, FaHeartbeat, FaHome, FaLinkedin, FaInstagram, FaTrophy } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

export const About = () => {
  const [selectedAward, setSelectedAward] = useState(null);
  const [kumuthaExpanded, setKumuthaExpanded] = useState(false);
  const [prakashExpanded, setPrakashExpanded] = useState(false);
  const { t } = useTranslation();

  const stats = [
    { label: 'Financial Advisory Experience', value: '22+ Years', icon: FaAward },
    { label: 'Kanchipuram HQ Opened', value: '07-04-2025', icon: FaCalendarAlt },
    { label: 'Happy Families Covered', value: '5,000+', icon: FaUsers },
    { label: 'Assets Under Management', value: '150Cr+', icon: FaChartLine }
  ];

  const defaults = [
    { title: 'Excellence in Financial Planning', tag: 'CERTIFIED EXCELLENCE', desc: 'Recognized for outstanding client portfolio management and wealth creation advisory.', img: '/IMG-20260714-WA0061.jpg' },
    { title: 'Best Insurance Distributor', tag: 'TOP DISTRIBUTOR', desc: 'Commended for seamless claim settlement support and strategic insurance guidance.', img: '/IMG-20260714-WA0062.jpg' },
    { title: 'Trusted Mutual Fund Advisory', tag: 'GOAL-BASED GROWTH', desc: 'Honored for delivering goal-based growth and custom risk mitigation strategies.', img: '/IMG-20260714-WA0063.jpg' },
    { title: 'Financial Literacy Contributor', tag: 'COMMUNITY ADVOCATE', desc: 'Recognized for public education campaigns on investment strategies and retirement savings.', img: '/IMG-20260714-WA0064.jpg' }
  ];

  const [awards, setAwards] = useState(defaults);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('gallery', (data) => {
      if (data && data.length > 0) setAwards(data);
    });
    return () => unsubscribe();
  }, []);

  // Framer Motion staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 14
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          {t('about_firm')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white mt-2">
          {t('about_hero_title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {t('about_hero_subtitle')}
        </p>
      </div>

      {/* Main Info Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left text section */}
        <div className="space-y-6 text-left">
          <h2 className="text-2xl font-bold text-navy-950 dark:text-white border-l-4 border-gold-500 pl-3">
            About SK Smart Investments
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-gold-500 -mt-3">
            Your Trusted Partner in Insurance & Financial Planning
          </p>
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            <p>
              At SK Smart Investments, we believe financial security begins with informed decisions and trusted guidance. We are committed to helping individuals, families, and businesses protect their future through comprehensive insurance solutions and personalized financial planning.
            </p>
            <p>
              Our mission is to simplify the insurance journey by offering expert advice, transparent recommendations, and access to a wide range of insurance products from India's leading insurance companies. Whether you're planning for your family's future, protecting your health, securing your business, or building long-term wealth, we provide solutions tailored to your unique financial goals.
            </p>
            <p>
              We understand that every customer has different priorities and aspirations. That's why our experienced advisors carefully assess your needs before recommending insurance and investment plans that offer the right balance of protection, affordability, and long-term value.
            </p>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/50 dark:border-white/5 text-center flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <div className="p-3 bg-navy-50 dark:bg-navy-900 rounded-xl text-gold-500">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy-950 dark:text-white">{st.value}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mt-1">{st.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/50 dark:border-white/5 text-left">
        {/* Vision */}
        <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center text-xl shrink-0">
            👁️‍🗨️
          </div>
          <h3 className="text-lg font-bold text-navy-950 dark:text-white border-l-4 border-gold-500 pl-3">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            To become one of India's most trusted insurance and financial advisory firms by delivering innovative protection solutions, exceptional customer service, and lifelong financial security for every client.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center text-xl shrink-0">
            🎯
          </div>
          <h3 className="text-lg font-bold text-navy-950 dark:text-white border-l-4 border-gold-500 pl-3">Our Mission</h3>
          <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <li>Deliver personalized insurance and financial solutions tailored to individual needs.</li>
            <li>Offer products from leading insurance companies with competitive pricing.</li>
            <li>Simplify insurance through honest advice and professional guidance.</li>
            <li>Ensure quick policy issuance and seamless renewal support.</li>
            <li>Provide dedicated claims assistance until successful settlement.</li>
            <li>Build lifelong relationships through trust, transparency, and exceptional service.</li>
          </ul>
        </div>
      </div>


      {/* Our Promise Quote Section */}
      <div className="flex justify-center pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="p-6 sm:p-8 bg-gold-500/5 dark:bg-gold-500/10 border-l-4 border-gold-500 rounded-r-3xl space-y-3 max-w-4xl text-left shadow-sm">
          <p className="font-extrabold text-[10px] uppercase tracking-wider text-gold-500">Our Promise</p>
          <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            "At SK Smart Investments, we believe insurance is more than a financial product—it's a promise to protect what matters most. Our commitment is to provide dependable guidance, personalized solutions, and lifelong support that help our clients achieve financial confidence and peace of mind."
          </p>
          <p className="text-[10px] sm:text-xs font-extrabold text-navy-950 dark:text-white tracking-widest uppercase text-center pt-1">
            "Protect Today. Secure Tomorrow. Grow with Confidence."
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="space-y-8 text-center pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="space-y-2">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
            Our Foundation
          </span>
          <h2 className="text-2xl font-bold text-navy-950 dark:text-white">
            Our Core Principles
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Built on trust, actuarial discipline, and long-term client-first relationship planning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { title: 'Absolute Transparency', desc: 'Zero hidden clauses, clear deductible guides, and upfront premium definitions for total peace of mind.', icon: FaShieldAlt },
            { title: 'Actuarial Precision', desc: 'Goal-based wealth planners and SIP calculators designed using real-time market data indexes.', icon: FaChartLine },
            { title: 'Community Advocacy', desc: 'Providing Kanchipuram and wider Tamil Nadu with local, accessible, and personalized financial coaching.', icon: FaUsers },
            { title: 'Dedicated Claims Desk', desc: 'Pre-sales advice and full post-sales filing support to ensure maximum claim clearance rates.', icon: FaAward }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-3 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center text-lg">
                  <Icon />
                </div>
                <h3 className="text-xs font-extrabold text-navy-950 dark:text-white uppercase tracking-wider">{val.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Corporate Timeline Section */}
      <div className="space-y-8 text-center pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="space-y-2">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
            Our Journey
          </span>
          <h2 className="text-2xl font-bold text-navy-950 dark:text-white">
            Historical Milestones
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Two decades of protecting wealth and supporting families across generations.
          </p>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-4">
          {/* Central connection line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {[
              { year: '2004', title: 'Independent Advisory', desc: 'Managing Director Prakash Gajendiran starts independent financial planning services in Kanchipuram.' },
              { year: '2012', title: 'Portfolio Expansion', desc: 'Secures primary partnership certifications with India’s leading life insurers (LIC, Tata AIA).' },
              { year: '2018', title: 'AUM Milestones', desc: 'Protects over 2,500 local families and manages significant long-term portfolios.' },
              { year: '2025', title: 'MD Plaza Headquarters', desc: 'Establishes state-of-the-art office at #104, West Raja Street, launching digital portals.' }
            ].map((mile, idx) => (
              <div key={idx} className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 text-left space-y-2 hover:scale-[1.02] transition-transform duration-300">
                <div className="inline-block px-2.5 py-0.5 bg-gold-500 text-navy-950 text-[10px] font-extrabold rounded-full">
                  {mile.year}
                </div>
                <h3 className="text-xs font-bold text-navy-950 dark:text-white">{mile.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{mile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blended Award-Winning Service & Highlighted Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-transparent via-slate-100/70 dark:via-navy-900/50 to-transparent border-y border-slate-200/50 dark:border-white/5 relative text-center space-y-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gold-500 bg-gold-500/10 border border-gold-500/20 px-4 py-1.5 rounded-full">
            <FaTrophy className="text-gold-500 text-xs" />
            <span>OUR HONORS & RECOGNITIONS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            {t('award_winning_service')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            Honored by financial institutions and communities across Tamil Nadu. Click any certificate to zoom in full-screen.
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {awards.map((aw, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedAward(aw)}
              className="group cursor-zoom-in relative bg-white dark:bg-navy-900/90 rounded-3xl border border-slate-200/60 dark:border-white/10 p-4 hover:border-gold-500/50 dark:hover:border-gold-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(218,165,32,0.05)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full space-y-4"
            >
              {/* Image Frame with gold border accent */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-white/5 flex items-center justify-center p-1.5">
                <img
                  src={aw.img}
                  alt={aw.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fb = e.target.parentElement.querySelector('.fallback-icon-container');
                    if (fb) fb.style.display = 'flex';
                  }}
                />
                <div className="fallback-icon-container hidden absolute inset-0 w-full h-full flex-col items-center justify-center bg-slate-100 dark:bg-navy-950 text-slate-400 p-4 text-center">
                  <FaAward className="text-4xl text-gold-500/50 mb-2" />
                  <span className="text-xs font-semibold">{aw.title}</span>
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-gold-500 bg-navy-950/90 dark:bg-navy-900/95 backdrop-blur-md rounded-lg border border-gold-500/30">
                  {aw.tag || 'HONOR'}
                </div>

                {/* Hover Lens Overlay */}
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-white/95 dark:bg-navy-900/95 text-gold-500 font-extrabold text-[10px] flex items-center space-x-1.5 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <FaSearchPlus />
                    <span>View Certificate</span>
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-left space-y-1.5 px-1 pb-1">
                <h3 className="text-xs font-extrabold text-navy-950 dark:text-white uppercase tracking-wider group-hover:text-gold-500 transition-colors duration-200">
                  {aw.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">
                  {aw.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Executive Leadership Section */}
      <div className="space-y-8 text-center pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="space-y-2">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
            Our Leadership
          </span>
          <h2 className="text-2xl font-bold text-navy-950 dark:text-white">
            Executive Leadership
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Meet the leaders guiding our strategic investments and underwriting advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {/* Mrs. Kumutha Krishnamoorthy */}
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 flex flex-col items-center text-center space-y-4 transition-all duration-300 shadow-md">
            <div className="w-24 h-24 rounded-full border-2 border-gold-500 overflow-hidden shadow-lg shrink-0 bg-navy-900">
              <img 
                src="/kumutha_krishnamoorthy.jpg" 
                alt="Mrs. Kumutha Krishnamoorthy" 
                className="w-full h-full object-cover object-[center_12%]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-gold-500 text-3xl font-extrabold font-serif">KK</span>';
                }}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white">Mrs. Kumutha Krishnamoorthy</h3>
              <p className="text-xs text-gold-500 font-bold uppercase tracking-widest mt-0.5">CEO & Founder</p>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Mrs. Kumutha Krishnamoorthy is the visionary CEO & Founder of SK Smart Investments, leading the organization with a strong commitment to integrity, innovation, and customer-first financial services.
            </p>

            {kumuthaExpanded && (
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm text-left mt-2 space-y-3 pt-4 border-t border-slate-200/30 w-full">
                <p>
                  Under her leadership, the company has built a reputation for providing reliable insurance and investment solutions that empower individuals, families, and businesses to achieve long-term financial security.
                </p>
                <p>
                  With a passion for excellence and a deep understanding of customer needs, she focuses on creating personalized financial solutions while fostering lasting relationships built on trust, transparency, and professional ethics.
                </p>
                <p>
                  Her leadership continues to drive SK Smart Investments' growth, ensuring every client receives expert guidance, exceptional service, and continuous support throughout their financial journey.
                </p>
                
                <div className="pt-2">
                  <p className="font-extrabold text-[10px] uppercase tracking-wider text-gold-500 text-center mb-2">Professional Highlights</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-medium">
                    <li>CEO & Founder of SK Smart Investments.</li>
                    <li>Leads the company's strategic vision and business growth.</li>
                    <li>Oversees daily operations with a focus on service excellence.</li>
                    <li>Champions ethical financial practices and transparent customer relationships.</li>
                    <li>Dedicated to delivering customized insurance and investment solutions.</li>
                    <li>Committed to helping individuals and families achieve long-term financial stability.</li>
                    <li>Focuses on innovation, customer satisfaction, and sustainable business growth.</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/20">
                  <p className="font-extrabold text-[10px] uppercase tracking-wider text-gold-500 text-center mb-2">Professional Experience</p>
                  <p className="text-[11px] font-bold text-navy-950 dark:text-white uppercase mb-1">CEO & Founder</p>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">SK Smart Investments | Kanchipuram, Tamil Nadu</p>
                  <p className="text-[11px] leading-relaxed font-medium mb-3">
                    As the CEO & Founder of SK Smart Investments, I oversee the company's strategic vision and daily operations while leading a dedicated team committed to delivering premium insurance and wealth solutions. My focus is on driving innovation, maintaining service excellence, and fostering transparent relationships to ensure long-term value for every client.
                  </p>
                  <p className="font-bold text-[10px] text-navy-950 dark:text-white uppercase mb-1.5">Key Responsibilities:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-medium">
                    <li>Define and execute the company's strategic planning and business vision.</li>
                    <li>Lead daily business operations, promoting a culture of professionalism and client success.</li>
                    <li>Oversee customized insurance distribution portfolios in partnership with India's leading providers.</li>
                    <li>Enforce ethical financial standards, complete transparency, and customer-first values.</li>
                    <li>Support families and businesses in achieving long-term financial security and wealth preservation.</li>
                    <li>Drive innovative digital portals and tools to simplify policy comparison and issuance.</li>
                    <li>Champion claims assistance initiatives to ensure a stress-free experience for policyholders.</li>
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => setKumuthaExpanded(!kumuthaExpanded)}
              className="text-[10px] font-extrabold text-gold-500 hover:text-gold-600 transition-colors uppercase tracking-wider pt-2 flex items-center space-x-1 cursor-pointer"
            >
              <span>{kumuthaExpanded ? 'Show Less' : 'View Full Profile & Experience'}</span>
            </button>
          </div>

          {/* Mr. Prakash Gajendiran */}
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 flex flex-col items-center text-center space-y-4 transition-all duration-300 shadow-md">
            <div className="w-24 h-24 rounded-full border-2 border-gold-500 overflow-hidden shadow-lg shrink-0 bg-navy-900">
              <img 
                src="/prakash_gajendiran.jpg" 
                alt="Mr. Prakash Gajendiran" 
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-gold-500 text-3xl font-extrabold font-serif">PG</span>';
                }}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white">Mr. Prakash Gajendiran</h3>
              <p className="text-xs text-gold-500 font-bold uppercase tracking-widest mt-0.5">Founder & CEO</p>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Certified Financial Consultant & Senior Business Associate Leader with over 22 years of experience, serving as Founder & CEO of SK Smart Investments.
            </p>

            {prakashExpanded && (
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm text-left mt-2 space-y-3 pt-4 border-t border-slate-200/30 w-full">
                <p>
                  Throughout his professional journey, he has guided countless clients in making informed financial decisions by offering expert advice on Life Insurance, Health Insurance, Retirement Planning, Tax Saving Strategies, Investment Planning, Mutual Funds, and Wealth Creation.
                </p>
                <p>
                  Recognized as the No. 1 Senior Business Associate Leader in Kanchipuram, he is also a three-time consecutive Aura Achiever at Tata AIA Life Insurance, reflecting his unwavering commitment to professional excellence, customer satisfaction, and ethical financial practices.
                </p>
                <p>
                  His philosophy is centered on building long-term relationships through trust, transparency, and personalized financial guidance, ensuring every client receives solutions aligned with their unique goals and aspirations.
                </p>
                
                <div className="pt-2">
                  <p className="font-extrabold text-[10px] uppercase tracking-wider text-gold-500 text-center mb-2">Professional Highlights</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-medium">
                    <li>22+ Years of Industry Experience.</li>
                    <li>Certified Financial Consultant.</li>
                    <li>Founder & CEO – SK Smart Investments.</li>
                    <li>No. 1 Senior Business Associate Leader – Kanchipuram.</li>
                    <li>Three-Time Consecutive Aura Achiever – Tata AIA Life Insurance.</li>
                    <li>Expert in Insurance, Investments, Retirement Planning, Tax Saving, and Wealth Creation.</li>
                    <li>Dedicated to Ethical Financial Advisory and Long-Term Client Success.</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/20">
                  <p className="font-extrabold text-[10px] uppercase tracking-wider text-gold-500 text-center mb-2">Professional Experience</p>
                  <p className="text-[11px] font-bold text-navy-950 dark:text-white uppercase mb-1">Founder & CEO</p>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">SK Smart Investments | Kanchipuram, Tamil Nadu</p>
                  <p className="text-[11px] leading-relaxed font-medium mb-3">
                    As the Founder & CEO of SK Smart Investments, I oversee the company's strategic vision and financial advisory services while leading a dedicated team committed to delivering premium insurance and wealth solutions. My focus is on driving innovation, maintaining service excellence, and fostering transparent relationships to ensure long-term value for every client.
                  </p>
                  <p className="font-bold text-[10px] text-navy-950 dark:text-white uppercase mb-1.5">Key Responsibilities:</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-medium">
                    <li>Define and execute the company's strategic planning and business vision.</li>
                    <li>Lead daily business operations, promoting a culture of professionalism and client success.</li>
                    <li>Oversee customized insurance distribution portfolios in partnership with India's leading providers.</li>
                    <li>Enforce ethical financial standards, complete transparency, and customer-first values.</li>
                    <li>Support families and businesses in achieving long-term financial security and wealth preservation.</li>
                    <li>Drive innovative digital portals and tools to simplify policy comparison and issuance.</li>
                    <li>Champion claims assistance initiatives to ensure a stress-free experience for policyholders.</li>
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => setPrakashExpanded(!prakashExpanded)}
              className="text-[10px] font-extrabold text-gold-500 hover:text-gold-600 transition-colors uppercase tracking-wider pt-2 flex items-center space-x-1 cursor-pointer"
            >
              <span>{prakashExpanded ? 'Show Less' : 'View Full Profile & Experience'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Social Media Channels Section */}
      <div className="space-y-8 text-center pt-8 border-t border-slate-200/50 dark:border-white/5">
        <div className="space-y-2">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
            Connect With Us
          </span>
          <h2 className="text-2xl font-bold text-navy-950 dark:text-white">
            Follow Our Social Channels
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Stay updated with corporate announcements, financial literacy tips, and investment guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* Instagram Card */}
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-2xl shrink-0">
                <FaInstagram />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">Instagram Feed</h3>
                <a 
                  href="https://www.instagram.com/sk_smartinvestments/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-pink-500 hover:underline"
                >
                  @sk_smartinvestments
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Join our Instagram community for real-time market updates, client testimonials, daily investment insights, and claims service announcements.
            </p>
            <a 
              href="https://www.instagram.com/sk_smartinvestments/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center py-2 px-4 rounded-xl border border-pink-500/30 text-pink-500 text-[10px] font-extrabold uppercase tracking-wider hover:bg-pink-500/5 transition-all text-center w-full shadow-sm"
            >
              Follow on Instagram
            </a>
          </div>

          {/* LinkedIn Card */}
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
                <FaLinkedin />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">LinkedIn Company</h3>
                <a 
                  href="https://www.linkedin.com/company/sksmartinvestments/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:underline"
                >
                  SK Smart Investments
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Connect with our corporate page for corporate partnerships, agent recruitment pathways, industry analyses, and company news.
            </p>
            <a 
              href="https://www.linkedin.com/company/sksmartinvestments/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center py-2 px-4 rounded-xl border border-blue-500/30 text-blue-500 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider hover:bg-blue-500/5 transition-all text-center w-full shadow-sm"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* What is Insurance Section */}
      <div className="glass-panel dark:glass-panel-gold rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 space-y-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-navy-950 dark:text-white mt-2">
            {t('what_is_ins_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {t('what_is_ins_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Card 1: What is Insurance */}
          <div className="p-5 bg-white dark:bg-navy-900/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center text-lg">
              <FaShieldAlt />
            </div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">{t('card_1_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('card_1_desc')}
            </p>
          </div>

          {/* Card 2: Health Cover */}
          <div className="p-5 bg-white dark:bg-navy-900/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center text-lg">
              <FaHeartbeat />
            </div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">{t('card_2_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('card_2_desc')}
            </p>
          </div>

          {/* Card 3: Life Insurance */}
          <div className="p-5 bg-white dark:bg-navy-900/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center text-lg">
              <FaAward />
            </div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">{t('card_3_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('card_3_desc')}
            </p>
          </div>

          {/* Card 4: Motor & General */}
          <div className="p-5 bg-white dark:bg-navy-900/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center text-lg">
              <FaHome />
            </div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">{t('card_4_title')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('card_4_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Overlay */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 cursor-zoom-out" 
            onClick={() => setSelectedAward(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-3xl w-full bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-2xl p-4 border border-gold-400/20 text-left space-y-4 relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setSelectedAward(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer z-10"
              >
                <FaTimes />
              </button>

              <img 
                src={selectedAward.img} 
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow" 
                alt={selectedAward.title} 
              />
              <div className="px-2 pb-2">
                <h3 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider">{selectedAward.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedAward.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default About;
