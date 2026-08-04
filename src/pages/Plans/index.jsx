import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import ScrollStack, { ScrollStackItem } from '../../components/ScrollStack/ScrollStack';
import { subscribeToCollection } from '../../services/firebaseService';
import { FaCheck, FaStar, FaCheckCircle, FaShieldAlt, FaBriefcase, FaFileSignature, FaHeartbeat, FaUserShield, FaCar, FaSearch, FaArrowRight, FaTimes, FaMapMarkerAlt, FaHospital, FaMoneyBillWave, FaPlane } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

// Upgraded Company Logo Component with Glassmorphism
const CompanyLogo = ({ company }) => {
  const comp = (company || '').toLowerCase();
  let logoUrl = '/logos/lic.png';

  if (comp.includes('sbi')) logoUrl = '/logos/sbi_life.png';
  else if (comp.includes('postal')) logoUrl = '/logos/Postal Office.png';
  else if (comp.includes('hdfc')) logoUrl = '/logos/hdfc_life.png';
  else if (comp.includes('icici')) logoUrl = '/logos/icici_prudential.png';
  else if (comp.includes('tata')) logoUrl = '/logos/tata_aia.png';
  else if (comp.includes('star')) logoUrl = '/logos/star_health.png';
  else if (comp.includes('niva') || comp.includes('bupa')) logoUrl = '/logos/niva_bupa.png';
  else if (comp.includes('bajaj')) logoUrl = '/logos/bajaj_allianz.png';
  else if (comp.includes('future') || comp.includes('generali')) logoUrl = '/logos/Future Generali.jpg';
  else if (comp.includes('birla') || comp.includes('aditya')) logoUrl = '/logos/Aditya Birla Sun Life.jpg';
  else if (comp.includes('oriental')) logoUrl = '/logos/oriental_insurance.png';
  else if (comp.includes('allianz')) logoUrl = '/logos/bajaj_allianz.png';
  else if (comp.includes('kotak')) logoUrl = '/logos/Kotak Mahindra Life.jpg';
  else if (comp.includes('pnb')) logoUrl = '/logos/PNB MetLife.png';
  else if (comp.includes('manipal') || comp.includes('cigna')) logoUrl = '/logos/ManipalCigna Health.png';
  else if (comp.includes('max') || comp.includes('axis')) logoUrl = '/logos/axis_max.png';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 rounded-2xl bg-white backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:border-brand-accent/50 transition-colors duration-500 overflow-hidden">
      <img
        src={logoUrl}
        alt={company}
        className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
};

export const Plans = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCompanyFilter, setActiveCompanyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Pricing specific state
  const [isMonthly, setIsMonthly] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const switchRef = React.useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleToggle = (checked) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "#f6ff00",
          "#ffffff",
          "#333333",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) setActiveFilter(category);
    else setActiveFilter('ALL');
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection('plans', (data) => {
      if (data && data.length > 0) {
        const sorted = [...data].sort((a, b) => {
          const orderA = a.displayOrder !== undefined ? parseInt(a.displayOrder) : 999;
          const orderB = b.displayOrder !== undefined ? parseInt(b.displayOrder) : 999;
          return orderA - orderB;
        });
        setPlans(sorted);
      } else {
        setPlans([]); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filterOptions = [
    { label: 'All Plans', value: 'ALL', icon: FaShieldAlt },
    { label: 'Term Insurance', value: 'Term Insurance', icon: FaUserShield },
    { label: 'ULIP', value: 'ULIP', icon: FaBriefcase },
    { label: 'Savings Plan', value: 'Savings Plan', icon: FaFileSignature },
    { label: 'Pension Plan', value: 'Pension Plan', icon: FaUserShield },
    { label: 'Child Plan', value: 'Child Plan', icon: FaShieldAlt },
    { label: 'Health Care', value: 'Health', icon: FaHeartbeat },
    { label: 'Motor & Home', value: 'Motor', icon: FaCar }
  ];

  const ALL_SIXTEEN_COMPANIES = [
    { label: 'All Insurers', value: 'ALL' },
    { label: 'Postal Office', value: 'Postal Office' },
    { label: 'Future Generali', value: 'Future Generali' },
    { label: 'Bajaj', value: 'Bajaj' },
    { label: 'Aditya Birla', value: 'Aditya Birla' },
    { label: 'Oriental', value: 'Oriental Insurance' },
    { label: 'Tata AIA', value: 'Tata AIA' },
    { label: 'ICICI', value: 'ICICI' },
    { label: 'HDFC', value: 'HDFC' },
    { label: 'SBI', value: 'SBI' },
    { label: 'Niva Bupa', value: 'Niva Bupa' },
    { label: 'Allianz', value: 'Allianz' },
    { label: 'Kotak', value: 'Kotak' },
    { label: 'PNB', value: 'PNB' },
    { label: 'Manipal Cigna', value: 'Manipal Cigna' },
    { label: 'Star Health', value: 'Star Health' },
    { label: 'Axis Max', value: 'Axis Max' }
  ];

  const finalFilteredPlans = plans.filter(plan => {
    if (plan.isVisible === false || plan.status === 'Inactive') return false;

    let categoryMatch = true;
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'Motor') {
        categoryMatch = plan.category === 'Motor' || plan.category === 'Home' || plan.category === 'Travel';
      } else {
        categoryMatch = plan.category === activeFilter || plan.categoryTag === activeFilter;
      }
    }

    let companyMatch = true;
    if (activeCompanyFilter !== 'ALL') {
      const compLower = (plan.company || '').toLowerCase();
      const targetLower = activeCompanyFilter.toLowerCase();

      if (targetLower === 'postal office') companyMatch = compLower.includes('postal');
      else if (targetLower === 'future generali') companyMatch = compLower.includes('future') || compLower.includes('generali');
      else if (targetLower === 'bajaj') companyMatch = compLower.includes('bajaj');
      else if (targetLower === 'aditya birla') companyMatch = compLower.includes('aditya') || compLower.includes('birla');
      else if (targetLower === 'oriental') companyMatch = compLower.includes('oriental');
      else if (targetLower === 'tata aia') companyMatch = compLower.includes('tata');
      else if (targetLower === 'icici') companyMatch = compLower.includes('icici');
      else if (targetLower === 'hdfc') companyMatch = compLower.includes('hdfc');
      else if (targetLower === 'sbi') companyMatch = compLower.includes('sbi');
      else if (targetLower === 'niva bupa') companyMatch = compLower.includes('niva') || compLower.includes('bupa');
      else if (targetLower === 'allianz') companyMatch = compLower.includes('allianz');
      else if (targetLower === 'kotak') companyMatch = compLower.includes('kotak');
      else if (targetLower === 'pnb') companyMatch = compLower.includes('pnb');
      else if (targetLower === 'manipal cigna') companyMatch = compLower.includes('manipal') || compLower.includes('cigna');
      else if (targetLower === 'star health') companyMatch = compLower.includes('star');
      else if (targetLower === 'axis max') companyMatch = compLower.includes('max') || compLower.includes('axis');
    }

    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (plan.name || plan.title || '').toLowerCase();
      const comp = (plan.company || '').toLowerCase();
      const desc = (plan.description || '').toLowerCase();
      const cat = (plan.category || '').toLowerCase();
      searchMatch = name.includes(q) || comp.includes(q) || desc.includes(q) || cat.includes(q);
    }

    return categoryMatch && companyMatch && searchMatch;
  });

  const handleApply = (plan) => {
    setSelectedPlan(plan);
    setWizardStep(1);
    setShowApplyModal(true);
  };

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setWizardStep(2);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen text-white overflow-hidden pb-32">
      
      {/* Background Animated Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(246,255,0,0.05)_0%,rgba(0,0,0,0)_50%)]"
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10 border-b border-white/5">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 w-full">

          <h1 className="text-5xl sm:text-7xl font-[900] text-white uppercase tracking-[-2px] leading-[1.1]">
            Premium Insurance <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Portfolios</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed mt-6">
            Browse our curated catalog of comprehensive plans. Filter policies and start your digital application instantly.
          </p>
        </motion.div>

        {/* Massive Search Bar */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full max-w-3xl mt-16 relative group">
          <div className="absolute inset-0 bg-brand-accent/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative flex items-center w-full bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-8 shadow-2xl focus-within:border-brand-accent/50 focus-within:bg-black transition-all duration-300">
            <FaSearch className="text-brand-accent text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plan name, company, or category..."
              className="w-full bg-transparent border-none text-white px-6 py-4 focus:outline-none placeholder-neutral-500 font-bold text-lg"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0">
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Filters (Categories) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12 relative z-10">
        <div className="flex flex-wrap justify-center gap-4">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-[900] uppercase tracking-widest transition-all duration-300 border ${
                  isActive 
                    ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_30px_rgba(246,255,0,0.3)] scale-105' 
                    : 'bg-neutral-900/40 text-neutral-400 border-white/10 hover:border-brand-accent/40 hover:text-white'
                }`}
              >
                <Icon className={isActive ? 'text-black text-sm' : 'text-brand-accent text-sm'} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Companies Panel */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-20 relative z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-extrabold border-b border-white/10 pb-2">Partner Insurers</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 p-6 bg-neutral-900/40 backdrop-blur-xl rounded-[40px] border border-white/5 shadow-2xl max-w-6xl mx-auto">
          {ALL_SIXTEEN_COMPANIES.map((comp) => {
            const isActive = activeCompanyFilter === comp.value;
            return (
              <button
                key={comp.value}
                onClick={() => setActiveCompanyFilter(comp.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-[10px] font-[900] uppercase tracking-wider transition-all duration-300 border ${
                  isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                    : 'bg-black/50 text-neutral-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{comp.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Pricing Header & Toggle */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-bold uppercase tracking-wider ${isMonthly ? 'text-white' : 'text-neutral-500'}`}>
              Billed Monthly
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!isMonthly}
                onChange={(e) => handleToggle(e.target.checked)}
              />
              <div ref={switchRef} className="w-14 h-7 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-accent transition-colors duration-300"></div>
            </label>
            <span className={`text-sm font-bold uppercase tracking-wider ${!isMonthly ? 'text-brand-accent' : 'text-neutral-500'}`}>
              Annual billing <span className="text-brand-accent drop-shadow-md ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {finalFilteredPlans.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-neutral-900/40 rounded-[48px] border border-white/5 shadow-2xl">
            <FaShieldAlt className="text-6xl text-neutral-800 mx-auto mb-6" />
            <h3 className="text-3xl font-[900] text-white uppercase tracking-wider mb-4">No Plans Found</h3>
            <p className="text-neutral-500 font-medium text-lg max-w-md mx-auto">
              We couldn't find any policies matching your exact criteria. Try clearing the filters or searching for a different provider.
            </p>
          </motion.div>
        ) : (
          <>
            {!isDesktop ? (
              <ScrollStack useWindowScroll={true} itemStackDistance={50} stackPosition="15%">
                {finalFilteredPlans.map((plan, idx) => {
                  const monthlyPrice = parseInt(plan.premiumMonthly || plan.premiumAmount) || 0;
                  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
                  const displayPrice = isMonthly ? monthlyPrice : yearlyPrice;
                  const displayPeriod = isMonthly ? "mo" : "yr";

                  const innerContent = (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,255,0,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
                      <div className="flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-20 h-10">
                            <CompanyLogo company={plan.company} />
                          </div>
                          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-black bg-white px-3 py-1 rounded-full">
                            {plan.categoryTag || plan.category}
                          </span>
                        </div>
                        <p className="text-base font-[900] text-neutral-300 uppercase tracking-wider text-left border-b border-white/10 pb-3">
                          {plan.name || plan.title}
                        </p>
                        <div className="mt-4 flex items-end justify-start gap-x-1 border-brand-accent/30 pl-2 text-left">
                          <span className="text-4xl font-[900] tracking-tighter text-white">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest leading-6 text-neutral-500 mb-1 ml-1">
                            / {displayPeriod}
                          </span>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] font-extrabold leading-5 text-brand-accent text-left mt-2 pl-2">
                          {isMonthly ? "billed monthly" : "billed annually"}
                        </p>
                        <div className="mt-2 mb-4 text-left pl-2">
                          <p className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-[0.2em] mb-1">Coverage</p>
                          <p className="text-base font-[900] text-white">{plan.coverageAmount}</p>
                        </div>
                        <ul className="mt-2 gap-2 flex flex-col flex-1 border-t border-white/10 pt-4">
                          {plan.features?.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-3">
                              <FaCheck className="h-3.5 w-3.5 text-brand-accent mt-0.5 flex-shrink-0" />
                              <span className="text-left text-xs text-neutral-300 font-medium leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => handleApply(plan)}
                          className={cn(
                            "mt-6 group relative w-full gap-2 overflow-hidden rounded-full py-3 text-[10px] sm:text-xs font-[900] uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-300 shadow-xl",
                            "bg-brand-accent text-black hover:bg-white hover:scale-105"
                          )}
                        >
                          Apply Now
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-6 text-[11px] font-medium leading-5 text-neutral-500 text-left line-clamp-2 px-2">
                          {plan.description}
                        </p>
                      </div>
                    </>
                  );

                  return (
                    <ScrollStackItem key={plan.id} itemClassName="!h-auto !p-0 !my-2 !bg-transparent !shadow-none border-0 !rounded-[1.5rem]">
                      <div className={cn(
                        `rounded-[1.5rem] border p-5 md:p-6 bg-neutral-900/95 backdrop-blur-2xl text-center flex flex-col relative overflow-hidden transition-colors hover:bg-neutral-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`,
                        "border-brand-accent border-2 bg-neutral-900/95 shadow-[0_0_50px_rgba(246,255,0,0.1)]",
                        "h-full"
                      )}>
                        {innerContent}
                      </div>
                    </ScrollStackItem>
                  );
                })}
              </ScrollStack>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 xl:gap-16">
                {finalFilteredPlans.map((plan, idx) => {
                  const isPopular = Boolean(plan.badge);
                  const columnPos = idx % 3;
                  const monthlyPrice = parseInt(plan.premiumMonthly || plan.premiumAmount) || 0;
                  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
                  const displayPrice = isMonthly ? monthlyPrice : yearlyPrice;
                  const displayPeriod = isMonthly ? "mo" : "yr";

                  const innerContent = (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,255,0,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
                      <div className="flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-20 h-10">
                            <CompanyLogo company={plan.company} />
                          </div>
                          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-black bg-white px-3 py-1 rounded-full">
                            {plan.categoryTag || plan.category}
                          </span>
                        </div>
                        <p className="text-base font-[900] text-neutral-300 uppercase tracking-wider text-left border-b border-white/10 pb-3">
                          {plan.name || plan.title}
                        </p>
                        <div className="mt-4 flex items-end justify-start gap-x-1 border-brand-accent/30 pl-2 text-left">
                          <span className="text-4xl font-[900] tracking-tighter text-white">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest leading-6 text-neutral-500 mb-1 ml-1">
                            / {displayPeriod}
                          </span>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] font-extrabold leading-5 text-brand-accent text-left mt-2 pl-2">
                          {isMonthly ? "billed monthly" : "billed annually"}
                        </p>
                        <div className="mt-2 mb-4 text-left pl-2">
                          <p className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-[0.2em] mb-1">Coverage</p>
                          <p className="text-base font-[900] text-white">{plan.coverageAmount}</p>
                        </div>
                        <ul className="mt-2 gap-2 flex flex-col flex-1 border-t border-white/10 pt-4">
                          {plan.features?.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-3">
                              <FaCheck className="h-3.5 w-3.5 text-brand-accent mt-0.5 flex-shrink-0" />
                              <span className="text-left text-xs text-neutral-300 font-medium leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => handleApply(plan)}
                          className={cn(
                            "mt-6 group relative w-full gap-2 overflow-hidden rounded-full py-3 text-[10px] sm:text-xs font-[900] uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-300 shadow-xl",
                            "bg-brand-accent text-black hover:bg-white hover:scale-105"
                          )}
                        >
                          Apply Now
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-6 text-[11px] font-medium leading-5 text-neutral-500 text-left line-clamp-2 px-2">
                          {plan.description}
                        </p>
                      </div>
                    </>
                  );

                  return (
                    <motion.div 
                      key={plan.id}
                      initial={{ y: 50, opacity: 1 }}
                      whileInView={{
                        y: isPopular ? -20 : 0,
                        opacity: 1,
                        x: columnPos === 2 ? -30 : columnPos === 0 ? 30 : 0,
                        scale: columnPos === 0 || columnPos === 2 ? 0.94 : 1.0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.6,
                        type: "spring",
                        stiffness: 100,
                        damping: 30,
                        delay: (idx % 3) * 0.1,
                        opacity: { duration: 0.5 },
                      }}
                      className={cn(
                        `rounded-[1.5rem] border p-5 md:p-6 bg-neutral-900/95 backdrop-blur-2xl text-center lg:flex lg:flex-col lg:justify-center relative overflow-hidden transition-colors hover:bg-neutral-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`,
                        "border-brand-accent border-2 bg-neutral-900/95 shadow-[0_0_50px_rgba(246,255,0,0.1)]",
                        "flex flex-col",
                        !isPopular && "mt-5",
                        columnPos === 0 || columnPos === 2
                          ? "md:z-0 transform translate-x-0 translate-y-0 rotate-y-[10deg]"
                          : "md:z-10",
                        columnPos === 0 && "origin-right",
                        columnPos === 2 && "origin-left"
                      )}
                    >
                      {innerContent}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Disclaimer */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mt-20 relative z-10">
        <div className="p-6 bg-neutral-900/40 rounded-[32px] border border-white/5 text-center">
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            <strong className="text-brand-accent uppercase tracking-widest mr-2">Disclaimer:</strong> 
            Premiums shown are indicative only and may vary based on age, health, occupation, policy term, underwriting, and other eligibility criteria.
          </p>
        </div>
      </section>

      {/* Apply Wizard Modal (Dark Theme Overridden via internal styles) */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={selectedPlan ? `Policy Application: ${selectedPlan.name}` : ''}
        size="md"
      >
        <div className="bg-neutral-950 text-white rounded-[32px] p-2 -m-6 sm:-m-8">
          {wizardStep === 1 ? (
            <form onSubmit={handleWizardSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-[900] uppercase tracking-tight text-white mb-2">Secure Your Plan</h3>
                <p className="text-sm text-neutral-400 font-medium">Please provide details below to configure and request policy underwriting approval.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-[900] text-brand-accent uppercase tracking-[0.2em] mb-2 pl-2">Full Legal Name</label>
                  <input required type="text" className="w-full px-5 py-4 text-sm bg-neutral-900 border border-white/10 rounded-[20px] text-white focus:border-brand-accent focus:bg-black outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-[900] text-brand-accent uppercase tracking-[0.2em] mb-2 pl-2">Email Address</label>
                  <input required type="email" className="w-full px-5 py-4 text-sm bg-neutral-900 border border-white/10 rounded-[20px] text-white focus:border-brand-accent focus:bg-black outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-[900] text-brand-accent uppercase tracking-[0.2em] mb-2 pl-2">Mobile Phone</label>
                  <input required type="tel" className="w-full px-5 py-4 text-sm bg-neutral-900 border border-white/10 rounded-[20px] text-white focus:border-brand-accent focus:bg-black outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-[900] text-brand-accent uppercase tracking-[0.2em] mb-2 pl-2">Date of Birth</label>
                  <input required type="date" className="w-full px-5 py-4 text-sm bg-neutral-900 border border-white/10 rounded-[20px] text-white focus:border-brand-accent focus:bg-black outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-[900] text-brand-accent uppercase tracking-[0.2em] mb-2 pl-2">Upload ID Copy</label>
                <div className="p-8 border-2 border-dashed border-white/10 rounded-[24px] text-center cursor-pointer hover:bg-neutral-900 hover:border-brand-accent/50 transition-all group">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-brand-accent transition-colors">Click to upload document (PDF/JPEG)</span>
                </div>
              </div>

              <div className="p-6 bg-brand-accent rounded-[24px] text-black">
                <p className="font-[900] uppercase tracking-widest text-sm mb-4">Premium Quote Outline</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-black/70 font-bold text-xs uppercase tracking-wider">Monthly Premium:</span>
                  <span className="font-[900] text-xl">₹{selectedPlan?.premiumMonthly}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70 font-bold text-xs uppercase tracking-wider">Standard Sum Assured:</span>
                  <span className="font-[900] text-xl">{selectedPlan?.coverageAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
                <button type="button" onClick={() => setShowApplyModal(false)} disabled={isSubmitting} className="px-8 py-4 rounded-full text-white font-[900] uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-4 rounded-full bg-white text-black font-[900] uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center justify-center gap-3">
                  {isSubmitting ? 'Processing...' : 'Submit Application'}
                  {!isSubmitting && <FaArrowRight />}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-20 px-8">
              <div className="inline-flex p-6 rounded-full bg-brand-accent/20 text-brand-accent text-5xl mb-8 animate-pulse shadow-[0_0_40px_rgba(246,255,0,0.2)]">
                <FaCheckCircle />
              </div>
              <h3 className="text-3xl font-[900] text-white uppercase tracking-tight mb-4">Application Received!</h3>
              <p className="text-sm text-neutral-400 font-medium max-w-md mx-auto leading-relaxed mb-10">
                Your application has been logged in our system. A verification case has been assigned to our team. We will contact you shortly.
              </p>
              <button onClick={() => setShowApplyModal(false)} className="px-10 py-4 rounded-full bg-brand-accent text-black font-[900] uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_20px_rgba(246,255,0,0.3)]">
                Close Wizard
              </button>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};
export default Plans;
